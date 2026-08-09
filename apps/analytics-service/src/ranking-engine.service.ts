import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@app/database';
import { RedisDiscoveryService, BehaviourEventType } from '@app/common';
import { ClickHouseService } from './clickhouse.service';

interface RankedProduct {
  id: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  createdAt: Date | string;
  discountPercentage: number;
}

type ScoreMap = Record<string, number>;

function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (value && typeof value === 'object' && 'toNumber' in value) {
    const n = (value as { toNumber(): number }).toNumber();
    return Number.isFinite(n) ? n : 0;
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

const DAY = 86400 * 1000;

interface Profile {
  name: string;
  weights: Record<string, number>;
}

const PROFILES: Record<string, Profile> = {
  default: {
    name: 'default',
    weights: {
      sales: 0.3,
      conversion: 0.2,
      search: 0.15,
      views: 0.1,
      rating: 0.1,
      freshness: 0.05,
      inventory: 0.05,
      business: 0.05,
    },
  },
  trending: {
    name: 'trending',
    weights: {
      views: 0.25,
      search: 0.2,
      cart: 0.2,
      wishlist: 0.1,
      purchase: 0.15,
      rating: 0.1,
    },
  },
  bestsellers: {
    name: 'bestsellers',
    weights: {
      purchase: 0.5,
      revenue: 0.2,
      rating: 0.15,
      conversion: 0.15,
    },
  },
};

@Injectable()
export class RankingEngineService implements OnModuleInit {
  private readonly logger = new Logger(RankingEngineService.name);

  constructor(
    private readonly prisma: DatabaseService,
    private readonly redisDiscovery: RedisDiscoveryService,
    private readonly clickhouse: ClickHouseService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): void {
    const interval = parseInt(this.configService.get('RANKING_INTERVAL_MS', '900000'), 10);
    setTimeout(() => void this.run(), 3000);
    setInterval(() => void this.run(), Math.max(60000, interval));
  }

  async run(): Promise<void> {
    try {
      this.logger.log('Ranking engine run started');
      const products = await this.fetchProducts();
      if (products.length === 0) {
        this.logger.warn('Ranking engine: no active products found');
        return;
      }
      this.logger.log(`Ranking engine: evaluating ${products.length} products`);

      const signals = await this.collectSignals();
      const boosts = await this.redisDiscovery.getBoosts();

      const scores = this.scoreProducts(products, signals, boosts);
      const meta = products.map((p) => ({
        id: p.id,
        category: p.category,
        price: p.price,
        rating: p.rating,
        discountPercentage: p.discountPercentage,
      }));
      await this.redisDiscovery.setProductsMeta(meta);

      await this.publishRankedLists(products, scores);
      await this.computeFrequentlyBought();

      this.logger.log('Ranking engine run completed');
    } catch (error) {
      this.logger.error(`Ranking engine run failed: ${(error as Error).message}`);
    }
  }

  // ---------------------------------------------------------------
  // Data collection
  // ---------------------------------------------------------------

  private async fetchProducts(): Promise<RankedProduct[]> {
    const shards = this.prisma.getAllShards();
    const results = await Promise.all(
      shards.map((shard) =>
        shard.product.findMany({
          where: { isActive: true },
          select: {
            id: true,
            category: true,
            price: true,
            rating: true,
            stock: true,
            createdAt: true,
            discountPercentage: true,
          },
        }),
      ),
    );
    return results.flat().map((p) => ({
      ...p,
      price: toNumber(p.price),
      rating: toNumber(p.rating),
      discountPercentage: toNumber(p.discountPercentage),
    }));
  }

  private async collectSignals() {
    const types = [
      BehaviourEventType.PRODUCT_VIEW,
      BehaviourEventType.SEARCH_CLICK,
      BehaviourEventType.ADD_TO_CART,
      BehaviourEventType.WISHLIST_ADD,
      BehaviourEventType.PURCHASE,
      BehaviourEventType.RETURN_PRODUCT,
    ] as const;

    const [views7, views30, search7, cart7, wishlist7, purchase7, purchase30, returns7] =
      await Promise.all([
        this.redisDiscovery.getAggregatedCounts(types[0], 7),
        this.redisDiscovery.getAggregatedCounts(types[0], 30),
        this.redisDiscovery.getAggregatedCounts(types[1], 7),
        this.redisDiscovery.getAggregatedCounts(types[2], 7),
        this.redisDiscovery.getAggregatedCounts(types[3], 7),
        this.redisDiscovery.getAggregatedCounts(types[4], 7),
        this.redisDiscovery.getAggregatedCounts(types[4], 30),
        this.redisDiscovery.getAggregatedCounts(types[5], 7),
      ]);

    return {
      views7: this.normalize(views7),
      views30: this.normalize(views30),
      search7: this.normalize(search7),
      cart7: this.normalize(cart7),
      wishlist7: this.normalize(wishlist7),
      purchase7: this.normalize(purchase7),
      purchase30: this.normalize(purchase30),
      returns7: this.normalize(returns7),
    };
  }

  private normalize(counts: Record<string, number>): ScoreMap {
    const values = Object.values(counts);
    if (values.length === 0) return {};
    const max = Math.max(...values.map((v) => Math.log1p(v)));
    if (max <= 0) return {};
    const out: ScoreMap = {};
    for (const [id, count] of Object.entries(counts)) {
      out[id] = Math.log1p(count) / max;
    }
    return out;
  }

  // ---------------------------------------------------------------
  // Scoring
  // ---------------------------------------------------------------

  private scoreProducts(
    products: RankedProduct[],
    signals: {
      views7: ScoreMap;
      views30: ScoreMap;
      search7: ScoreMap;
      cart7: ScoreMap;
      wishlist7: ScoreMap;
      purchase7: ScoreMap;
      purchase30: ScoreMap;
      returns7: ScoreMap;
    },
    boosts: Record<string, number>,
  ) {
    const now = Date.now();
    const byId = new Map(products.map((p) => [p.id, p]));
    const maxBoost = Math.max(1, ...Object.values(boosts));

    const defaultScores: Record<string, number> = {};
    const trendingScores: Record<string, number> = {};
    const bestsellerScores: Record<string, number> = {};

    for (const product of products) {
      const id = product.id;
      const views = signals.views7[id] || 0;
      const views30 = signals.views30[id] || 0;
      const search = signals.search7[id] || 0;
      const cart = signals.cart7[id] || 0;
      const wishlist = signals.wishlist7[id] || 0;
      const purchase = signals.purchase7[id] || 0;
      const purchase30 = signals.purchase30[id] || 0;
      const returns = signals.returns7[id] || 0;

      const conversion = views > 0 ? purchase / Math.max(views, 0.0001) : 0;
      const conversionNorm = Math.min(1, conversion * 10);

      const ageDays = (now - new Date(product.createdAt).getTime()) / DAY;
      const freshBoost = ageDays < 30 ? Math.max(0, 1 - ageDays / 30) : 0;

      const revenue30 = purchase30 * Math.max(product.price, 0);

      const ratingNorm = Math.min(1, (product.rating || 0) / 5);
      const returnPenalty = returns * 0.5;
      const inventory = product.stock > 0 ? (product.stock < 5 ? 0.5 : 1) : 0;
      const business = maxBoost > 0 ? (boosts[id] || 0) / maxBoost : 0;

      const sales = Math.max(0, purchase * 0.5 + revenue30 * 0.3 + purchase * 0.2);
      const salesNorm = Math.min(1, sales);

      defaultScores[id] =
        this.blend(PROFILES.default.weights, {
          sales: salesNorm,
          conversion: conversionNorm,
          search,
          views,
          rating: ratingNorm,
          freshness: freshBoost,
          inventory,
          business,
        }) - returnPenalty;

      trendingScores[id] =
        this.blend(PROFILES.trending.weights, {
          views,
          search,
          cart,
          wishlist,
          purchase,
          rating: ratingNorm,
        }) - returnPenalty;

      bestsellerScores[id] =
        this.blend(PROFILES.bestsellers.weights, {
          purchase,
          revenue: revenue30,
          rating: ratingNorm,
          conversion: conversionNorm,
        }) - returnPenalty;

      void byId;
      void views30;
    }

    return { default: defaultScores, trending: trendingScores, bestsellers: bestsellerScores };
  }

  private blend(weights: Record<string, number>, components: Record<string, number>): number {
    let total = 0;
    for (const [key, weight] of Object.entries(weights)) {
      total += weight * (components[key] || 0);
    }
    return total;
  }

  // ---------------------------------------------------------------
  // Publish ranked lists
  // ---------------------------------------------------------------

  private async publishRankedLists(
    products: RankedProduct[],
    scores: { default: ScoreMap; trending: ScoreMap; bestsellers: ScoreMap },
  ) {
    const byCategory = new Map<string, RankedProduct[]>();
    for (const product of products) {
      const cat = product.category || 'uncategorized';
      if (!byCategory.has(cat)) byCategory.set(cat, []);
      byCategory.get(cat)!.push(product);
    }

    await this.redisDiscovery.setRankedList('trending', 'global', this.top(scores.trending, 100));
    await this.redisDiscovery.setRankedList(
      'bestsellers',
      'global',
      this.top(scores.bestsellers, 100),
    );

    for (const [category, list] of byCategory) {
      const catTrending: ScoreMap = {};
      const catBest: ScoreMap = {};
      for (const p of list) {
        catTrending[p.id] = scores.trending[p.id] || 0;
        catBest[p.id] = scores.bestsellers[p.id] || 0;
      }
      await this.redisDiscovery.setRankedList('trending', category, this.top(catTrending, 50));
      await this.redisDiscovery.setRankedList('bestsellers', category, this.top(catBest, 50));
    }

    const deals = products
      .filter((p) => p.discountPercentage > 0 && p.stock > 0)
      .sort((a, b) => {
        const aScore = a.discountPercentage * (0.6 + 0.4 * (scores.trending[a.id] || 0));
        const bScore = b.discountPercentage * (0.6 + 0.4 * (scores.trending[b.id] || 0));
        return bScore - aScore;
      })
      .map((p) => p.id);
    await this.redisDiscovery.setRankedList('deals', 'global', deals.slice(0, 100));
  }

  private top(scores: ScoreMap, limit: number): string[] {
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id);
  }

  // ---------------------------------------------------------------
  // Frequently bought together (ClickHouse co-occurrence)
  // ---------------------------------------------------------------

  private async computeFrequentlyBought(): Promise<void> {
    const rows = await this.clickhouse.query<{ session_id: string; products: string[] }>(
      `SELECT session_id, groupArray(product_id) AS products
       FROM analytics.behaviour_events
       WHERE event_type = 'PURCHASE' AND product_id != '' AND occurred_at >= now() - INTERVAL 30 DAY
       GROUP BY session_id`,
    );

    const pairScores = new Map<string, Map<string, number>>();
    for (const row of rows) {
      const ids = [...new Set(row.products)].filter(Boolean);
      if (ids.length < 2) continue;
      for (let i = 0; i < ids.length; i++) {
        if (!pairScores.has(ids[i])) pairScores.set(ids[i], new Map());
        const others = pairScores.get(ids[i])!;
        for (let j = 0; j < ids.length; j++) {
          if (i === j) continue;
          others.set(ids[j], (others.get(ids[j]) || 0) + 1);
        }
      }
    }

    for (const [productId, others] of pairScores) {
      const ranked = [...others.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([id]) => id);
      await this.redisDiscovery.setFrequentlyBought(productId, ranked);
    }
  }
}
