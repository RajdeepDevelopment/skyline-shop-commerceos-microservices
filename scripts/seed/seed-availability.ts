/**
 * Seed the availability DB (warehouses, pincode serviceability, per-SKU
 * warehouse inventory).
 *
 * Reads real product SKUs from the product shards (SEED_SHARD_URLS /
 * PRODUCT_DATABASE_WRITE_URL) so availability checks resolve against the
 * products actually present in the catalogue.
 *
 * Idempotent: truncates the availability tables and rebuilds them.
 *
 * Env:
 *   AVAILABILITY_DATABASE_URL   availability DB (default: DATABASE_URL)
 *   SEED_SHARD_URLS             comma-separated product shard URLs
 *   SKU_INVENTORY_FRACTION      share of SKUs given inventory (default 0.6)
 */

import { Pool } from 'pg';
import { productShardUrls } from './lib/config';

interface WarehouseDef {
  id: string;
  name: string;
  lat: number;
  lon: number;
  pincodes: Array<[string, number, number]>; // [pincode, priority, deliveryDays]
}

const WAREHOUSES: WarehouseDef[] = [
  {
    id: 'WH_BLR_01',
    name: 'BLR_WH_01',
    lat: 12.9716,
    lon: 77.5946,
    pincodes: [
      ['560001', 1, 1],
      ['560002', 1, 1],
      ['560003', 1, 1],
      ['560010', 1, 1],
      ['560034', 1, 2],
      ['560035', 1, 2],
      ['560037', 1, 2],
      ['560038', 1, 2],
      ['560076', 2, 2],
      ['560086', 2, 2],
      ['560103', 1, 1],
    ],
  },
  {
    id: 'WH_MUM_01',
    name: 'MUM_WH_01',
    lat: 19.076,
    lon: 72.8777,
    pincodes: [
      ['400001', 1, 1],
      ['400002', 1, 1],
      ['400050', 1, 1],
      ['400051', 1, 2],
      ['400052', 2, 2],
      ['400053', 2, 2],
      ['400060', 2, 2],
      ['400061', 2, 3],
      ['400099', 2, 3],
      ['400103', 1, 1],
    ],
  },
  {
    id: 'WH_DEL_01',
    name: 'DEL_WH_01',
    lat: 28.6139,
    lon: 77.209,
    pincodes: [
      ['110001', 1, 1],
      ['110002', 1, 1],
      ['110003', 1, 1],
      ['110005', 1, 2],
      ['110007', 1, 2],
      ['110009', 2, 2],
      ['110011', 2, 2],
      ['110012', 2, 3],
      ['110015', 2, 3],
      ['110017', 2, 3],
      ['110018', 2, 3],
    ],
  },
  {
    id: 'WH_HYD_01',
    name: 'HYD_WH_01',
    lat: 17.385,
    lon: 78.4867,
    pincodes: [
      ['500001', 1, 1],
      ['500002', 1, 1],
      ['500003', 1, 2],
      ['500004', 1, 2],
      ['500006', 2, 2],
      ['500007', 2, 2],
      ['500008', 2, 3],
      ['500009', 2, 3],
      ['500016', 2, 3],
      ['500030', 1, 1],
    ],
  },
];

const TABLE_ORDER = [
  'inventory_reservations',
  'warehouse_inventory',
  'pincode_serviceability',
  'warehouses',
];

async function main(): Promise<void> {
  const dbUrl =
    process.env.AVAILABILITY_DATABASE_URL ||
    process.env.DATABASE_URL ||
    'postgresql://root:password@localhost:5440/availability_db?schema=public';
  const fraction = Math.max(0, Math.min(1, Number(process.env.SKU_INVENTORY_FRACTION || 0.6)));

  const pool = new Pool({ connectionString: dbUrl, max: 4 });
  const shardUrls = productShardUrls();
  const shardPools = shardUrls.map((u) => new Pool({ connectionString: u, max: 2 }));

  console.log('='.repeat(64));
  console.log('  SEED AVAILABILITY');
  console.log(`  DB:       ${dbUrl}`);
  console.log(`  Shards:   ${shardUrls.length}`);
  console.log(`  SKU frac: ${fraction}`);
  console.log('='.repeat(64));

  try {
    for (const table of TABLE_ORDER) {
      await pool.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);
    }

    for (const wh of WAREHOUSES) {
      await pool.query(
        `INSERT INTO warehouses (id, name, latitude, longitude, status, created_at)
         VALUES ($1, $2, $3, $4, 'active', NOW())`,
        [wh.id, wh.name, wh.lat, wh.lon],
      );
      for (const [pincode, priority, deliveryDays] of wh.pincodes) {
        await pool.query(
          `INSERT INTO pincode_serviceability (id, pincode, warehouse_id, priority, delivery_days, active, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, $4, true, NOW())`,
          [pincode, wh.id, priority, deliveryDays],
        );
      }
    }

    const skus: string[] = [];
    for (const sp of shardPools) {
      const res = await sp.query('SELECT sku FROM products ORDER BY sku');
      skus.push(...res.rows.map((r) => r.sku as string));
    }
    console.log(`  Found ${skus.length} product SKUs across shards`);

    const poolLength = WAREHOUSES.length;
    let inserted = 0;
    for (let i = 0; i < skus.length; i++) {
      if (i / skus.length > fraction) break;
      const sku = skus[i];
      const primary = WAREHOUSES[i % poolLength];
      await pool.query(
        `INSERT INTO warehouse_inventory (id, sku, warehouse_id, available_quantity, reserved_quantity, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, 0, NOW())`,
        [sku, primary.id, 100 + ((i * 37) % 401)],
      );
      if (i % 4 === 0) {
        const secondary = WAREHOUSES[(i + 1) % poolLength];
        await pool.query(
          `INSERT INTO warehouse_inventory (id, sku, warehouse_id, available_quantity, reserved_quantity, updated_at)
           VALUES (gen_random_uuid(), $1, $2, $3, 0, NOW())`,
          [sku, secondary.id, 50 + ((i * 53) % 151)],
        );
      }
      inserted++;
    }
    console.log(`  Inserted ${inserted} SKUs into warehouse inventory`);
    console.log('✅ Availability seed complete');
  } finally {
    await pool.end();
    await Promise.all(shardPools.map((p) => p.end()));
  }
}

main().catch((err) => {
  console.error('❌ Availability seed failed:', err);
  process.exit(1);
});
