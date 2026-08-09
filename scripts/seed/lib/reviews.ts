/**
 * Review generation for the seed. Deterministic per SKU so re-seeding produces
 * stable ratings, biased toward the product's own rating for consistency.
 */

import { randomUUID } from 'crypto';
import { SeedProduct } from './generator';

export interface SeedReview {
  id: string;
  productId: string;
  rating: number;
  title: string;
  comment: string;
  date: Date;
  verified: boolean;
  helpfulCount: number;
  reviewerName: string;
  createdAt: Date;
}

function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_NAMES = [
  'Aarav',
  'Priya',
  'Rohan',
  'Sneha',
  'Vikram',
  'Ananya',
  'Karan',
  'Divya',
  'Arjun',
  'Meera',
  'Rahul',
  'Pooja',
  'Siddharth',
  'Nisha',
  'Aditya',
  'Kavya',
  'Sameer',
  'Ritika',
  'Manish',
  'Shreya',
  'Dev',
  'Ishita',
  'Varun',
  'Tanvi',
];
const LAST_NAMES = [
  'Sharma',
  'Patel',
  'Verma',
  'Reddy',
  'Iyer',
  'Mehta',
  'Khan',
  'Nair',
  'Gupta',
  'Joshi',
  'Singh',
  'Das',
  'Chopra',
  'Malhotra',
  'Bose',
  'Rao',
];

const TITLES = {
  positive: [
    'Excellent value for money',
    'Better than expected',
    'Highly recommended',
    'Best purchase this year',
    'Solid build quality',
    'Worth every rupee',
    'Great performance',
    'Loving it so far',
    'Outstanding quality',
  ],
  neutral: [
    'Good but not perfect',
    'Decent product overall',
    'Okay for the price',
    'Has minor issues',
    'Average experience',
    'Does the job',
  ],
  negative: [
    'Not worth it',
    'Disappointed',
    'Stopped working',
    'Poor quality control',
    'Overpriced',
    'Could be better',
  ],
};

const COMMENTS = {
  positive: [
    'Delivery was fast and the packaging was solid. Everything matched the description exactly.',
    'Been using it for a couple of weeks now and it works flawlessly. Great buy!',
    'Quality is noticeably better than similar products at this price point.',
    'Setup was easy and it performs exactly as advertised. Very satisfied.',
  ],
  neutral: [
    'Product is fine for the price, though the finishing could be better.',
    'Works as expected but nothing exceptional. Reasonable for the cost.',
    'Decent quality overall. A couple of small niggles but nothing major.',
  ],
  negative: [
    'The item did not meet my expectations and the quality felt cheap.',
    'Had issues within the first week of use. Disappointed with the purchase.',
    'Not worth the money I paid. Would not recommend.',
  ],
};

const REVIEW_COUNT_MIN = 4;
const REVIEW_COUNT_MAX = 9;

/** Generate deterministic reviews for a seeded product. */
export function makeReviews(product: SeedProduct): SeedReview[] {
  const rand = mulberry32(hashSeed(product.sku + ':reviews'));
  const count = REVIEW_COUNT_MIN + Math.floor(rand() * (REVIEW_COUNT_MAX - REVIEW_COUNT_MIN + 1));
  const now = Date.now();
  const reviews: SeedReview[] = [];

  for (let i = 0; i < count; i++) {
    // Weight the generated rating around the product's own rating.
    const drift = (rand() - 0.5) * 1.6;
    const raw = Math.round(product.rating + drift);
    const rating = Math.min(5, Math.max(1, raw));

    const bucket = rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'negative';
    const titles = TITLES[bucket];
    const comments = COMMENTS[bucket];

    reviews.push({
      id: randomUUID(),
      productId: product.id,
      rating,
      title: titles[Math.floor(rand() * titles.length)],
      comment: comments[Math.floor(rand() * comments.length)],
      date: new Date(now - Math.floor(rand() * 90 * 24 * 60 * 60 * 1000)),
      verified: rand() < 0.72,
      helpfulCount: Math.floor(rand() * 40),
      reviewerName: `${FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]} ${
        LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]
      }`,
      createdAt: new Date(now - Math.floor(rand() * 90 * 24 * 60 * 60 * 1000)),
    });
  }

  return reviews;
}
