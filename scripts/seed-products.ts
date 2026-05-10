import { PrismaClient } from '../libs/database/src/generated/client/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

async function seed() {
  console.log('🌱 Starting product seeding from DummyJSON (TS)...');

  // Ensure DATABASE_URL is set for the product database
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
    const res = await fetch('https://dummyjson.com/products?limit=100');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    const products = data.products;

    console.log(`📦 Fetched ${products.length} products. Starting sync...`);

    // Create unique categories first

    const categories = Array.from(new Set(products.map((p: any) => p.category)));
    console.log(`🏷️ Found ${categories.length} unique categories. Seeding...`);

    const categoryMap = new Map();
    for (const catName of categories) {
      const category = await prisma.category.upsert({
        where: { name: catName as string },
        update: {},
        create: { name: catName as string },
      });
      categoryMap.set(catName, category.id);
    }

    for (const p of products) {
      const sku = `DJ-${p.id}`;

      const categoryId = categoryMap.get(p.category);

      // Idempotency: Check if SKU exists
      const existing = await prisma.product.findUnique({
        where: { sku },
      });

      if (existing) {
        // Update category if it was null
        if (!existing.categoryId && categoryId) {
          await prisma.product.update({
            where: { id: existing.id },

            data: { categoryId },
          });
        }
        continue;
      }

      await prisma.product.create({
        data: {
          sku,

          name: p.title,

          description: p.description,

          price: p.price,
          isActive: true,

          categoryId: categoryId || null,
        },
      });

      console.log(`✅ Seeded: ${p.title}`);
    }

    console.log('✨ Seeding completed successfully!');
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
