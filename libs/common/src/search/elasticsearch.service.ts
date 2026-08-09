import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSearchClient, SearchClient } from './search-client';

export const PRODUCT_INDEX = 'products';

const PRODUCT_MAPPING = {
  settings: {
    number_of_shards: 6,
    number_of_replicas: 2,
    analysis: {
      analyzer: {
        product_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'asciifolding', 'edge_ngram_filter'],
        },
        search_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: ['lowercase', 'asciifolding'],
        },
      },
      filter: {
        edge_ngram_filter: {
          type: 'edge_ngram',
          min_gram: 2,
          max_gram: 20,
        },
      },
    },
  },
  mappings: {
    properties: {
      id: { type: 'keyword' },
      sku: { type: 'keyword' },
      title: {
        type: 'text',
        analyzer: 'product_analyzer',
        search_analyzer: 'search_analyzer',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      description: {
        type: 'text',
        analyzer: 'product_analyzer',
        search_analyzer: 'search_analyzer',
      },
      price: { type: 'double' },
      category: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      brand: {
        type: 'text',
        fields: {
          keyword: { type: 'keyword' },
        },
      },
      rating: { type: 'double' },
      stock: { type: 'integer' },
      tags: { type: 'keyword' },
      discountPercentage: { type: 'double' },
      availabilityStatus: { type: 'keyword' },
      thumbnail: { type: 'keyword', index: false },
      isActive: { type: 'boolean' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
  },
};

export interface SearchProduct {
  id: string;
  sku: string;
  title: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  rating: number;
  stock: number;
  tags: string[];
  discountPercentage: number;
  availabilityStatus: string;
  thumbnail: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchParams {
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'price' | 'name' | 'createdAt' | 'relevance' | 'rating' | 'discount';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchResult {
  items: SearchProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SuggestResult {
  suggestions: string[];
}

@Injectable()
export class ElasticsearchSearchService implements OnModuleInit {
  private readonly logger = new Logger(ElasticsearchSearchService.name);
  private client!: SearchClient;
  private connected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.client = createSearchClient(this.configService);
    const backend = this.configService.get('SEARCH_BACKEND', 'elasticsearch');

    let connected = false;
    for (let attempt = 1; attempt <= 5; attempt++) {
      try {
        const health = await this.client.cluster.health();
        this.logger.log(`Search (${backend}) connected: ${health.cluster_name} (${health.status})`);
        connected = true;
        break;
      } catch (error) {
        this.logger.warn(
          `Search (${backend}) connection attempt ${attempt}/5 failed: ${(error as Error).message || 'unknown error'}`,
        );
        if (attempt < 5) await new Promise((r) => setTimeout(r, 2000));
      }
    }

    if (connected) {
      this.connected = true;
      await this.ensureIndex();
    } else {
      this.logger.warn(`Search (${backend}) unavailable after 5 retries, search features disabled`);
    }
  }

  private async ensureIndex(): Promise<void> {
    const exists = await this.client.indices.exists({ index: PRODUCT_INDEX });
    if (!exists) {
      try {
        await this.client.indices.create({ index: PRODUCT_INDEX, ...PRODUCT_MAPPING });
        this.logger.log(`Created index: ${PRODUCT_INDEX}`);
      } catch (error) {
        const body = (error as { body?: { error?: { type?: string } } })?.body?.error;
        if (body?.type === 'resource_already_exists_exception') {
          this.logger.warn(`Index ${PRODUCT_INDEX} already exists (created by another instance)`);
        } else {
          throw error;
        }
      }
    }
  }

  get isAvailable(): boolean {
    return this.connected && !!this.client;
  }

  async indexProduct(product: SearchProduct): Promise<void> {
    if (!this.isAvailable) return;
    try {
      await this.client.index({
        index: PRODUCT_INDEX,
        id: product.id,
        document: product,
        refresh: false,
      });
    } catch (error) {
      this.logger.error(`Failed to index product ${product.id}: ${(error as Error).message}`);
    }
  }

  async indexProducts(products: SearchProduct[]): Promise<{ indexed: number; errors: number }> {
    if (!this.isAvailable) return { indexed: 0, errors: 0 };

    let indexed = 0;
    let errors = 0;

    for (const product of products) {
      try {
        await this.client.index({
          index: PRODUCT_INDEX,
          id: product.id,
          document: product,
          refresh: false,
        });
        indexed++;
      } catch {
        errors++;
      }
    }

    if (indexed > 0) {
      await this.client.indices.refresh({ index: PRODUCT_INDEX });
    }

    return { indexed, errors };
  }

  async bulkIndexProducts(products: SearchProduct[]): Promise<{ indexed: number; errors: number }> {
    if (!this.isAvailable || products.length === 0) return { indexed: 0, errors: 0 };

    const operations = products.flatMap((product) => [
      { index: { _index: PRODUCT_INDEX, _id: product.id } },
      product,
    ]);

    try {
      const response = await this.client.bulk({ operations, refresh: true });
      const indexed = response.items.filter(
        (item) => item.index?.result === 'created' || item.index?.result === 'updated',
      ).length;
      const errors = response.items.length - indexed;
      return { indexed, errors };
    } catch (error) {
      this.logger.error(`Bulk index failed: ${(error as Error).message}`);
      return { indexed: 0, errors: products.length };
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    if (!this.isAvailable) return;
    try {
      await this.client.delete({ index: PRODUCT_INDEX, id: productId, refresh: false });
    } catch (error) {
      if ((error as { meta?: { statusCode?: number } }).meta?.statusCode !== 404) {
        this.logger.error(`Failed to delete product ${productId}: ${(error as Error).message}`);
      }
    }
  }

  async search(params: SearchParams): Promise<SearchResult> {
    const {
      q,
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      page = 1,
      limit = 20,
      sortBy = 'relevance',
      sortOrder = 'desc',
    } = params;

    const must: any[] = [{ term: { isActive: true } }];

    if (q) {
      must.push({
        multi_match: {
          query: q,
          fields: [
            'title^3',
            'title.keyword^2',
            'description^1',
            'category^1.5',
            'brand^1.5',
            'sku^1',
          ],
          type: 'best_fields',
          fuzziness: 'AUTO',
          prefix_length: 2,
        },
      });
    }

    const filter: any[] = [];
    if (categoryId) filter.push({ term: { 'category.keyword': categoryId } });
    if (minPrice !== undefined || maxPrice !== undefined) {
      const range: any = {};
      if (minPrice !== undefined) range.gte = minPrice;
      if (maxPrice !== undefined) range.lte = maxPrice;
      filter.push({ range: { price: range } });
    }
    if (minRating !== undefined && minRating > 0) {
      filter.push({ range: { rating: { gte: minRating } } });
    }
    if (inStock) {
      filter.push({ range: { stock: { gt: 0 } } });
    }

    const sort: any[] = [];
    if (q && sortBy === 'relevance') {
      sort.push({ _score: { order: 'desc' } });
    } else if (sortBy === 'price') {
      sort.push({ price: { order: sortOrder } });
    } else if (sortBy === 'name') {
      sort.push({ 'title.keyword': { order: sortOrder } });
    } else if (sortBy === 'createdAt') {
      sort.push({ createdAt: { order: sortOrder } });
    } else if (sortBy === 'rating') {
      sort.push({ rating: { order: sortOrder } });
    } else if (sortBy === 'discount') {
      sort.push({ discountPercentage: { order: sortOrder } });
    }
    sort.push({ 'title.keyword': { order: 'asc' } });

    const from = (page - 1) * limit;

    try {
      const response = await this.client.search({
        index: PRODUCT_INDEX,
        track_total_hits: true as const,
        query: {
          bool: {
            must,
            filter: filter.length > 0 ? filter : undefined,
          },
        },
        sort,
        from,
        size: limit,
        highlight: q
          ? {
              fields: {
                title: { pre_tags: ['<mark>'], post_tags: ['</mark>'] },
                description: { pre_tags: ['<mark>'], post_tags: ['</mark>'] },
              },
            }
          : undefined,
      });

      const items = response.hits.hits.map((hit) => ({
        ...(hit._source as SearchProduct),
        _score: hit._score,
      }));

      const total =
        typeof response.hits.total === 'number'
          ? response.hits.total
          : (response.hits.total?.value ?? 0);

      return {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Search failed: ${(error as Error).message}`);
      return { items: [], total: 0, page, limit, totalPages: 0 };
    }
  }

  async suggest(prefix: string, category?: string, limit = 10): Promise<SuggestResult> {
    if (!this.isAvailable || !prefix) return { suggestions: [] };

    try {
      const must: any[] = [
        { prefix: { 'title.keyword': { value: prefix, case_insensitive: true } } },
        { term: { isActive: true } },
      ];

      if (category) must.push({ term: { 'category.keyword': category } });

      const response = await this.client.search({
        index: PRODUCT_INDEX,
        query: { bool: { must } },
        size: limit,
        _source: ['title'],
      });

      const suggestions: string[] = response.hits.hits
        .map((hit) => (hit._source as any)?.title as string)
        .filter((title): title is string => Boolean(title));

      return { suggestions: [...new Set(suggestions)].slice(0, limit) };
    } catch (error) {
      this.logger.error(`Suggest failed: ${(error as Error).message}`);
      return { suggestions: [] };
    }
  }

  async reindexAll(products: SearchProduct[]): Promise<{ indexed: number; errors: number }> {
    if (!this.isAvailable) return { indexed: 0, errors: 0 };

    try {
      await this.client.indices.delete({ index: PRODUCT_INDEX }).catch(() => {});
      await this.client.indices.create({ index: PRODUCT_INDEX, ...PRODUCT_MAPPING });
      return await this.bulkIndexProducts(products);
    } catch (error) {
      this.logger.error(`Reindex failed: ${(error as Error).message}`);
      return { indexed: 0, errors: products.length };
    }
  }

  async getStats(): Promise<any> {
    if (!this.isAvailable) return { available: false };
    try {
      const count = await this.client.count({ index: PRODUCT_INDEX });
      return { available: true, index: PRODUCT_INDEX, documentCount: count.count };
    } catch {
      return { available: true, index: PRODUCT_INDEX, documentCount: -1 };
    }
  }
}
