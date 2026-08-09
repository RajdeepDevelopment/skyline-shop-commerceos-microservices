/**
 * Elasticsearch index creation + bulk indexing for the `products` index,
 * shared by seed-db.ts and sync-es.ts. Mapping must match what the
 * ElasticsearchSearchService (@app/common) expects (search on `title`, etc.).
 */

import { Client as ElasticsearchClient } from '@elastic/elasticsearch';
import { Client as OpenSearchClient } from '@opensearch-project/opensearch';
import { SeedProduct } from './generator';

export const ES_INDEX = 'products';

const INDEX_BODY = {
  settings: {
    number_of_shards: 3,
    number_of_replicas: 0,
    refresh_interval: '60s',
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
      filter: { edge_ngram_filter: { type: 'edge_ngram', min_gram: 2, max_gram: 20 } },
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
        fields: { keyword: { type: 'keyword' } },
      },
      description: {
        type: 'text',
        analyzer: 'product_analyzer',
        search_analyzer: 'search_analyzer',
      },
      category: {
        type: 'text',
        analyzer: 'search_analyzer',
        fields: { keyword: { type: 'keyword' } },
      },
      brand: {
        type: 'text',
        analyzer: 'search_analyzer',
        fields: { keyword: { type: 'keyword' } },
      },
      price: { type: 'double' },
      discountPercentage: { type: 'double' },
      rating: { type: 'double' },
      stock: { type: 'integer' },
      tags: { type: 'keyword' },
      weight: { type: 'double' },
      width: { type: 'double' },
      height: { type: 'double' },
      depth: { type: 'double' },
      warrantyInformation: { type: 'text', index: false },
      shippingInformation: { type: 'text', index: false },
      availabilityStatus: { type: 'keyword' },
      returnPolicy: { type: 'text', index: false },
      minimumOrderQuantity: { type: 'integer' },
      barcode: { type: 'keyword' },
      thumbnail: { type: 'keyword', index: false },
      images: { type: 'keyword', index: false },
      isActive: { type: 'boolean' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' },
    },
  },
};

export interface SeedSearchClient {
  indices: {
    exists(params: { index: string }): Promise<boolean>;
    create(params: { index: string; settings?: unknown; mappings?: unknown }): Promise<unknown>;
    delete(params: { index: string }): Promise<unknown>;
    refresh(params: { index: string }): Promise<unknown>;
  };
  bulk(params: { body: unknown[]; refresh?: boolean }): Promise<{
    items: Array<{ index?: { result?: string } }>;
  }>;
  count(params: { index: string }): Promise<{ count: number }>;
  close(): Promise<void>;
}

/**
 * Build the index/bulk client for the backend selected by SEARCH_BACKEND
 * (default `elasticsearch`; `opensearch` for AWS/floci). Both clients speak
 * the same REST protocol for the operations used here; payloads are normalized
 * to the `body` style accepted by the ES 8 client and the OpenSearch client.
 */
export function createESClient(url: string): SeedSearchClient {
  const backend = String(process.env.SEARCH_BACKEND || 'elasticsearch').toLowerCase();
  const options = { node: url, requestTimeout: 60000 };

  if (backend === 'opensearch') {
    // The OpenSearch v3 client resolves every call to an ApiResponse wrapper
    // ({ body, statusCode, ... }) and only accepts settings/mappings inside
    // `body` for index creation. Unwrap `.body` so callers see the same shape
    // the ES 8 client returns.
    const client = new OpenSearchClient(options) as any;
    return {
      indices: {
        exists: async (params) => ((await client.indices.exists(params)) as { body: boolean }).body,
        create: (params) =>
          client.indices.create({
            index: params.index,
            body: { settings: params.settings, mappings: params.mappings } as any,
          }),
        delete: (params) => client.indices.delete(params),
        refresh: (params) => client.indices.refresh(params),
      },
      bulk: async (params) => (await client.bulk(params)).body,
      count: async (params) => (await client.count(params)).body,
      close: () => client.close() as Promise<void>,
    };
  }

  const client = new ElasticsearchClient(options) as any;
  return {
    indices: {
      exists: (params) => client.indices.exists(params) as Promise<boolean>,
      create: (params) => client.indices.create(params) as Promise<unknown>,
      delete: (params) => client.indices.delete(params) as Promise<unknown>,
      refresh: (params) => client.indices.refresh(params) as Promise<unknown>,
    },
    bulk: (params) =>
      client.bulk(params) as Promise<{ items: Array<{ index?: { result?: string } }> }>,
    count: (params) => client.count(params) as Promise<{ count: number }>,
    close: () => client.close() as Promise<void>,
  };
}

/** Drop the index if it exists (and `reset`), then create it fresh. */
export async function ensureProductsIndex(client: SeedSearchClient, reset: boolean): Promise<void> {
  const exists = await client.indices.exists({ index: ES_INDEX });
  if (exists) {
    if (reset) {
      console.log(`Deleting existing index: ${ES_INDEX}`);
      await client.indices.delete({ index: ES_INDEX });
    } else {
      console.log(`Index ${ES_INDEX} already exists (SEED_RESET != true); reusing it`);
      return;
    }
  }
  console.log(`Creating index: ${ES_INDEX}`);
  await client.indices.create({ index: ES_INDEX, ...INDEX_BODY });
}

export function productEsDoc(p: SeedProduct): Record<string, unknown> {
  return {
    id: p.id,
    sku: p.sku,
    title: p.title,
    description: p.description || '',
    category: p.category,
    price: p.price,
    discountPercentage: p.discountPercentage,
    rating: p.rating,
    stock: p.stock,
    tags: p.tags,
    brand: p.brand || '',
    weight: p.weight,
    width: p.width,
    height: p.height,
    depth: p.depth,
    warrantyInformation: p.warrantyInformation,
    shippingInformation: p.shippingInformation,
    availabilityStatus: p.availabilityStatus,
    returnPolicy: p.returnPolicy,
    minimumOrderQuantity: p.minimumOrderQuantity,
    barcode: p.barcode,
    thumbnail: p.thumbnail,
    images: p.images,
    isActive: p.isActive,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function esBulkBatch(
  client: SeedSearchClient,
  products: SeedProduct[],
): Promise<{ indexed: number; errors: number }> {
  if (products.length === 0) return { indexed: 0, errors: 0 };
  const ops = products.flatMap((p) => [
    { index: { _index: ES_INDEX, _id: p.id } },
    productEsDoc(p),
  ]);
  const response = await client.bulk({ body: ops, refresh: false });
  const indexed = response.items.filter(
    (item) => item.index?.result === 'created' || item.index?.result === 'updated',
  ).length;
  return { indexed, errors: response.items.length - indexed };
}

export async function esDocCount(client: SeedSearchClient): Promise<number> {
  const { count } = await client.count({ index: ES_INDEX });
  return count;
}
