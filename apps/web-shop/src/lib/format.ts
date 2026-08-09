import { toPrice } from './utils';

export type Currency = 'INR' | 'USD';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat('en-IN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

export function formatPrice(value: unknown, currency: Currency = 'INR'): string {
  if (currency === 'USD') {
    return `$${toPrice(value).toFixed(2)}`;
  }
  return currencyFormatter.format(toPrice(value));
}

export function formatCompact(value: unknown): string {
  return compactFormatter.format(toPrice(value));
}

export function formatNumber(value: unknown): string {
  return new Intl.NumberFormat('en-IN').format(toPrice(value));
}

export function discountPercent(price: unknown, mrp: unknown): number {
  const p = toPrice(price);
  const m = toPrice(mrp);
  if (p <= 0 || m <= 0 || m <= p) return 0;
  return Math.round(((m - p) / m) * 100);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Convert kebab/camel-cased strings to Title Case */
export function toTitleCase(value: string): string {
  return value.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
