/**
 * Search client factory.
 *
 * `SEARCH_BACKEND` selects which client the app layer uses:
 *   elasticsearch (default) -> @elastic/elasticsearch Client
 *   opensearch              -> @opensearch-project/opensearch Client
 *
 * Both clients expose a compatible API for the operations the services use
 * (cluster.health, indices.*, index, bulk, delete, search, count). The only
 * differences are the `index`/`bulk` payload shapes (`document`/`operations`
 * on the ES 8 client vs `body` on the OpenSearch client), which the returned
 * facade normalizes so callers keep a single code path.
 *
 * The OpenSearch backend is used for AWS/floci deployments (managed OpenSearch
 * domains / the Floci OpenSearch emulator); compose runs real Elasticsearch.
 */

import { ConfigService } from '@nestjs/config';
import { Client as ElasticsearchClient } from '@elastic/elasticsearch';
import { Client as OpenSearchClient } from '@opensearch-project/opensearch';

export interface SearchClusterHealth {
  cluster_name: string;
  status: string;
}

export interface SearchBulkResponse {
  items: Array<{ index?: { result?: string } }>;
}

export interface SearchHit {
  _source?: unknown;
  _score?: number | null;
}

export interface SearchResponseLike {
  hits: {
    hits: SearchHit[];
    total?: number | { value?: number } | undefined;
  };
}

export interface IndexParams {
  index: string;
  id: string;
  document: unknown;
  refresh?: boolean;
}

export interface BulkParams {
  operations: unknown[];
  refresh?: boolean;
}

export interface SearchClient {
  cluster: {
    health(): Promise<SearchClusterHealth>;
  };
  indices: {
    exists(params: { index: string }): Promise<boolean>;
    create(params: { index: string; settings?: unknown; mappings?: unknown }): Promise<unknown>;
    delete(params: { index: string }): Promise<unknown>;
    refresh(params: { index: string }): Promise<unknown>;
  };
  index(params: IndexParams): Promise<{ result?: string }>;
  bulk(params: BulkParams): Promise<SearchBulkResponse>;
  delete(params: { index: string; id: string; refresh?: boolean }): Promise<unknown>;
  search(params: unknown): Promise<SearchResponseLike>;
  count(params: { index: string }): Promise<{ count: number }>;
}

export type SearchBackend = 'elasticsearch' | 'opensearch';

export function searchBackend(
  env: string = process.env.SEARCH_BACKEND || 'elasticsearch',
): SearchBackend {
  return env.toLowerCase() === 'opensearch' ? 'opensearch' : 'elasticsearch';
}

/**
 * Build the search client selected by SEARCH_BACKEND. `ELASTICSEARCH_URL`
 * stays the endpoint env var for both backends.
 */
export function createSearchClient(configService: ConfigService): SearchClient {
  const backend = searchBackend(configService.get('SEARCH_BACKEND', 'elasticsearch'));
  const node = configService.get('ELASTICSEARCH_URL', 'http://localhost:9200');

  if (backend === 'opensearch') {
    // The OpenSearch v3 client resolves every call to an `ApiResponse` wrapper
    // (`{ body, statusCode, ... }`) rather than the response body directly, so
    // each facade method unwraps `.body`.
    const client = new OpenSearchClient({ node, requestTimeout: 10000, pingTimeout: 5000 });
    return {
      cluster: {
        health: async () => ((await client.cluster.health()) as { body: SearchClusterHealth }).body,
      },
      indices: {
        exists: async (params) => ((await client.indices.exists(params)) as { body: boolean }).body,
        create: async (params) =>
          await client.indices.create({
            index: params.index,
            body: { settings: params.settings, mappings: params.mappings } as any,
          }),
        delete: async (params) => await client.indices.delete(params),
        refresh: async (params) => await client.indices.refresh(params),
      },
      index: async (params) =>
        (
          (await client.index({
            index: params.index,
            id: params.id,
            body: params.document as any,
            refresh: params.refresh,
          })) as { body: { result?: string } }
        ).body,
      bulk: async (params) =>
        (
          (await client.bulk({ body: params.operations as any, refresh: params.refresh })) as {
            body: SearchBulkResponse;
          }
        ).body,
      delete: async (params) => await client.delete(params),
      search: async (params) => {
        // The OpenSearch v3 client only accepts query/aggs/sort/highlight/etc.
        // inside `body` (unlike the ES 8 client's top-level params). Callers
        // pass the ES-style flat params, so fold everything but `index` in.
        const { index, body: existingBody, ...queryParams } = params as any;
        const res = await client.search({
          index,
          body: { ...(existingBody || {}), ...queryParams },
        });
        return (res as { body: SearchResponseLike }).body;
      },
      count: async (params) => ((await client.count(params)) as { body: { count: number } }).body,
    };
  }

  const client = new ElasticsearchClient({ node, requestTimeout: 10000, pingTimeout: 5000 });
  return {
    cluster: {
      health: () => client.cluster.health(),
    },
    indices: {
      exists: (params) => client.indices.exists(params),
      create: (params) => client.indices.create(params),
      delete: (params) => client.indices.delete(params),
      refresh: (params) => client.indices.refresh(params),
    },
    index: (params) =>
      client.index({
        index: params.index,
        id: params.id,
        document: params.document,
        refresh: params.refresh,
      }),
    bulk: (params) =>
      client.bulk({
        operations: params.operations,
        refresh: params.refresh,
      }),
    delete: (params) => client.delete(params),
    search: (params) => client.search(params as never),
    count: (params) => client.count(params),
  };
}
