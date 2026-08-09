import { PrismaClient } from '../libs/database/src/generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function seed() {
  console.log('🌱 Starting product seeding from DummyJSON (TS)...');

  const productDbUrl = process.env.PRODUCT_DATABASE_WRITE_URL;
  if (productDbUrl) {
    process.env.DATABASE_URL = productDbUrl;
    console.log('📡 Using Product Database URL');
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
  }
  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const res = await fetch('https://dummyjson.com/products?limit=194');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    const products = data.products;

    console.log(`📦 Fetched ${products.length} products. Starting sync...`);

    let created = 0;
    let skipped = 0;

    for (const p of products) {
      const sku = `DJ-${p.id}`;

      const existing = await prisma.product.findUnique({ where: { sku } });
      if (existing) {
        skipped++;
        continue;
      }

      await prisma.product.create({
        data: {
          sku,
          title: p.title,
          description: p.description,
          category: p.category,
          price: p.price,
          discountPercentage: p.discountPercentage ?? 0,
          rating: p.rating ?? 0,
          stock: p.stock ?? 0,
          tags: p.tags ?? [],
          brand: p.brand ?? null,
          weight: p.weight ?? null,
          width: p.dimensions?.width ?? null,
          height: p.dimensions?.height ?? null,
          depth: p.dimensions?.depth ?? null,
          warrantyInformation: p.warrantyInformation ?? null,
          shippingInformation: p.shippingInformation ?? null,
          availabilityStatus: p.availabilityStatus ?? 'In Stock',
          returnPolicy: p.returnPolicy ?? null,
          minimumOrderQuantity: p.minimumOrderQuantity ?? 1,
          barcode: p.meta?.barcode ?? null,
          qrCode: p.meta?.qrCode ?? null,
          images: p.images ?? [],
          thumbnail: p.thumbnail ?? null,
          isActive: true,
        },
      });

      created++;
      if (created % 50 === 0) {
        console.log(`  ✅ ${created} seeded, ${skipped} skipped...`);
      }
    }

    console.log(`✨ Seeding completed! Created: ${created}, Skipped (existing): ${skipped}`);
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    if (error.stack) console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((err) => {
  console.error('CRITICAL SEED ERROR:', err);
  process.exit(1);
});
