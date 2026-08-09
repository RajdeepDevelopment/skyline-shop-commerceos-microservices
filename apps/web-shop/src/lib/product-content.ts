import type { Product } from '@/modules/products/types/product.types';

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export interface ReviewBreakdown {
  rating: number;
  percentage: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

export interface ProductHighlight {
  icon: string;
  text: string;
}

/* Deterministic PRNG seeded from a string (stable across renders) */
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

const REVIEW_TITLES = {
  positive: [
    'Excellent value for money',
    'Better than expected',
    'Highly recommended',
    'Best purchase this year',
    'Solid build quality',
    'Worth every rupee',
    'Great performance',
    'Loving it so far',
  ],
  neutral: [
    'Good but not perfect',
    'Decent product overall',
    'Okay for the price',
    'Has minor issues',
    'Average experience',
  ],
  negative: [
    'Not worth it',
    'Disappointed',
    'Stopped working',
    'Poor quality control',
    'Overpriced',
  ],
};

const REVIEW_BODIES = {
  positive: [
    'The product exceeded my expectations. Everything works as advertised and the quality is top-notch. Delivery was also quicker than expected.',
    'I did a lot of research before buying this and I am glad I went with it. Performance is smooth, looks premium, and the price is very competitive.',
    'Using it daily for over two weeks now. No complaints at all. Customer support was also responsive when I had a question.',
    'Amazing product for the price point. Would definitely recommend it to friends and family. The packaging was also very professional.',
    'Superb quality and build. The attention to detail is clear. Shipping was fast and the item arrived in perfect condition.',
  ],
  neutral: [
    'The product works fine for basic use. It is not exceptional but gets the job done. For the price, it is a fair deal.',
    'Good product but there are a few small issues. Everything else is decent. I would still recommend it for casual use.',
    'It is a decent product. Delivery was a bit delayed but the product itself is okay. Nothing to complain about much.',
  ],
  negative: [
    'The product stopped performing as expected after a few days of use. Had to contact support. Not the experience I hoped for.',
    'Quality does not match the description. Would not buy again, sadly. Returning it for a refund.',
    'Overpriced for what it offers. There are better alternatives available in the same price range.',
  ],
};

const categoryFaqs = (category: string): { question: string; answer: string }[] => {
  const c = (category || '').toLowerCase();
  const faqs: { question: string; answer: string }[] = [
    {
      question: 'Is this product covered under warranty?',
      answer:
        'Yes, this product comes with a standard 1-year manufacturer warranty covering manufacturing defects. You can raise a claim from your account or contact support anytime.',
    },
    {
      question: 'What is the return policy?',
      answer:
        'You can return this product within 7 days of delivery for a full refund, provided it is unused and in its original packaging. Replacements are available within 15 days for defects.',
    },
  ];
  if (c.includes('phone') || c.includes('mobile')) {
    faqs.unshift(
      {
        question: 'Does this support wireless charging?',
        answer:
          'Yes, this model supports wireless charging at up to 15W. A charger is not included in the box.',
      },
      {
        question: 'Is the charger included in the box?',
        answer:
          'No, the charger is sold separately. The box contains the device, a USB-C cable, and documentation.',
      },
      {
        question: 'Does it support 5G connectivity?',
        answer: 'Yes, it supports both SA and NSA 5G bands used by major networks in India.',
      },
    );
  }
  if (c.includes('laptop') || c.includes('computer')) {
    faqs.unshift(
      {
        question: 'Can the RAM be upgraded later?',
        answer:
          'The RAM is soldered on this model and cannot be upgraded post-purchase. Please pick the configuration you need.',
      },
      {
        question: 'Does it include a backlit keyboard?',
        answer: 'Yes, this model features a full-size backlit keyboard with adjustable brightness.',
      },
    );
  }
  if (c.includes('headphone') || c.includes('audio') || c.includes('earbud')) {
    faqs.unshift({
      question: 'Is there active noise cancellation?',
      answer:
        'Yes, it has hybrid active noise cancellation with multiple modes. Battery life is around 30 hours with ANC on.',
    });
  }
  if (c.includes('fashion') || c.includes('cloth') || c.includes('shirt')) {
    faqs.unshift({
      question: 'What is the fit like?',
      answer:
        'This is a regular fit. We recommend referring to the size guide in the product images before ordering.',
    });
  }
  if (c.includes('watch')) {
    faqs.unshift({
      question: 'Is it water resistant?',
      answer:
        'Yes, it is water resistant up to 50m (5 ATM), suitable for swimming but not for diving.',
    });
  }
  return faqs;
};

function specsFor(category: string): { label: string; value: string }[] {
  const c = (category || '').toLowerCase();
  if (c.includes('phone') || c.includes('mobile')) {
    return [
      { label: 'Display', value: '6.3" FHD+ AMOLED, 120Hz' },
      { label: 'Processor', value: 'Octa-core 3.3 GHz' },
      { label: 'RAM', value: '8 GB' },
      { label: 'Storage', value: '256 GB' },
      { label: 'Battery', value: '5000 mAh' },
      { label: 'Charging', value: '68W Turbo' },
      { label: 'Camera', value: '50 MP + 12 MP + 8 MP' },
      { label: 'Weight', value: '189 g' },
      { label: 'Network', value: '5G SA / NSA' },
    ];
  }
  if (c.includes('laptop')) {
    return [
      { label: 'Display', value: '15.6" FHD IPS, 144Hz' },
      { label: 'Processor', value: 'Intel Core Ultra 7' },
      { label: 'RAM', value: '16 GB LPDDR5' },
      { label: 'Storage', value: '512 GB NVMe SSD' },
      { label: 'Graphics', value: 'Integrated Intel Arc' },
      { label: 'Battery', value: '75 Whr' },
      { label: 'Weight', value: '1.8 kg' },
      { label: 'OS', value: 'Windows 11 Home' },
    ];
  }
  if (c.includes('audio') || c.includes('headphone') || c.includes('earbud')) {
    return [
      { label: 'Type', value: 'Wireless Over-Ear' },
      { label: 'Driver', value: '40mm Titanium' },
      { label: 'Noise Cancelling', value: 'Hybrid ANC' },
      { label: 'Battery', value: '30 hours (ANC on)' },
      { label: 'Charging', value: 'USB-C, fast charge' },
      { label: 'Connectivity', value: 'Bluetooth 5.3' },
      { label: 'Weight', value: '250 g' },
    ];
  }
  if (c.includes('shirt') || c.includes('fashion') || c.includes('cloth')) {
    return [
      { label: 'Material', value: '100% Cotton' },
      { label: 'Fit', value: 'Regular' },
      { label: 'Wash Care', value: 'Machine wash cold' },
      { label: 'Sleeves', value: 'Full Sleeve' },
      { label: 'Collar', value: 'Spread Collar' },
    ];
  }
  if (c.includes('watch')) {
    return [
      { label: 'Case Size', value: '42 mm' },
      { label: 'Display', value: 'AMOLED, 466 x 466' },
      { label: 'Battery', value: '10 days typical' },
      { label: 'Water Resistance', value: '5 ATM' },
      { label: 'Connectivity', value: 'Bluetooth 5.2' },
      { label: 'Sensors', value: 'HR, SpO2, GPS' },
    ];
  }
  return [
    { label: 'Brand', value: 'Skyline' },
    { label: 'Model', value: '2026 Edition' },
    { label: 'Warranty', value: '1 Year' },
    { label: 'Country of Origin', value: 'India' },
    { label: 'In the Box', value: 'Product + Documentation' },
  ];
}

export function getHighlights(product: Product): ProductHighlight[] {
  const highlights: ProductHighlight[] = [];
  if (product.brand) highlights.push({ icon: 'badge', text: `Brand: ${product.brand}` });
  if (product.warrantyInformation)
    highlights.push({ icon: 'shield', text: product.warrantyInformation });
  if (product.shippingInformation)
    highlights.push({ icon: 'truck', text: product.shippingInformation });
  if (product.returnPolicy) highlights.push({ icon: 'refresh', text: product.returnPolicy });
  if (product.availabilityStatus)
    highlights.push({ icon: 'check', text: product.availabilityStatus });
  const c = (product.category || '').toLowerCase();
  if (c.includes('phone') || c.includes('mobile')) {
    highlights.push(
      { icon: 'zap', text: 'Fast charging support' },
      { icon: 'network', text: '5G ready' },
      { icon: 'shield', text: 'Gorilla Glass protection' },
    );
  }
  while (highlights.length < 5) {
    highlights.push({ icon: 'check', text: 'Genuine product with bill' });
  }
  return highlights.slice(0, 6);
}

export function getSpecifications(product: Product): { label: string; value: string }[] {
  const specs = specsFor(product.category || '');
  return specs;
}

export function getReviews(product: Product, count = 8): Review[] {
  const rand = mulberry32(hashSeed(product.id + '-reviews'));
  const base = Number(product.rating) || 4;
  const positiveWeight = Math.min(0.9, Math.max(0.4, base / 5));
  const authors: string[] = [];
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];

  const reviews: Review[] = [];
  for (let i = 0; i < count; i++) {
    let author = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    let guard = 0;
    while (authors.includes(author) && guard++ < 20) {
      author = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    }
    authors.push(author);

    const isPositive = rand() < positiveWeight;
    const jitter = Math.floor(rand() * 2);
    const rating = isPositive
      ? Math.min(5, base >= 4.6 ? 5 : Math.round(base + 0.5))
      : isPositive === false && rand() < 0.7
        ? 3 + jitter
        : 1 + jitter;
    const clamped = Math.max(1, Math.min(5, rating));

    reviews.push({
      id: `${product.id}-r${i}`,
      author,
      rating: clamped,
      title: pick(
        isPositive
          ? REVIEW_TITLES.positive
          : clamped >= 3
            ? REVIEW_TITLES.neutral
            : REVIEW_TITLES.negative,
      ),
      comment: pick(
        isPositive
          ? REVIEW_BODIES.positive
          : clamped >= 3
            ? REVIEW_BODIES.neutral
            : REVIEW_BODIES.negative,
      ),
      date: new Date(Date.now() - (i + 1) * 7 * 86400000).toISOString(),
      verified: rand() > 0.25,
      helpful: Math.floor(rand() * 180) + 5,
    });
  }
  return reviews.sort((a, b) => b.rating - a.rating);
}

export function getReviewBreakdown(product: Product): ReviewBreakdown[] {
  const base = Number(product.rating) || 4;
  const five = Math.min(0.86, Math.max(0.4, base / 5 + 0.08));
  const one = Math.min(0.1, 1 - base / 5 - 0.02);
  const four = 0.14;
  const three = 0.05;
  const two = 1 - five - four - three - one;
  const rows = [5, 4, 3, 2, 1].map((rating) => {
    const pct =
      rating === 5 ? five : rating === 4 ? four : rating === 3 ? three : rating === 2 ? two : one;
    return { rating, percentage: Math.round(pct * 100) };
  });
  return rows;
}

export function getFaqs(product: Product): Faq[] {
  return categoryFaqs(product.category || '').map((f, i) => ({
    id: `${product.id}-faq${i}`,
    ...f,
  }));
}

export function getMostMentioned(
  product: Product,
): { label: string; count: number; positive: boolean }[] {
  const c = (product.category || '').toLowerCase();
  const mentions = [
    { label: 'Battery', positive: true },
    { label: 'Camera', positive: true },
    { label: 'Performance', positive: true },
    { label: 'Value for money', positive: true },
  ];
  if (c.includes('phone') || c.includes('mobile'))
    mentions.push({ label: 'Heating', positive: false });
  else mentions.push({ label: 'Quality', positive: true });
  const rand = mulberry32(hashSeed(product.id + '-mentions'));
  return mentions.map((m) => ({ ...m, count: 40 + Math.floor(rand() * 160) }));
}

export function getDeliveryPromise(product: Product): { label: string; date: Date } {
  const days = 1 + (Math.abs(hashSeed(product.id)) % 3);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return {
    label:
      days === 1
        ? 'Free delivery by tomorrow'
        : `Free delivery by ${date.toLocaleDateString('en-IN', { weekday: 'long' })}`,
    date,
  };
}

export function getPriceHistory(): { day: string; price: number }[] {
  const today = Date.now();
  return Array.from({ length: 7 }).map((_, i) => ({
    day: new Date(today - (6 - i) * 86400000).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    }),
    price: 100,
  }));
}
