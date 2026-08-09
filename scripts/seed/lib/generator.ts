/**
 * Deterministic-ish product data generation shared by the DB and API seeders.
 *
 * Fetches a small real catalog from dummyjson (with a bundled fallback catalog
 * when offline) and expands it into `count` variants with unique SKUs.
 */

import { randomUUID } from 'crypto';

/** dummyjson prices are USD; the storefront prices in INR. */
export const USD_TO_INR = 83;

export interface BaseProduct {
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  weight: number | null;
  dimensions?: { width: number | null; height: number | null; depth: number | null };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  minimumOrderQuantity: number;
  barcode: string;
  qrCode: string;
  images: string[];
  thumbnail: string;
}

export interface SeedProduct extends BaseProduct {
  id: string;
  sku: string;
  width: number | null;
  height: number | null;
  depth: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FALLBACK_BASE: BaseProduct[] = [
  {
    title: 'Smartphone',
    description: 'A versatile smartphone with a great camera.',
    category: 'smartphones',
    price: 699,
    discountPercentage: 5,
    rating: 4.5,
    stock: 150,
    tags: ['mobile', 'electronics'],
    brand: 'TechCorp',
    weight: 0.2,
    dimensions: { width: 7, height: 0.8, depth: 15 },
    warrantyInformation: '1 year warranty',
    shippingInformation: 'Ships in 24h',
    availabilityStatus: 'In Stock',
    returnPolicy: '30 day returns',
    minimumOrderQuantity: 1,
    barcode: '100000000001',
    qrCode: '',
    images: [],
    thumbnail: '',
  },
  {
    title: 'Laptop',
    description: 'Lightweight laptop for work and play.',
    category: 'laptops',
    price: 1299,
    discountPercentage: 8,
    rating: 4.7,
    stock: 80,
    tags: ['laptop', 'electronics'],
    brand: 'TechCorp',
    weight: 1.8,
    dimensions: { width: 32, height: 2, depth: 22 },
    warrantyInformation: '2 year warranty',
    shippingInformation: 'Ships in 48h',
    availabilityStatus: 'In Stock',
    returnPolicy: '30 day returns',
    minimumOrderQuantity: 1,
    barcode: '100000000002',
    qrCode: '',
    images: [],
    thumbnail: '',
  },
  {
    title: 'Running Shoes',
    description: 'Comfortable running shoes for all terrains.',
    category: 'footwear',
    price: 89,
    discountPercentage: 12,
    rating: 4.3,
    stock: 500,
    tags: ['shoes', 'sport'],
    brand: 'ActiveWear',
    weight: 0.5,
    dimensions: { width: 12, height: 12, depth: 32 },
    warrantyInformation: 'No warranty',
    shippingInformation: 'Ships in 12h',
    availabilityStatus: 'In Stock',
    returnPolicy: '30 day returns',
    minimumOrderQuantity: 1,
    barcode: '100000000003',
    qrCode: '',
    images: [],
    thumbnail: '',
  },
  {
    title: 'Backpack',
    description: 'Durable backpack with multiple compartments.',
    category: 'accessories',
    price: 49,
    discountPercentage: 0,
    rating: 4.1,
    stock: 300,
    tags: ['bag', 'travel'],
    brand: 'TravelMax',
    weight: 0.8,
    dimensions: { width: 30, height: 45, depth: 15 },
    warrantyInformation: '6 month warranty',
    shippingInformation: 'Ships in 24h',
    availabilityStatus: 'In Stock',
    returnPolicy: '30 day returns',
    minimumOrderQuantity: 1,
    barcode: '100000000004',
    qrCode: '',
    images: [],
    thumbnail: '',
  },
  {
    title: 'Desk Lamp',
    description: 'Energy-efficient LED desk lamp.',
    category: 'home',
    price: 35,
    discountPercentage: 10,
    rating: 4.0,
    stock: 200,
    tags: ['home', 'lighting'],
    brand: 'HomePlus',
    weight: 0.6,
    dimensions: { width: 15, height: 40, depth: 15 },
    warrantyInformation: '1 year warranty',
    shippingInformation: 'Ships in 24h',
    availabilityStatus: 'In Stock',
    returnPolicy: '30 day returns',
    minimumOrderQuantity: 1,
    barcode: '100000000005',
    qrCode: '',
    images: [],
    thumbnail: '',
  },
  {
    title: 'Espresso Machine',
    description: 'Brew rich espresso at home.',
    category: 'kitchen',
    price: 249,
    discountPercentage: 15,
    rating: 4.6,
    stock: 60,
    tags: ['kitchen', 'coffee'],
    brand: 'BrewMaster',
    weight: 7.5,
    dimensions: { width: 25, height: 35, depth: 30 },
    warrantyInformation: '2 year warranty',
    shippingInformation: 'Ships in 48h',
    availabilityStatus: 'In Stock',
    returnPolicy: '30 day returns',
    minimumOrderQuantity: 1,
    barcode: '100000000006',
    qrCode: '',
    images: [],
    thumbnail: '',
  },
  {
    title: 'Yoga Mat',
    description: 'Non-slip eco-friendly yoga mat.',
    category: 'fitness',
    price: 29,
    discountPercentage: 0,
    rating: 4.4,
    stock: 400,
    tags: ['fitness', 'yoga'],
    brand: 'ActiveWear',
    weight: 1.0,
    dimensions: { width: 61, height: 0.5, depth: 183 },
    warrantyInformation: 'No warranty',
    shippingInformation: 'Ships in 24h',
    availabilityStatus: 'In Stock',
    returnPolicy: '30 day returns',
    minimumOrderQuantity: 1,
    barcode: '100000000007',
    qrCode: '',
    images: [],
    thumbnail: '',
  },
  {
    title: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones.',
    category: 'audio',
    price: 199,
    discountPercentage: 20,
    rating: 4.8,
    stock: 250,
    tags: ['audio', 'headphones'],
    brand: 'SoundWave',
    weight: 0.25,
    dimensions: { width: 18, height: 8, depth: 20 },
    warrantyInformation: '2 year warranty',
    shippingInformation: 'Ships in 24h',
    availabilityStatus: 'In Stock',
    returnPolicy: '30 day returns',
    minimumOrderQuantity: 1,
    barcode: '100000000008',
    qrCode: '',
    images: [],
    thumbnail: '',
  },
  {
    title: 'Electric Kettle',
    description: 'Fast-boiling stainless steel kettle.',
    category: 'kitchen',
    price: 45,
    discountPercentage: 5,
    rating: 4.2,
    stock: 180,
    tags: ['kitchen', 'appliance'],
    brand: 'HomePlus',
    weight: 1.2,
    dimensions: { width: 20, height: 25, depth: 15 },
    warrantyInformation: '1 year warranty',
    shippingInformation: 'Ships in 24h',
    availabilityStatus: 'In Stock',
    returnPolicy: '30 day returns',
    minimumOrderQuantity: 1,
    barcode: '100000000009',
    qrCode: '',
    images: [],
    thumbnail: '',
  },
  {
    title: 'Stainless Water Bottle',
    description: 'Insulated bottle keeps drinks cold.',
    category: 'accessories',
    price: 25,
    discountPercentage: 0,
    rating: 4.3,
    stock: 600,
    tags: ['bottle', 'travel'],
    brand: 'TravelMax',
    weight: 0.4,
    dimensions: { width: 7, height: 25, depth: 7 },
    warrantyInformation: 'No warranty',
    shippingInformation: 'Ships in 12h',
    availabilityStatus: 'In Stock',
    returnPolicy: '30 day returns',
    minimumOrderQuantity: 1,
    barcode: '100000000010',
    qrCode: '',
    images: [],
    thumbnail: '',
  },
];

const SUFFIXES = [
  'Standard',
  'Premium',
  'Elite',
  'Pro',
  'Max',
  'Ultra',
  'Lite',
  'Plus',
  'Essential',
  'Advanced',
  'Classic',
  'Modern',
  'Compact',
  'Deluxe',
  'Value',
  'Professional',
  'Home',
  'Office',
  'Travel',
  'Outdoor',
  'Digital',
  'Smart',
];

const ADJECTIVES = [
  'New',
  'Improved',
  'Enhanced',
  'Upgraded',
  'Revised',
  'Updated',
  'Latest',
  'Original',
  'Signature',
  'Exclusive',
  'Limited',
  'Special',
  'Custom',
];

function rand(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function fetchBaseProducts(): Promise<BaseProduct[]> {
  try {
    const url =
      'https://dummyjson.com/products?limit=194&select=title,description,category,price,discountPercentage,rating,stock,tags,brand,weight,dimensions,warrantyInformation,shippingInformation,availabilityStatus,returnPolicy,minimumOrderQuantity,meta,images,thumbnail';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const resp = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = (await resp.json()) as { products: any[] };
    console.log(`Fetched ${data.products.length} base products from dummyjson`);
    return data.products.map((p: any) => ({
      title: p.title,
      description: p.description ?? '',
      category: p.category ?? 'general',
      price: Number(p.price) || 0,
      discountPercentage: Number(p.discountPercentage) || 0,
      rating: Number(p.rating) || 0,
      stock: Number(p.stock) || 0,
      tags: Array.isArray(p.tags) ? p.tags : [],
      brand: p.brand ?? '',
      weight: p.weight ?? null,
      dimensions: p.dimensions
        ? {
            width: p.dimensions.width ?? null,
            height: p.dimensions.height ?? null,
            depth: p.dimensions.depth ?? null,
          }
        : undefined,
      warrantyInformation: p.warrantyInformation ?? '',
      shippingInformation: p.shippingInformation ?? '',
      availabilityStatus: p.availabilityStatus ?? 'In Stock',
      returnPolicy: p.returnPolicy ?? '',
      minimumOrderQuantity: p.minimumOrderQuantity ?? 1,
      barcode: p.meta?.barcode ?? `${randInt(1000000000000, 9999999999999)}`,
      qrCode: p.meta?.qrCode ?? '',
      images: Array.isArray(p.images) ? p.images : [],
      thumbnail: p.thumbnail ?? '',
    }));
  } catch (err) {
    console.warn(`dummyjson fetch failed (${(err as Error).message}); using fallback catalog`);
    return FALLBACK_BASE;
  }
}

/** Generate the i-th variant. `baseIdx` picks the base product, `variantIdx` the variation. */
export function makeProduct(base: BaseProduct, baseIdx: number, variantIdx: number): SeedProduct {
  const sku = `P-${String(baseIdx).padStart(4, '0')}-V${String(variantIdx).padStart(6, '0')}`;
  const title =
    variantIdx === 0 ? base.title : `${base.title} ${pick(SUFFIXES)} ${pick(ADJECTIVES)}`.trim();
  const priceMultiplier = variantIdx === 0 ? 1 : rand(0.5, 2.5);
  const price = Math.round(base.price * USD_TO_INR * priceMultiplier * 100) / 100;
  const discount = Math.min(50, Math.max(0, base.discountPercentage + rand(-5, 5)));
  const rating = Math.min(5, Math.max(0.5, base.rating + rand(-1, 1)));
  const stock = variantIdx === 0 ? base.stock : randInt(0, 500);
  const tags =
    base.tags.length > 0
      ? [base.tags[0], pick(['deals', 'popular', 'trending', 'new', 'sale', 'bestseller'])]
      : ['general'];
  const now = new Date();
  const createdAt = new Date(now.getTime() - randInt(0, 365 * 24 * 60 * 60 * 1000));

  return {
    id: randomUUID(),
    title,
    description: base.description,
    category: base.category,
    price,
    discountPercentage: Math.round(discount * 100) / 100,
    rating: Math.round(rating * 100) / 100,
    stock,
    tags,
    brand:
      variantIdx === 0 ? base.brand : base.brand ? `${base.brand} ${pick(SUFFIXES)}`.trim() : '',
    sku,
    weight: base.weight,
    width: base.dimensions?.width ?? null,
    height: base.dimensions?.height ?? null,
    depth: base.dimensions?.depth ?? null,
    warrantyInformation: base.warrantyInformation,
    shippingInformation: base.shippingInformation,
    availabilityStatus: stock > 0 ? 'In Stock' : 'Out of Stock',
    returnPolicy: base.returnPolicy,
    minimumOrderQuantity: base.minimumOrderQuantity,
    barcode: base.barcode,
    qrCode: base.qrCode,
    images: base.images,
    thumbnail: base.thumbnail,
    isActive: true,
    createdAt,
    updatedAt: now,
  };
}
