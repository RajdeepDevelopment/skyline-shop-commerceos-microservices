/**
 * seed-api.ts — Seed products through the REST API (api-gateway).
 *
 * Writes products one-by-one via `POST /api/v1/products` (JWT-guarded). It
 * registers/login the seed user to obtain a token, then pushes generated
 * products with bounded concurrency. Writes only to Postgres — run
 * `npx ts-node scripts/seed/sync-es.ts` afterwards to populate search.
 *
 * Targets:
 *   k8s (default)   requires: kubectl -n ecommerce port-forward svc/api-gateway 3300:3000
 *   compose         requires: api-gateway running on the host at localhost:3000
 *                             (npm run start:api-gateway) or via nginx (localhost:80)
 *
 * Usage:
 *   SEED_TARGET=k8s     SEED_PRODUCT_COUNT=200 npx ts-node scripts/seed/seed-api.ts
 *   SEED_TARGET=compose SEED_PRODUCT_COUNT=200 npx ts-node scripts/seed/seed-api.ts
 *
 * Env:
 *   SEED_TARGET            k8s (default) | compose
 *   API_BASE_URL           overrides the gateway base URL
 *   SEED_PRODUCT_COUNT     number of products (default 200)
 *   SEED_API_EMAIL         seed user email (default seed.admin@skyline.local)
 *   SEED_API_PASSWORD      seed user password, min 8 chars (default SeedPass@1234)
 *   SEED_API_CONCURRENCY   parallel POSTs (default 10)
 */

import { fetchBaseProducts, makeProduct } from './lib/generator';
import { apiBaseUrl } from './lib/config';

const BASE = apiBaseUrl().replace(/\/$/, '');
const TARGET_COUNT = Number(process.env.SEED_PRODUCT_COUNT || 200);
const EMAIL = process.env.SEED_API_EMAIL || 'seed.admin@skyline.local';
const PASSWORD = process.env.SEED_API_PASSWORD || 'SeedPass@1234';
const CONCURRENCY = Math.max(1, Number(process.env.SEED_API_CONCURRENCY || 10));

async function jsonOrThrow(resp: Response): Promise<any> {
  const text = await resp.text();
  let body: any = {};
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    /* non-JSON response */
  }
  if (!resp.ok) {
    const message = typeof body?.message === 'string' ? body.message : JSON.stringify(body);
    throw new Error(`HTTP ${resp.status}: ${message}`);
  }
  return body;
}

function extractCookie(resp: Response, name: string): string | null {
  const raw = resp.headers.get('set-cookie') || '';
  const match = raw.match(new RegExp(`${name}=([^;]+)`));
  return match ? match[1] : null;
}

async function obtainToken(): Promise<string> {
  const registerResp = await fetch(`${BASE}/api/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD, name: 'Seed Admin' }),
  });
  if (registerResp.ok) {
    console.log(`Registered seed user ${EMAIL}`);
  } else {
    console.log(`Register skipped (HTTP ${registerResp.status}) — assuming user exists`);
  }

  const loginResp = await fetch(`${BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  await jsonOrThrow(loginResp);

  const token = extractCookie(loginResp, 'access_token');
  if (!token) throw new Error('No access_token in login response (missing cookie?)');
  console.log(`Authenticated as ${EMAIL} (session cookie acquired)`);
  return token;
}

async function createProduct(
  cookieToken: string,
  product: ReturnType<typeof makeProduct>,
): Promise<void> {
  const resp = await fetch(`${BASE}/api/v1/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `access_token=${cookieToken}`,
    },
    body: JSON.stringify({
      sku: product.sku,
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      brand: product.brand,
      discountPercentage: product.discountPercentage,
      rating: product.rating,
      stock: product.stock,
      tags: product.tags,
      images: product.images,
      thumbnail: product.thumbnail,
      weight: product.weight,
      width: product.width,
      height: product.height,
      depth: product.depth,
      warrantyInformation: product.warrantyInformation,
      shippingInformation: product.shippingInformation,
      availabilityStatus: product.availabilityStatus,
      returnPolicy: product.returnPolicy,
      minimumOrderQuantity: product.minimumOrderQuantity,
      barcode: product.barcode,
      qrCode: product.qrCode,
      isActive: product.isActive,
    }),
  });
  await jsonOrThrow(resp);
}

async function runPool<T>(
  items: T[],
  limit: number,
  worker: (item: T, index: number) => Promise<void>,
  onProgress: (done: number) => void,
): Promise<number> {
  const failures: Array<{ index: number; error: string }> = [];
  let cursor = 0;
  let done = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      try {
        await worker(items[index], index);
      } catch (err) {
        failures.push({ index, error: (err as Error).message });
      } finally {
        done++;
        onProgress(done);
      }
    }
  });
  await Promise.all(runners);
  return failures.length;
}

async function main(): Promise<void> {
  const startTime = Date.now();
  console.log('='.repeat(64));
  console.log(`  SEED ${TARGET_COUNT.toLocaleString()} PRODUCTS VIA API`);
  console.log(`  Gateway: ${BASE}`);
  console.log(`  Concurrency: ${CONCURRENCY}`);
  console.log('='.repeat(64));

  const token = await obtainToken();
  const baseProducts = await fetchBaseProducts();
  const variantsPerProduct = Math.ceil(TARGET_COUNT / baseProducts.length);

  const products: ReturnType<typeof makeProduct>[] = [];
  let baseIdx = 0;
  let variantIdx = 0;
  for (let i = 0; i < TARGET_COUNT; i++) {
    products.push(makeProduct(baseProducts[baseIdx], baseIdx, variantIdx));
    variantIdx++;
    if (variantIdx >= variantsPerProduct) {
      variantIdx = 0;
      baseIdx = (baseIdx + 1) % baseProducts.length;
    }
  }

  let failures: number;
  try {
    failures = await runPool(
      products,
      CONCURRENCY,
      (product, index) => createProduct(token, product),
      (done) => {
        if (done % 20 === 0 || done === TARGET_COUNT) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const rate = Math.round((done / (Date.now() - startTime)) * 1000);
          console.log(
            `  ${done.toLocaleString()}/${TARGET_COUNT.toLocaleString()} | ${rate.toLocaleString()}/s | ${elapsed}s`,
          );
        }
      },
    );
  } catch (err) {
    console.error('Seeding aborted:', (err as Error).message);
    process.exit(1);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('='.repeat(64));
  console.log(
    `  API SEED COMPLETE | pushed: ${(TARGET_COUNT - failures).toLocaleString()}, failed: ${failures.toLocaleString()} | ${elapsed}s`,
  );
  console.log('  Next: run `npx ts-node scripts/seed/sync-es.ts` to refresh search');
  console.log('       run `npx ts-node scripts/seed/verify.ts --api` to verify');
  console.log('='.repeat(64));
  if (failures > 0) process.exit(1);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
