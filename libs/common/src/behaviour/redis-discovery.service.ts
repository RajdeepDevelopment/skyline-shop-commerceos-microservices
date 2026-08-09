import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { BehaviourEvent, BehaviourEventType } from '../events';

const RECENT_VIEWED_MAX = 20;
const USER_SIGNAL_MAX = 50;
const EVENT_KEY_TTL = 86400 * 35;
const RANKED_LIST_TTL = 15 * 60;
const RECS_LIST_TTL = 30 * 60;
const RECENT_VIEWED_TTL = 86400 * 7;
const PRODUCT_META_TTL = 2 * 60 * 60;
const TOP_PRODUCTS_MAX = 2000;

export type RankKind = 'trending' | 'bestsellers' | 'deals';

@Injectable()
export class RedisDiscoveryService {
  private readonly logger = new Logger(RedisDiscoveryService.name);
  private readonly prefix = 'discovery:';
  private client: Redis | null = null;
  private available = false;

  async init(redisUrl?: string, host?: string, port?: number, password?: string): Promise<void> {
    try {
      this.client = new Redis({
        host: host || 'localhost',
        port: port || 6379,
        password: password || 'password',
        retryStrategy: (times) => Math.min(times * 100, 3000),
        lazyConnect: false,
        connectTimeout: 5000,
      });
      await this.client.ping();
      this.available = true;
      this.logger.log('RedisDiscoveryService connected');
    } catch (error) {
      this.logger.warn(`RedisDiscoveryService unavailable: ${(error as Error).message}`);
      this.client = null;
      this.available = false;
    }
  }

  private get redis(): Redis | null {
    return this.available && this.client ? this.client : null;
  }

  // ---------------------------------------------------------------
  // Keys
  // ---------------------------------------------------------------

  private userRecentKey(actorKey: string): string {
    return `${this.prefix}user:${actorKey}:recent-viewed`;
  }

  private userSignalKey(actorKey: string, type: string): string {
    return `${this.prefix}user:${actorKey}:${type}`;
  }

  private eventCountKey(type: string, dateKey: string): string {
    return `${this.prefix}events:${type}:${dateKey}`;
  }

  private rankedKey(kind: RankKind, scope: string): string {
    return `${this.prefix}${kind}:${scope}`;
  }

  private productViewsKey(): string {
    return `${this.prefix}product-views`;
  }

  static dateKey(d: Date = new Date()): string {
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // ---------------------------------------------------------------
  // Event ingestion (real-time counters + user signals)
  // ---------------------------------------------------------------

  async trackEvent(event: BehaviourEvent, actorKey?: string): Promise<void> {
    const r = this.redis;
    if (!r || !event?.eventType) return;

    const dateKey = RedisDiscoveryService.dateKey(
      event.timestamp ? new Date(event.timestamp) : new Date(),
    );
    const pipeline = r.pipeline();
    const type = event.eventType;
    const productId = event.productId || '';

    if (productId) {
      pipeline.zincrby(this.eventCountKey(type, dateKey), event.quantity || 1, productId);
      pipeline.zincrby(this.productViewsKey(), 1, productId);
      pipeline.zremrangebyrank(this.productViewsKey(), 0, -TOP_PRODUCTS_MAX - 1);
      pipeline.expire(this.productViewsKey(), EVENT_KEY_TTL);
    }

    if (actorKey) {
      if (type === BehaviourEventType.PRODUCT_VIEW && productId) {
        pipeline.lrem(this.userRecentKey(actorKey), 0, productId);
        pipeline.lpush(this.userRecentKey(actorKey), productId);
        pipeline.ltrim(this.userRecentKey(actorKey), 0, RECENT_VIEWED_MAX - 1);
        pipeline.expire(this.userRecentKey(actorKey), RECENT_VIEWED_TTL);
      }
      if (productId) {
        pipeline.lrem(this.userSignalKey(actorKey, type), 0, productId);
        pipeline.lpush(this.userSignalKey(actorKey, type), productId);
        pipeline.ltrim(this.userSignalKey(actorKey, type), 0, USER_SIGNAL_MAX - 1);
        pipeline.expire(this.userSignalKey(actorKey, type), EVENT_KEY_TTL);
      }
    }

    try {
      await pipeline.exec();
      await r.expire(this.eventCountKey(type, dateKey), EVENT_KEY_TTL);
    } catch (error) {
      this.logger.warn(`Failed to track event: ${(error as Error).message}`);
    }
  }

  /** Increment the global popularity counter for a product (analytics consumer). */
  async incrementProductViews(productId: string, increment = 1): Promise<void> {
    const r = this.redis;
    if (!r || !productId) return;
    try {
      await r.zincrby(this.productViewsKey(), increment, productId);
      const count = await r.zcard(this.productViewsKey());
      if (count > TOP_PRODUCTS_MAX) {
        await r.zremrangebyrank(this.productViewsKey(), 0, count - TOP_PRODUCTS_MAX - 1);
      }
      await r.expire(this.productViewsKey(), EVENT_KEY_TTL);
    } catch (error) {
      this.logger.warn(`Failed to increment product views: ${(error as Error).message}`);
    }
  }

  async getTopProducts(limit = 10): Promise<{ productId: string; views: number }[]> {
    const r = this.redis;
    if (!r) return [];
    try {
      const results = await r.zrevrange(this.productViewsKey(), 0, limit - 1, 'WITHSCORES');
      const top: { productId: string; views: number }[] = [];
      for (let i = 0; i < results.length; i += 2) {
        top.push({ productId: results[i], views: parseInt(results[i + 1], 10) || 0 });
      }
      return top;
    } catch {
      return [];
    }
  }

  async getProductViews(productId: string): Promise<number> {
    const r = this.redis;
    if (!r) return 0;
    try {
      const views = await r.zscore(this.productViewsKey(), productId);
      return views ? parseInt(views, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Aggregate per-product counters for an event type over the last `days` days
   * (including today), merged across daily sorted sets.
   */
  async getAggregatedCounts(type: string, days: number): Promise<Record<string, number>> {
    const r = this.redis;
    if (!r) return {};
    const keys: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400 * 1000);
      keys.push(this.eventCountKey(type, RedisDiscoveryService.dateKey(d)));
    }
    try {
      const merged: Record<string, number> = {};
      const pipeline = r.pipeline();
      for (const key of keys) {
        pipeline.zrange(key, 0, -1, 'WITHSCORES');
      }
      const results = await pipeline.exec();
      if (!results) return merged;
      for (const [, result] of results) {
        if (!result) continue;
        const arr = result as string[];
        for (let i = 0; i < arr.length; i += 2) {
          const id = arr[i];
          const count = parseInt(arr[i + 1], 10) || 0;
          merged[id] = (merged[id] || 0) + count;
        }
      }
      return merged;
    } catch {
      return {};
    }
  }

  // ---------------------------------------------------------------
  // Recently viewed (per user)
  // ---------------------------------------------------------------

  async trackView(actorKey: string, productId: string): Promise<void> {
    const r = this.redis;
    if (!r || !productId) return;
    const pipeline = r.pipeline();
    pipeline.lrem(this.userRecentKey(actorKey), 0, productId);
    pipeline.lpush(this.userRecentKey(actorKey), productId);
    pipeline.ltrim(this.userRecentKey(actorKey), 0, RECENT_VIEWED_MAX - 1);
    pipeline.expire(this.userRecentKey(actorKey), RECENT_VIEWED_TTL);
    pipeline.zincrby(this.productViewsKey(), 1, productId);
    pipeline.zremrangebyrank(this.productViewsKey(), 0, -TOP_PRODUCTS_MAX - 1);
    pipeline.expire(this.productViewsKey(), EVENT_KEY_TTL);
    try {
      await pipeline.exec();
    } catch (error) {
      this.logger.warn(`Failed to track product view: ${(error as Error).message}`);
    }
  }

  async getRecentViewed(actorKey: string, limit = 10): Promise<string[]> {
    const r = this.redis;
    if (!r) return [];
    try {
      return await r.lrange(this.userRecentKey(actorKey), 0, limit - 1);
    } catch {
      return [];
    }
  }

  async getUserSignals(actorKey: string, type: string, limit = 50): Promise<string[]> {
    const r = this.redis;
    if (!r) return [];
    try {
      return await r.lrange(this.userSignalKey(actorKey, type), 0, limit - 1);
    } catch {
      return [];
    }
  }

  // ---------------------------------------------------------------
  // Ranked lists (written by the ranking engine, read by the gateway)
  // ---------------------------------------------------------------

  async setRankedList(kind: RankKind, scope: string, ids: string[]): Promise<void> {
    const r = this.redis;
    if (!r) return;
    const key = this.rankedKey(kind, scope);
    const ttl = kind === 'deals' ? RECS_LIST_TTL : RANKED_LIST_TTL;
    try {
      const pipeline = r.pipeline();
      pipeline.del(key);
      if (ids.length > 0) pipeline.rpush(key, ...ids);
      pipeline.expire(key, ttl);
      await pipeline.exec();
    } catch (error) {
      this.logger.warn(`Failed to store ranked list ${kind}:${scope}: ${(error as Error).message}`);
    }
  }

  async getRankedList(kind: RankKind, scope: string, limit = 10): Promise<string[]> {
    const r = this.redis;
    if (!r) return [];
    try {
      return await r.lrange(this.rankedKey(kind, scope), 0, limit - 1);
    } catch {
      return [];
    }
  }

  async setRecommendations(userId: string, ids: string[]): Promise<void> {
    const r = this.redis;
    if (!r) return;
    try {
      const key = `${this.prefix}recs:user:${userId}`;
      const pipeline = r.pipeline();
      pipeline.del(key);
      if (ids.length > 0) pipeline.rpush(key, ...ids);
      pipeline.expire(key, RECS_LIST_TTL);
      await pipeline.exec();
    } catch (error) {
      this.logger.warn(`Failed to store recommendations: ${(error as Error).message}`);
    }
  }

  async getRecommendations(userId: string, limit = 10): Promise<string[]> {
    const r = this.redis;
    if (!r) return [];
    try {
      return await r.lrange(`${this.prefix}recs:user:${userId}`, 0, limit - 1);
    } catch {
      return [];
    }
  }

  // ---------------------------------------------------------------
  // Product metadata cache (id -> category/price/rating/discount)
  // ---------------------------------------------------------------

  async setProductsMeta(
    entries: Array<{
      id: string;
      category: string;
      price: number;
      rating: number;
      discountPercentage: number;
    }>,
  ): Promise<void> {
    const r = this.redis;
    if (!r || entries.length === 0) return;
    try {
      const pipeline = r.pipeline();
      for (const entry of entries) {
        pipeline.hset(`${this.prefix}products:meta`, entry.id, JSON.stringify(entry));
      }
      pipeline.expire(`${this.prefix}products:meta`, PRODUCT_META_TTL);
      await pipeline.exec();
    } catch (error) {
      this.logger.warn(`Failed to cache product meta: ${(error as Error).message}`);
    }
  }

  async getProductsMeta(ids: string[]): Promise<Record<string, any>> {
    const r = this.redis;
    if (!r || ids.length === 0) return {};
    try {
      const raw = await r.hmget(`${this.prefix}products:meta`, ...ids);
      const out: Record<string, any> = {};
      raw.forEach((value, i) => {
        if (value) out[ids[i]] = JSON.parse(value);
      });
      return out;
    } catch {
      return {};
    }
  }

  // ---------------------------------------------------------------
  // Admin — merchandising boosts / overrides
  // ---------------------------------------------------------------

  async setBoost(productId: string, score: number, ttlDays = 7): Promise<void> {
    const r = this.redis;
    if (!r) return;
    try {
      await r.hset(`${this.prefix}boosts`, productId, String(score));
      await r.expire(`${this.prefix}boosts`, ttlDays * 86400);
    } catch (error) {
      this.logger.warn(`Failed to set boost: ${(error as Error).message}`);
    }
  }

  async clearBoost(productId: string): Promise<void> {
    const r = this.redis;
    if (!r) return;
    try {
      await r.hdel(`${this.prefix}boosts`, productId);
    } catch {
      /* noop */
    }
  }

  async getBoosts(): Promise<Record<string, number>> {
    const r = this.redis;
    if (!r) return {};
    try {
      const raw = await r.hgetall(`${this.prefix}boosts`);
      const out: Record<string, number> = {};
      for (const [id, score] of Object.entries(raw)) {
        out[id] = parseFloat(score) || 0;
      }
      return out;
    } catch {
      return {};
    }
  }

  // ---------------------------------------------------------------
  // Frequently bought together
  // ---------------------------------------------------------------

  async setFrequentlyBought(productId: string, ids: string[], ttl = 6 * 60 * 60): Promise<void> {
    const r = this.redis;
    if (!r) return;
    try {
      const key = `${this.prefix}fbt:${productId}`;
      const pipeline = r.pipeline();
      pipeline.del(key);
      if (ids.length > 0) pipeline.rpush(key, ...ids);
      pipeline.expire(key, ttl);
      await pipeline.exec();
    } catch (error) {
      this.logger.warn(`Failed to store FBT for ${productId}: ${(error as Error).message}`);
    }
  }

  async getFrequentlyBought(productId: string, limit = 4): Promise<string[]> {
    const r = this.redis;
    if (!r) return [];
    try {
      return await r.lrange(`${this.prefix}fbt:${productId}`, 0, limit - 1);
    } catch {
      return [];
    }
  }
}
