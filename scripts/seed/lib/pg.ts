/**
 * PostgreSQL helpers for the sharded product DBs (per-shard pools + COPY).
 */

import { randomUUID } from 'crypto';
import { Pool } from 'pg';
import { from as copyFrom } from 'pg-copy-streams';
import { SeedProduct } from './generator';
import { SeedReview } from './reviews';

export const PRODUCT_TABLE = 'products';
export const INVENTORY_TABLE = 'inventory';
export const REVIEW_TABLE = 'reviews';

export function createShardPools(urls: string[], max = 4): Pool[] {
  return urls.map((url) => new Pool({ connectionString: url, max }));
}

export async function closePools(pools: Pool[]): Promise<void> {
  await Promise.all(pools.map((pool) => pool.end()));
}

export function escapeCopyField(val: string | null): string {
  if (val === null || val === undefined) return '\\N';
  return val
    .replace(/\\/g, '\\\\')
    .replace(/\t/g, '\\t')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

function escapeArray(arr: string[]): string {
  return `{${arr.map((v) => v.replace(/[{}|\\,]/g, '')).join(',')}}`;
}

/** COPY a batch of products into a shard's `products` table. */
export async function pgCopyBatch(pool: Pool, products: SeedProduct[]): Promise<void> {
  if (products.length === 0) return;
  const client = await pool.connect();
  try {
    const cols = [
      'id',
      'title',
      'description',
      'category',
      'price',
      'discount_percentage',
      'rating',
      'stock',
      'tags',
      'brand',
      'sku',
      'weight',
      'width',
      'height',
      'depth',
      'warranty_information',
      'shipping_information',
      'availability_status',
      'return_policy',
      'minimum_order_quantity',
      'barcode',
      'qr_code',
      'images',
      'thumbnail',
      'is_active',
      'created_at',
      'updated_at',
    ];
    const stream = client.query(
      copyFrom(`COPY ${PRODUCT_TABLE} (${cols.join(', ')}) FROM STDIN WITH (FORMAT text)`),
    );
    for (const p of products) {
      const row =
        [
          p.id,
          escapeCopyField(p.title),
          escapeCopyField(p.description),
          escapeCopyField(p.category),
          String(p.price),
          String(p.discountPercentage),
          String(p.rating),
          String(p.stock),
          escapeArray(p.tags),
          escapeCopyField(p.brand),
          escapeCopyField(p.sku),
          p.weight !== null ? String(p.weight) : '\\N',
          p.width !== null ? String(p.width) : '\\N',
          p.height !== null ? String(p.height) : '\\N',
          p.depth !== null ? String(p.depth) : '\\N',
          escapeCopyField(p.warrantyInformation),
          escapeCopyField(p.shippingInformation),
          escapeCopyField(p.availabilityStatus),
          escapeCopyField(p.returnPolicy),
          String(p.minimumOrderQuantity),
          escapeCopyField(p.barcode),
          escapeCopyField(p.qrCode),
          escapeArray(p.images),
          escapeCopyField(p.thumbnail),
          'true',
          p.createdAt.toISOString(),
          p.updatedAt.toISOString(),
        ].join('\t') + '\n';
      stream.write(row);
    }
    stream.end();
    await new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  } finally {
    client.release();
  }
}

export async function countProducts(pool: Pool): Promise<number> {
  const { rows } = await pool.query(`SELECT COUNT(*) AS count FROM ${PRODUCT_TABLE}`);
  return Number(rows[0]?.count || 0);
}

/**
 * COPY one inventory row per product so `inventory.quantity` stays in sync with
 * `products.stock` and `findOne`'s `include: { inventory: true }` returns data.
 * Must run after (or atomically with) the product batch for the same shard.
 */
export async function pgCopyInventoryBatch(pool: Pool, products: SeedProduct[]): Promise<void> {
  if (products.length === 0) return;
  const client = await pool.connect();
  try {
    const cols = ['id', 'product_id', 'quantity', 'reserved_qty', 'updated_at'];
    const stream = client.query(
      copyFrom(`COPY ${INVENTORY_TABLE} (${cols.join(', ')}) FROM STDIN WITH (FORMAT text)`),
    );
    for (const p of products) {
      const row =
        [randomUUID(), p.id, String(p.stock), '0', p.updatedAt.toISOString()].join('\t') + '\n';
      stream.write(row);
    }
    stream.end();
    await new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  } finally {
    client.release();
  }
}

export async function countInventory(pool: Pool): Promise<number> {
  const { rows } = await pool.query(`SELECT COUNT(*) AS count FROM ${INVENTORY_TABLE}`);
  return Number(rows[0]?.count || 0);
}

/** COPY generated reviews for a batch of products into a shard's `reviews` table. */
export async function pgCopyReviewBatch(pool: Pool, reviews: SeedReview[]): Promise<void> {
  if (reviews.length === 0) return;
  const client = await pool.connect();
  try {
    const cols = [
      'id',
      'product_id',
      'rating',
      'title',
      'comment',
      'date',
      'verified',
      'helpful_count',
      'reviewer_name',
      'reviewer_email',
      'author_id',
      'created_at',
    ];
    const stream = client.query(
      copyFrom(`COPY ${REVIEW_TABLE} (${cols.join(', ')}) FROM STDIN WITH (FORMAT text)`),
    );
    for (const r of reviews) {
      const row =
        [
          r.id,
          r.productId,
          String(r.rating),
          escapeCopyField(r.title),
          escapeCopyField(r.comment),
          r.date.toISOString(),
          r.verified ? 'true' : 'false',
          String(r.helpfulCount),
          escapeCopyField(r.reviewerName),
          '\\N',
          '\\N',
          r.createdAt.toISOString(),
        ].join('\t') + '\n';
      stream.write(row);
    }
    stream.end();
    await new Promise<void>((resolve, reject) => {
      stream.on('finish', resolve);
      stream.on('error', reject);
    });
  } finally {
    client.release();
  }
}

export async function countReviews(pool: Pool): Promise<number> {
  const { rows } = await pool.query(`SELECT COUNT(*) AS count FROM ${REVIEW_TABLE}`);
  return Number(rows[0]?.count || 0);
}
