/**
 * Environment / target resolution shared by every seed & verify script.
 *
 * `SEED_TARGET` selects how database endpoints are resolved:
 *   k8s     (default) -> the floci k3s cluster. Requires port-forwards:
 *                         kubectl -n ecommerce port-forward svc/pgbouncer 6432:6432
 *                         kubectl -n ecommerce port-forward svc/elasticsearch 9200:9200
 *                         kubectl -n ecommerce port-forward svc/api-gateway 3300:3000
 *                         shard dbs are `products_s0..sN-1` behind pgbouncer on :6432
 *   compose -> local `docker compose up -d` infrastructure. Product shard
 *                         pgbouncers listen on localhost:6461..6464 (dbname
 *                         `product_s0..sN-1`); ES on localhost:9200; api-gateway
 *                         runs on the host at localhost:3000 (or via nginx :80).
 *
 * Every value can be overridden with explicit env vars (SEED_SHARD_URLS,
 * PRODUCT_DATABASE_WRITE_URL / DATABASE_URL, ELASTICSEARCH_URL, API_BASE_URL).
 */

export type SeedTarget = 'k8s' | 'compose';

const K8S_PG = 'postgresql://root:password@localhost:6432/products?schema=public';
// Compose product shard Postgres host ports (write shards; the even ports are
// read replicas). Same endpoints the product service uses via
// PRODUCT_S{N}_DATABASE_WRITE_URL in .env: s0=5461 s1=5463 s2=5465 s3=5467.
const COMPOSE_PG_PORTS = [5461, 5463, 5465, 5467];

function target(): SeedTarget {
  return String(process.env.SEED_TARGET || 'k8s').toLowerCase() === 'compose' ? 'compose' : 'k8s';
}

export function seedTarget(): SeedTarget {
  return target();
}

export function basePgUrl(): string {
  return process.env.PRODUCT_DATABASE_WRITE_URL || process.env.DATABASE_URL || K8S_PG;
}

export function productShardCount(): number {
  return Math.max(1, Number(process.env.SEED_SHARD_COUNT || 4));
}

/**
 * Ordered PG connection URLs for product shards s0..sN-1.
 * Resolved in priority order: SEED_SHARD_URLS -> target defaults.
 */
export function productShardUrls(): string[] {
  const explicit = (process.env.SEED_SHARD_URLS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (explicit.length > 0) return explicit;

  const count = productShardCount();
  if (count <= 1) return [basePgUrl()];

  if (target() === 'compose') {
    const ports = COMPOSE_PG_PORTS.slice(0, count);
    return Array.from(
      { length: ports.length },
      (_, i) => `postgresql://root:password@localhost:${ports[i]}/product_s${i}?schema=public`,
    );
  }

  return Array.from({ length: count }, (_, i) => {
    const url = new URL(basePgUrl());
    url.pathname = `/products_s${i}`;
    return url.toString();
  });
}

export function elasticsearchUrl(): string {
  return process.env.ELASTICSEARCH_URL || 'http://localhost:9200';
}

/**
 * Base URL of the api-gateway (used by seed-api.ts and the API checks in verify.ts).
 *   k8s     -> http://localhost:3300  (port-forward svc/api-gateway 3300:3000)
 *   compose -> http://localhost:3000  (api-gateway started on the host)
 */
export function apiBaseUrl(): string {
  if (process.env.API_BASE_URL) return process.env.API_BASE_URL;
  return target() === 'compose' ? 'http://localhost:3000' : 'http://localhost:3300';
}
