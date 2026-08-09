/**
 * sync-es.ts — Rebuild the Elasticsearch `products` index from the shard DBs.
 *
 * Reads every row from each physical product shard (`products_s0..sN-1` /
 * `product_s0..sN-1`) and bulk-indexes them into ES. Use this after seeding via
 * the REST API (seed-api.ts), which only writes to Postgres, or to refresh ES
 * after manual changes.
 *
 * Targets:
 *   k8s (default)   requires: kubectl -n ecommerce port-forward svc/pgbouncer 6432:6432
 *                               kubectl -n ecommerce port-forward svc/elasticsearch 9200:9200
 *   compose         requires: docker compose up -d
 *
 * Usage:
 *   npx ts-node scripts/seed/sync-es.ts
 *   SEED_TARGET=compose npx ts-node scripts/seed/sync-es.ts
 *
 * Env: SEED_TARGET, SEED_SHARD_COUNT, SEED_SHARD_URLS,
 *      PRODUCT_DATABASE_WRITE_URL, ELASTICSEARCH_URL
 */

import { Pool } from 'pg';
import { createESClient, ensureProductsIndex, ES_INDEX, esDocCount } from './lib/es';
import { seedTarget, productShardUrls, elasticsearchUrl } from './lib/config';

const BATCH = 2_000;

interface DbRow {
  id: string;
  sku: string;
  title: string;
  description: string | null;
  category: string;
  price: string | number;
  discount_percentage: string | number;
  rating: string | number;
  stock: number;
  tags: string[];
  brand: string | null;
  weight: number | null;
  width: number | null;
  height: number | null;
  depth: number | null;
  warranty_information: string | null;
  shipping_information: string | null;
  availability_status: string | null;
  return_policy: string | null;
  minimum_order_quantity: number;
  barcode: string | null;
  qr_code: string | null;
  thumbnail: string | null;
  images: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

async function main(): Promise<void> {
  const urls = productShardUrls();
  const esUrl = elasticsearchUrl();
  console.log('='.repeat(64));
  console.log(`  SYNC PG SHARDS -> ELASTICSEARCH  (target: ${seedTarget()})`);
  urls.forEach((u, i) => console.log(`  Shard ${i}: ${u}`));
  console.log(`  ES:   ${esUrl}`);
  console.log('='.repeat(64));

  const es = createESClient(esUrl);
  await ensureProductsIndex(es, true);

  let total = 0;
  let errors = 0;

  for (let shardIdx = 0; shardIdx < urls.length; shardIdx++) {
    console.log(`\nSyncing shard ${shardIdx} (${urls[shardIdx]})...`);
    const pool = new Pool({ connectionString: urls[shardIdx], max: 4 });
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const { rows } = await pool.query<DbRow>(
        `SELECT id, sku, title, description, category, price, discount_percentage, rating,
                stock, tags, brand, weight, width, height, depth, warranty_information,
                shipping_information, availability_status, return_policy,
                minimum_order_quantity, barcode, qr_code, thumbnail, images, is_active,
                created_at, updated_at
         FROM products
         WHERE is_active = true
         ORDER BY created_at ASC
         LIMIT $1 OFFSET $2`,
        [BATCH, offset],
      );

      if (rows.length === 0) {
        hasMore = false;
        break;
      }

      const ops = rows.flatMap((p) => [
        { index: { _index: ES_INDEX, _id: p.id } },
        {
          id: p.id,
          sku: p.sku,
          title: p.title,
          description: p.description || '',
          category: p.category || '',
          price: parseFloat(String(p.price)) || 0,
          discountPercentage: parseFloat(String(p.discount_percentage)) || 0,
          rating: parseFloat(String(p.rating)) || 0,
          stock: parseInt(String(p.stock), 10) || 0,
          tags: Array.isArray(p.tags) ? p.tags : [],
          brand: p.brand || '',
          weight: p.weight,
          width: p.width,
          height: p.height,
          depth: p.depth,
          warrantyInformation: p.warranty_information || '',
          shippingInformation: p.shipping_information || '',
          availabilityStatus: p.availability_status || '',
          returnPolicy: p.return_policy || '',
          minimumOrderQuantity: parseInt(String(p.minimum_order_quantity), 10) || 0,
          barcode: p.barcode || '',
          thumbnail: p.thumbnail || '',
          images: Array.isArray(p.images) ? p.images : [],
          isActive: p.is_active,
          createdAt: p.created_at?.toISOString?.() || new Date().toISOString(),
          updatedAt: p.updated_at?.toISOString?.() || new Date().toISOString(),
        },
      ]);

      const result = await es.bulk({ operations: ops, refresh: false });
      const batchErrors = result.items?.filter((i) => i.index?.error).length || 0;
      total += rows.length - batchErrors;
      errors += batchErrors;
      offset += BATCH;

      if (rows.length < BATCH) hasMore = false;
      console.log(`  shard ${shardIdx}: ${offset.toLocaleString()} rows scanned`);
    }
    await pool.end();
  }

  await es.indices.refresh({ index: ES_INDEX });
  const count = await esDocCount(es);
  console.log('\n' + '='.repeat(64));
  console.log(`  DONE | indexed: ${total.toLocaleString()} (errors: ${errors.toLocaleString()})`);
  console.log(`  ES index total: ${count.toLocaleString()} documents`);
  console.log('='.repeat(64));
  await es.close();

  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
