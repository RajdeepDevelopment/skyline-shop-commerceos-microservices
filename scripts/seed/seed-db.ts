/**
 * seed-db.ts — Seed the product databases (per-shard Postgres) + Elasticsearch.
 *
 * This is the primary bulk seeder. It distributes rows across the N physical
 * product shard databases (`products_s0..sN-1` on k8s, `product_s0..sN-1` on
 * docker-compose) using the exact same SKU hash the application uses
 * (libs/database/src/database.service.ts), so `getShard(sku)` reads the row it
 * wrote. Works for any volume (10k -> 10M+) because it generates and flushes in
 * bounded-memory chunks.
 *
 * Targets:
 *   k8s (default)   requires: kubectl -n ecommerce port-forward svc/pgbouncer 6432:6432
 *                               kubectl -n ecommerce port-forward svc/elasticsearch 9200:9200
 *   compose         requires: docker compose up -d   (infra only; app runs on host)
 *
 * Usage:
 *   SEED_TARGET=k8s     SEED_PRODUCT_COUNT=10000 npx ts-node scripts/seed/seed-db.ts
 *   SEED_TARGET=compose SEED_PRODUCT_COUNT=10000 npx ts-node scripts/seed/seed-db.ts
 *
 * Env:
 *   SEED_TARGET               k8s (default) | compose
 *   SEED_PRODUCT_COUNT        number of products (default 10000)
 *   SEED_SHARD_COUNT          number of product shards (default 4); 1 = single DB
 *   SEED_SHARD_URLS           comma-separated pg URLs, overrides target/shard count
 *   SEED_ES                   "true" seeds Elasticsearch, "false" skips it (default true)
 *   SEARCH_BACKEND            elasticsearch (default) | opensearch (AWS/floci)
 *   PRODUCT_DATABASE_WRITE_URL base pg URL for k8s (default localhost:6432/products);
 *                              shard DBs derived as /products_s{n}
 *   ELASTICSEARCH_URL         es endpoint (default http://localhost:9200)
 *   SEED_RESET                "true" truncates PG shards + recreates the ES index (default true)
 */

import {
  createShardPools,
  closePools,
  pgCopyBatch,
  pgCopyInventoryBatch,
  pgCopyReviewBatch,
  countProducts,
  countInventory,
  countReviews,
} from './lib/pg';
import { createESClient, ensureProductsIndex, esBulkBatch, esDocCount } from './lib/es';
import { fetchBaseProducts, makeProduct, SeedProduct } from './lib/generator';
import { makeReviews, SeedReview } from './lib/reviews';
import { shardIndex } from './lib/sku-hash';
import { seedTarget, productShardUrls, productShardCount, elasticsearchUrl } from './lib/config';

const TARGET_COUNT = Number(process.env.SEED_PRODUCT_COUNT || 10_000);
const USE_ES = String(process.env.SEED_ES ?? 'true').toLowerCase() === 'true';
const RESET = String(process.env.SEED_RESET ?? 'true').toLowerCase() === 'true';
const PG_BATCH = 5_000;
const ES_BATCH = 1_000;
const PROGRESS_INTERVAL = 1_000;

async function main(): Promise<void> {
  const startTime = Date.now();
  const urls = productShardUrls();
  const shardCount = urls.length;
  const esUrl = elasticsearchUrl();
  const target = seedTarget();

  console.log('='.repeat(64));
  console.log(
    `  SEED ${TARGET_COUNT.toLocaleString()} PRODUCTS  (target: ${target}, ${shardCount} shard(s)${USE_ES ? ' + ES' : ''})`,
  );
  urls.forEach((u, i) => console.log(`  Shard ${i}: ${u}`));
  if (USE_ES) console.log(`  ES:   ${esUrl}`);
  console.log(`  Reset: ${RESET}`);
  console.log('='.repeat(64));

  const baseProducts = await fetchBaseProducts();
  const variantsPerProduct = Math.ceil(TARGET_COUNT / baseProducts.length);

  const pools = createShardPools(urls);
  const es = USE_ES ? createESClient(esUrl) : null;

  if (RESET) {
    console.log(`Truncating products table in ${pools.length} shard(s)...`);
    for (const pool of pools) {
      await pool.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE');
    }
  }
  if (es) await ensureProductsIndex(es, RESET);

  let totalGenerated = 0;
  let totalPG = 0;
  let totalES = 0;
  let esErrors = 0;
  let baseIdx = 0;
  let variantIdx = 0;

  const shardBuffers: SeedProduct[][] = pools.map(() => []);
  const reviewBuffers: SeedReview[][] = pools.map(() => []);
  const shardFlush = Math.max(1_000, Math.floor(PG_BATCH / pools.length));

  while (totalGenerated < TARGET_COUNT) {
    const chunkSize = Math.min(PG_BATCH, TARGET_COUNT - totalGenerated);
    const chunk: SeedProduct[] = [];
    for (let i = 0; i < chunkSize; i++) {
      const product = makeProduct(baseProducts[baseIdx], baseIdx, variantIdx);
      chunk.push(product);
      shardBuffers[shardIndex(product.sku, shardCount)].push(product);
      reviewBuffers[shardIndex(product.sku, shardCount)].push(...makeReviews(product));
      totalGenerated++;
      variantIdx++;
      if (variantIdx >= variantsPerProduct) {
        variantIdx = 0;
        baseIdx = (baseIdx + 1) % baseProducts.length;
      }
    }

    for (let s = 0; s < pools.length; s++) {
      if (shardBuffers[s].length >= shardFlush) {
        await pgCopyBatch(pools[s], shardBuffers[s]);
        await pgCopyInventoryBatch(pools[s], shardBuffers[s]);
        await pgCopyReviewBatch(pools[s], reviewBuffers[s]);
        totalPG += shardBuffers[s].length;
        shardBuffers[s] = [];
        reviewBuffers[s] = [];
      }
    }

    if (es) {
      for (let i = 0; i < chunk.length; i += ES_BATCH) {
        const result = await esBulkBatch(es, chunk.slice(i, i + ES_BATCH));
        totalES += result.indexed;
        esErrors += result.errors;
      }
    }

    if (totalGenerated % PROGRESS_INTERVAL === 0 || totalGenerated >= TARGET_COUNT) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const rate = Math.round((totalGenerated / (Date.now() - startTime)) * 1000);
      const pct = ((totalGenerated / TARGET_COUNT) * 100).toFixed(1);
      const esProgress = es ? ` | ES: ${totalES.toLocaleString()}` : '';
      console.log(
        `  ${totalGenerated.toLocaleString()}/${TARGET_COUNT.toLocaleString()} (${pct}%) | PG: ${totalPG.toLocaleString()}${esProgress} | ${rate.toLocaleString()}/s | ${elapsed}s`,
      );
    }
  }

  for (let s = 0; s < pools.length; s++) {
    if (shardBuffers[s].length > 0) {
      await pgCopyBatch(pools[s], shardBuffers[s]);
      await pgCopyInventoryBatch(pools[s], shardBuffers[s]);
      await pgCopyReviewBatch(pools[s], reviewBuffers[s]);
      totalPG += shardBuffers[s].length;
      shardBuffers[s] = [];
      reviewBuffers[s] = [];
    }
  }

  if (es) await es.indices.refresh({ index: 'products' });

  const shardCounts: number[] = [];
  const inventoryCounts: number[] = [];
  const reviewCounts: number[] = [];
  for (const pool of pools) {
    shardCounts.push(await countProducts(pool));
    inventoryCounts.push(await countInventory(pool));
    reviewCounts.push(await countReviews(pool));
  }
  const esCount = es ? await esDocCount(es) : 0;

  await closePools(pools);
  if (es) await es.close();

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n' + '='.repeat(64));
  console.log('  SEED COMPLETE');
  console.log('='.repeat(64));
  shardCounts.forEach((c, i) =>
    console.log(
      `  Shard ${i}:  ${c.toLocaleString()} products / ${inventoryCounts[i].toLocaleString()} inventory / ${reviewCounts[i].toLocaleString()} reviews`,
    ),
  );
  const pgTotal = shardCounts.reduce((a, b) => a + b, 0);
  const invTotal = inventoryCounts.reduce((a, b) => a + b, 0);
  const reviewTotal = reviewCounts.reduce((a, b) => a + b, 0);
  console.log(`  PG total:  ${pgTotal.toLocaleString()} products`);
  console.log(
    `  Inventory: ${invTotal.toLocaleString()} rows (${pgTotal === invTotal ? 'in sync' : 'OUT OF SYNC'})`,
  );
  console.log(`  Reviews:   ${reviewTotal.toLocaleString()} rows`);
  if (es) {
    console.log(`  ES total:  ${esCount.toLocaleString()} documents`);
    console.log(`  ES errors: ${esErrors.toLocaleString()}`);
  }
  console.log(`  Time:      ${elapsed}s`);
  console.log('='.repeat(64));
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
