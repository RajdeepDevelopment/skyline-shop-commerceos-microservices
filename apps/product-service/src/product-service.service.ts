import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@app/database';
import { ElasticsearchSearchService } from '@app/common';

@Injectable()
export class ProductServiceService implements OnModuleInit {
  private readonly logger = new Logger(ProductServiceService.name);

  constructor(
    private readonly prisma: DatabaseService,
    private readonly configService: ConfigService,
    private readonly esService: ElasticsearchSearchService,
  ) {}

  async onModuleInit() {
    this.logger.log(`Product service initialized with ${this.prisma.shards.size} shards`);
  }

  private getShard(key: string) {
    return this.prisma.getShard(key);
  }

  private buildOrderBy(sortBy?: string, sortOrder?: string): { [key: string]: 'asc' | 'desc' } {
    const dir: 'asc' | 'desc' = sortOrder === 'desc' ? 'desc' : 'asc';
    switch (sortBy) {
      case 'price':
        return { price: dir };
      case 'name':
        return { title: dir };
      case 'rating':
        return { rating: dir };
      case 'discount':
        return { discountPercentage: dir };
      case 'createdAt':
      default:
        return { createdAt: dir };
    }
  }

  private serializeProduct(p: any) {
    if (!p) return p;
    return {
      ...p,
      price: Number(p.price) || 0,
      discountPercentage: Number(p.discountPercentage) || 0,
      rating: Number(p.rating) || 0,
      weight: p.weight != null ? Number(p.weight) : null,
      width: p.width != null ? Number(p.width) : null,
      height: p.height != null ? Number(p.height) : null,
      depth: p.depth != null ? Number(p.depth) : null,
      inStock: (p.stock ?? 0) > 0,
      stockCount: p.stock ?? 0,
    };
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));

    if (this.esService.isAvailable) {
      try {
        const esResult = await this.esService.search({
          q: params.search,
          categoryId: params.category,
          minPrice: params.minPrice && params.minPrice > 0 ? params.minPrice : undefined,
          maxPrice: params.maxPrice && params.maxPrice > 0 ? params.maxPrice : undefined,
          minRating: params.minRating && params.minRating > 0 ? params.minRating : undefined,
          inStock: params.inStock,
          page,
          limit,
          sortBy: (params.sortBy as any) || 'createdAt',
          sortOrder: (params.sortOrder as 'asc' | 'desc') || 'desc',
        });

        return {
          products: esResult.items.map((item: any) => ({
            id: item.id,
            sku: item.sku || '',
            title: item.title || '',
            description: item.description || '',
            price: Number(item.price) || 0,
            isActive: item.isActive ?? true,
            createdAt: item.createdAt || new Date().toISOString(),
            category: item.category || '',
            images: item.images || [],
            inStock: (item.stock ?? 0) > 0,
            stockCount: item.stock ?? 0,
            brand: item.brand || '',
            rating: Number(item.rating) || 0,
            discountPercentage: Number(item.discountPercentage) || 0,
            thumbnail: item.thumbnail || '',
            tags: item.tags || [],
          })),
          total: esResult.total,
          page: esResult.page,
          totalPages: esResult.totalPages,
          limit: esResult.limit,
        };
      } catch (error) {
        this.logger.warn(`ES search failed, falling back to PG: ${(error as Error).message}`);
      }
    }

    return this.findAllFromPG(params);
  }

  private async findAllFromPG(params: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (params.search && params.search.trim()) {
      const search = params.search.trim();
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (params.category && params.category.trim()) {
      where.category = params.category;
    }

    if (params.minPrice !== undefined && params.minPrice > 0) {
      where.price = { ...(where.price || {}), gte: params.minPrice };
    }
    if (params.maxPrice !== undefined && params.maxPrice > 0) {
      where.price = { ...(where.price || {}), lte: params.maxPrice };
    }

    if (params.minRating !== undefined && params.minRating > 0) {
      where.rating = { gte: params.minRating };
    }
    if (params.inStock) {
      where.stock = { gt: 0 };
    }

    const orderBy = this.buildOrderBy(params.sortBy, params.sortOrder);

    const allShards = this.prisma.getAllShards();
    const queries = allShards.flatMap((shard) => [
      shard.product.findMany({ where, orderBy, skip, take: limit }),
      shard.product.count({ where }),
    ]);

    const results = await Promise.all(queries);
    let allProducts: any[] = [];
    let total = 0;

    for (let i = 0; i < results.length; i += 2) {
      const products = results[i] as any[];
      const count = results[i + 1] as number;
      allProducts = allProducts.concat(products);
      total += Number(count);
    }

    const sortKey = Object.keys(orderBy)[0];
    const sortDir = orderBy[sortKey] === 'desc' ? -1 : 1;
    allProducts.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      return aVal > bVal ? sortDir : aVal < bVal ? -sortDir : 0;
    });

    return {
      products: allProducts.slice(0, limit).map((p) => this.serializeProduct(p)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
    };
  }

  async findOne(id: string) {
    const allShards = this.prisma.getAllShards();
    for (const shard of allShards) {
      const product = await shard.product.findUnique({
        where: { id },
        include: { reviews: true, inventory: true },
      });
      if (product) return this.serializeProduct(product);
    }
    return null;
  }

  /** Fetch many products by id, preserving the requested order. */
  async findByIds(ids: string[]): Promise<any[]> {
    const unique = [...new Set(ids.filter(Boolean))];
    if (unique.length === 0) return [];

    const shards = this.prisma.getAllShards();
    const byId = new Map<string, any>();

    const chunks: string[][] = [];
    for (let i = 0; i < unique.length; i += 50) chunks.push(unique.slice(i, i + 50));

    for (const chunk of chunks) {
      const found = await Promise.all(
        shards.map((shard) =>
          shard.product.findMany({
            where: { id: { in: chunk }, isActive: true },
          }),
        ),
      );
      for (const list of found) {
        for (const p of list) byId.set(p.id, this.serializeProduct(p));
      }
    }

    return unique.map((id) => byId.get(id)).filter(Boolean);
  }

  /** Similar products: same category + brand from OpenSearch, then same category from PG. */
  async findSimilar(id: string, limit = 8): Promise<any[]> {
    const product = await this.findOne(id);
    if (!product) return [];

    if (this.esService.isAvailable) {
      try {
        const must: any[] = [
          { term: { isActive: true } },
          { term: { 'category.keyword': product.category || '' } },
        ];
        if (product.brand) must.push({ term: { 'brand.keyword': product.brand } });
        const response = await (this.esService as any).client?.search({
          index: 'products',
          query: { bool: { must } },
          sort: [{ rating: { order: 'desc' } }],
          size: limit + 5,
        });
        const similar = (response?.hits?.hits ?? [])
          .map((hit: any) => hit._source)
          .filter((p: any) => p.id !== id && p.isActive !== false)
          .slice(0, limit);
        if (similar.length > 0) {
          return similar.map((p: any) => ({
            id: p.id,
            sku: p.sku || '',
            title: p.title || '',
            description: p.description || '',
            price: Number(p.price) || 0,
            isActive: p.isActive ?? true,
            createdAt: p.createdAt || new Date().toISOString(),
            category: p.category || '',
            images: p.images || [],
            inStock: (p.stock ?? 0) > 0,
            stockCount: p.stock ?? 0,
            brand: p.brand || '',
            rating: Number(p.rating) || 0,
            discountPercentage: Number(p.discountPercentage) || 0,
            thumbnail: p.thumbnail || '',
            tags: p.tags || [],
          }));
        }
      } catch (error) {
        this.logger.warn(`ES similar failed, falling back to PG: ${(error as Error).message}`);
      }
    }

    const shards = this.prisma.getAllShards();
    const found = await Promise.all(
      shards.map((shard) =>
        shard.product.findMany({
          where: { category: product.category || undefined, isActive: true },
          take: limit + 5,
        }),
      ),
    );
    const similar = found
      .flat()
      .filter((p) => p.id !== id)
      .sort((a, b) => Number(b.rating ?? 0) - Number(a.rating ?? 0))
      .slice(0, limit)
      .map((p) => this.serializeProduct(p));
    return similar;
  }

  async create(data: any) {
    const shard = this.getShard(data.sku || 'default');
    return shard.product.create({ data });
  }

  async update(id: string, data: any) {
    const allShards = this.prisma.getAllShards();
    for (const shard of allShards) {
      try {
        return await shard.product.update({ where: { id }, data });
      } catch {
        continue;
      }
    }
    throw new Error('Product not found on any shard');
  }

  async remove(id: string) {
    return this.update(id, { isActive: false });
  }

  async findCategories() {
    try {
      const response = await (this.esService as any).client?.search({
        index: 'products',
        size: 0,
        aggs: {
          categories: {
            terms: { field: 'category.keyword', size: 100 },
          },
        },
        query: { term: { isActive: true } },
      });

      if (response?.aggregations?.categories?.buckets) {
        return response.aggregations.categories.buckets.map((b: any) => b.key);
      }
    } catch {
      this.logger.warn('ES category aggregation failed, falling back to PG');
    }

    const [firstShard] = this.prisma.getAllShards();
    if (!firstShard) return [];

    const results = await firstShard.product.findMany({
      where: { category: { not: '' } },
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    return results.map((r) => r.category);
  }

  // ============================================================
  // Reviews
  // ============================================================

  private async findShardWithProduct(productId: string): Promise<any> {
    const allShards = this.prisma.getAllShards();
    for (const shard of allShards) {
      const product = await shard.product.findUnique({ where: { id: productId } });
      if (product) return shard;
    }
    return null;
  }

  private serializeReview(r: any) {
    return {
      id: r.id,
      productId: r.productId,
      rating: r.rating,
      title: r.title || '',
      comment: r.comment || '',
      date: r.date?.toISOString?.() || String(r.date),
      reviewerName: r.reviewerName || '',
      verified: !!r.verified,
      helpfulCount: r.helpfulCount ?? 0,
      authorId: r.authorId || null,
      createdAt: r.createdAt?.toISOString?.() || String(r.createdAt),
    };
  }

  async findReviews(
    productId: string,
    opts: {
      rating?: number;
      sort?: string;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const shard = await this.findShardWithProduct(productId);
    if (!shard) return { reviews: [], total: 0, page: 1, totalPages: 0 };

    const page = Math.max(1, opts.page || 1);
    const limit = Math.min(50, Math.max(1, opts.limit || 10));
    const where: any = { productId };
    if (opts.rating && opts.rating >= 1 && opts.rating <= 5) where.rating = opts.rating;

    const orderBy: any = (() => {
      switch (opts.sort) {
        case 'rating-desc':
          return { rating: 'desc' as const };
        case 'rating-asc':
          return { rating: 'asc' as const };
        case 'helpful':
          return { helpfulCount: 'desc' as const };
        case 'oldest':
          return { date: 'asc' as const };
        default:
          return { date: 'desc' as const };
      }
    })();

    const [reviews, total] = await Promise.all([
      shard.review.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
      shard.review.count({ where }),
    ]);

    return {
      reviews: reviews.map((r: any) => this.serializeReview(r)),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      limit,
    };
  }

  async getReviewSummary(productId: string) {
    const shard = await this.findShardWithProduct(productId);
    if (!shard) {
      return { productId, totalReviews: 0, averageRating: 0, distribution: [] };
    }

    const [agg, grouped] = await Promise.all([
      shard.review.aggregate({
        where: { productId },
        _avg: { rating: true },
        _count: { _all: true },
      }),
      shard.review.groupBy({
        by: ['rating'],
        where: { productId },
        _count: { _all: true },
      }),
    ]);

    const total = agg._count?._all ?? 0;
    const distribution = [5, 4, 3, 2, 1].map((rating) => {
      const bucket = grouped.find((g: any) => g.rating === rating);
      const count = bucket?._count?._all ?? 0;
      return {
        rating,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      };
    });

    return {
      productId,
      totalReviews: total,
      averageRating: total > 0 ? Number((agg._avg?.rating ?? 0).toFixed(1)) : 0,
      distribution,
    };
  }

  async createReview(
    productId: string,
    dto: {
      rating: number;
      title?: string;
      comment?: string;
      reviewerName?: string;
      reviewerEmail?: string;
      authorId?: string;
    },
  ) {
    const shard = await this.findShardWithProduct(productId);
    if (!shard) return null;

    const review = await shard.review.create({
      data: {
        productId,
        rating: dto.rating,
        title: dto.title,
        comment: dto.comment,
        reviewerName: dto.reviewerName,
        reviewerEmail: dto.reviewerEmail,
        authorId: dto.authorId || null,
        verified: !!dto.authorId,
      },
    });

    return this.serializeReview(review);
  }

  /**
   * Mark a review as helpful. Returns `{ helpful: true }` if the vote was
   * newly registered, `{ helpful: false }` if the user already voted.
   */
  async setReviewHelpful(reviewId: string, userId: string) {
    const allShards = this.prisma.getAllShards();
    for (const shard of allShards) {
      const existing = await shard.review.findUnique({ where: { id: reviewId } });
      if (!existing) continue;

      try {
        await shard.reviewHelpfulVote.create({
          data: { reviewId, userId },
        });
      } catch {
        return { helpful: false, alreadyVoted: true };
      }

      await shard.review.update({
        where: { id: reviewId },
        data: { helpfulCount: { increment: 1 } },
      });
      return { helpful: true, alreadyVoted: false };
    }
    return null;
  }
}
