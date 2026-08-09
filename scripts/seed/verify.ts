/**
 * verify.ts — Check a seed run: per-shard counts, ES count, SKU<->shard hash
 * consistency, and (optionally) REST API visibility.
 *
 * For every product shard it:
 *   1. counts rows in the `products` table
 *   2. samples SKUs and asserts `shardIndex(sku, n) === shard index` using the
 *      exact same hash the application uses (libs/database/src/database.service.ts)
 *   3. counts docs in the ES `products` index
 *   4. (optional, --api) hits the api-gateway: GET /api/v1/products?limit=1 and
 *      /api/v1/products/search?q=<term>
 *
 * Targets:
 *   k8s (default)   requires: kubectl -n ecommerce port-forward svc/pgbouncer 6432:6432
 *                               kubectl -n ecommerce port-forward svc/elasticsearch 9200:9200
 *                               (and svc/api-gateway 3300:3000 for --api)
 *   compose         requires: docker compose up -d  (+ api-gateway on host for --api)
 *
 * Usage:
 *   npx ts-node scripts/seed/verify.ts
 *   npx ts-node scripts/seed/verify.ts --api
 *   SEED_TARGET=compose npx ts-node scripts/seed/verify.ts --api
 *
 * Env: SEED_TARGET, SEED_SHARD_COUNT, SEED_SHARD_URLS,
 *      PRODUCT_DATABASE_WRITE_URL, ELASTICSEARCH_URL, API_BASE_URL,
 *      SEED_VERIFY_SAMPLE (SKUs sampled per shard, default 500)
 */

import { Pool } from 'pg';
import { shardIndex } from './lib/sku-hash';
import { createShardPools, closePools, countProducts } from './lib/pg';
import { createESClient, esDocCount } from './lib/es';
import { productShardUrls, elasticsearchUrl, apiBaseUrl } from './lib/config';

const SAMPLE = Math.max(1, Number(process.env.SEED_VERIFY_SAMPLE || 500));
const CHECK_API =
  process.argv.includes('--api') ||
  String(process.env.SEED_VERIFY_API || '').toLowerCase() === 'true';

interface CheckResult {
  name: string;
  ok: boolean;
  detail: string;
}

function print(name: string, ok: boolean, detail: string): CheckResult {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}  ${detail}`);
  return { name, ok, detail };
}

async function main(): Promise<void> {
  const urls = productShardUrls();
  const shardCount = urls.length;
  console.log('='.repeat(64));
  console.log(`  VERIFY SEED  (${shardCount} product shard(s), sample=${SAMPLE}/shard)`);
  urls.forEach((u, i) => console.log(`  Shard ${i}: ${u}`));
  console.log('='.repeat(64));

  const results: CheckResult[] = [];
  const pools = createShardPools(urls);
  let totalPg = 0;

  for (let i = 0; i < urls.length; i++) {
    const label = `shard ${i}`;
    let count: number;
    try {
      count = await countProducts(pools[i]);
    } catch (err) {
      results.push(print(label, false, `could not connect/count: ${(err as Error).message}`));
      continue;
    }
    totalPg += count;
    results.push(print(label, true, `${count.toLocaleString()} products`));

    if (count === 0) {
      results.push(print(`${label} hash-check`, false, '0 rows to sample'));
      continue;
    }

    const { rows } = await pools[i].query<{ sku: string }>(
      'SELECT sku FROM products ORDER BY random() LIMIT $1',
      [SAMPLE],
    );
    let mismatches = 0;
    for (const { sku } of rows) {
      if (shardIndex(sku, shardCount) !== i) mismatches++;
    }
    const sampled = rows.length;
    results.push(
      print(
        `${label} hash-check`,
        mismatches === 0,
        `${sampled} SKUs sampled, expected on shard ${i} (mismatches: ${mismatches})`,
      ),
    );
  }

  let esCount = -1;
  try {
    const es = createESClient(elasticsearchUrl());
    esCount = await esDocCount(es);
    await es.close();
    results.push(
      print(
        'ES index count',
        esCount === totalPg,
        `${esCount.toLocaleString()} docs vs ${totalPg.toLocaleString()} PG rows`,
      ),
    );
  } catch (err) {
    results.push(print('ES index count', false, `could not query ES: ${(err as Error).message}`));
  }

  if (CHECK_API) {
    const base = apiBaseUrl();
    try {
      const list = await fetch(`${base}/api/v1/products?limit=1&page=1`).then(
        (r) => r.json() as Promise<{ total?: number }>,
      );
      results.push(
        print(
          'API GET /products',
          typeof list.total === 'number',
          `total=${typeof list.total === 'number' ? list.total.toLocaleString() : 'n/a'} (base: ${base})`,
        ),
      );
    } catch (err) {
      results.push(print('API GET /products', false, `unreachable: ${(err as Error).message}`));
    }
    try {
      const term = 'phone';
      const search = await fetch(
        `${base}/api/v1/products/search?q=${encodeURIComponent(term)}`,
      ).then((r) => r.json() as Promise<{ total?: number }>);
      results.push(
        print(
          `API search "q=${term}"`,
          typeof search.total === 'number',
          `total=${typeof search.total === 'number' ? search.total.toLocaleString() : 'n/a'}`,
        ),
      );
    } catch (err) {
      results.push(print('API search', false, `unreachable: ${(err as Error).message}`));
    }
  }

  await closePools(pools);

  console.log('='.repeat(64));
  console.log(`  PG total: ${totalPg.toLocaleString()} products`);
  console.log(`  ES total: ${esCount >= 0 ? esCount.toLocaleString() : 'n/a'} documents`);
  console.log('='.repeat(64));

  const failed = results.filter((r) => !r.ok);
  console.log(
    failed.length === 0
      ? `ALL ${results.length} CHECKS PASSED`
      : `${failed.length}/${results.length} CHECKS FAILED`,
  );
  process.exit(failed.length === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('Verify failed:', err);
  process.exit(1);
});
