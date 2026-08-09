import { apiClient } from './axios';

export type BehaviourEventType =
  | 'PRODUCT_VIEW'
  | 'SEARCH'
  | 'SEARCH_CLICK'
  | 'PRODUCT_CLICK'
  | 'ADD_TO_CART'
  | 'REMOVE_FROM_CART'
  | 'WISHLIST_ADD'
  | 'PURCHASE'
  | 'PRODUCT_SHARE'
  | 'REVIEW_CREATED'
  | 'RETURN_PRODUCT'
  | 'IMPRESSION';

export interface TrackEventOptions {
  productId?: string;
  category?: string;
  quantity?: number;
  payload?: Record<string, unknown>;
}

/**
 * Fire-and-forget behaviour event tracker. Never blocks the UI and never
 * throws — tracking is best-effort by design.
 */
export function trackEvent(eventType: BehaviourEventType, opts: TrackEventOptions = {}): void {
  try {
    apiClient.post('/api/v1/events', { eventType, ...opts }).catch(() => {});
  } catch {
    // noop
  }
}

export function trackProductView(productId: string, category?: string): void {
  trackEvent('PRODUCT_VIEW', { productId, category });
}

export function trackProductClick(productId: string, category?: string): void {
  trackEvent('PRODUCT_CLICK', { productId, category });
}

export function trackAddToCart(productId: string, quantity = 1): void {
  trackEvent('ADD_TO_CART', { productId, quantity });
}

export function trackSearch(query: string): void {
  trackEvent('SEARCH', { payload: { query } });
}

export function trackSearchClick(productId: string, query?: string): void {
  trackEvent('SEARCH_CLICK', { productId, payload: query ? { query } : undefined });
}

export function trackWishlist(productId: string): void {
  trackEvent('WISHLIST_ADD', { productId });
}

export function trackImpression(productIds: string[]): void {
  if (productIds.length === 0) return;
  for (const productId of productIds.slice(0, 50)) {
    trackEvent('IMPRESSION', { productId });
  }
}
