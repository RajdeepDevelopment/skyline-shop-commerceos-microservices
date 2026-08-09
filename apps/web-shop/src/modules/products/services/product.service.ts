import {
  Product,
  ProductFilter,
  ProductResponse,
  Review,
  ReviewResponse,
  ReviewSummary,
  ReviewSort,
} from '../types/product.types';
import { apiClient } from '../../../lib/axios';

export interface SuggestResult {
  suggestions: string[];
}

export interface AvailabilityResult {
  available: boolean;
  warehouse?: string;
  delivery?: { days: number; expected: string; deliveryDate: string };
  quantityAvailable: boolean;
}

export interface PopularSearch {
  query: string;
  count: number;
}

export class ProductService {
  async getProducts(filter: ProductFilter = {}): Promise<ProductResponse> {
    const params = new URLSearchParams();

    if (filter.category) params.append('category', filter.category);
    if (filter.minPrice) params.append('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params.append('maxPrice', filter.maxPrice.toString());
    if (filter.minRating) params.append('rating', filter.minRating.toString());
    if (filter.inStock) params.append('instock', 'true');
    if (filter.search) params.append('search', filter.search);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    if (filter.sortOrder) params.append('sortOrder', filter.sortOrder);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.limit) params.append('limit', filter.limit.toString());

    const response = await apiClient.get<ProductResponse>(`/api/v1/products?${params.toString()}`);
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`/api/v1/products/${id}`);
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/api/v1/products/categories');
    return response.data;
  }

  async getByIds(ids: string[], limit = 12): Promise<Product[]> {
    const unique = [...new Set(ids)].slice(0, limit);
    if (unique.length === 0) return [];

    try {
      const response = await apiClient.get<Product[]>('/api/v1/products/by-ids', {
        params: { ids: unique.join(',') },
      });
      if (Array.isArray(response.data) && response.data.length > 0) return response.data;
    } catch {
      // fall through to per-id fetching
    }

    const settled = await Promise.allSettled(unique.map((id) => this.getProduct(id)));
    return settled
      .filter(
        (r): r is PromiseFulfilledResult<Product> => r.status === 'fulfilled' && !!r.value?.id,
      )
      .map((r) => r.value);
  }

  searchProducts(query: string, filter: ProductFilter = {}): Promise<ProductResponse> {
    return this.getProducts({ ...filter, search: query });
  }

  async getSuggestions(query: string, limit = 8): Promise<SuggestResult> {
    const response = await apiClient.get<SuggestResult>('/api/v1/products/suggest', {
      params: { q: query, limit },
    });
    return response.data;
  }

  async getRecentSearches(limit = 8): Promise<string[]> {
    const response = await apiClient.get<string[]>('/api/v1/products/recent', {
      params: { limit },
    });
    return response.data;
  }

  async getPopularSearches(limit = 8): Promise<PopularSearch[]> {
    const response = await apiClient.get<PopularSearch[]>('/api/v1/products/popular', {
      params: { limit },
    });
    return response.data;
  }

  async trackSearch(query: string): Promise<void> {
    await apiClient.post('/api/v1/products/track-search', { query });
  }

  /** Ranked deals — served by the ranking engine (frontend never ranks). */
  async getDeals(limit = 12): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/api/v1/discovery/deals', {
      params: { limit },
    });
    return response.data;
  }

  /** Ranked trending products — served by the ranking engine. */
  async getTrending(limit = 12, category?: string): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/api/v1/discovery/trending', {
      params: { category, limit },
    });
    return response.data;
  }

  /** Ranked best sellers — served by the ranking engine. */
  async getBestSellers(limit = 12, category?: string): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/api/v1/discovery/best-sellers', {
      params: { category, limit },
    });
    return response.data;
  }

  /** Personalized recommendations for the current user. */
  async getRecommendations(limit = 12): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/api/v1/recommendations', {
      params: { limit },
    });
    return response.data;
  }

  /** Recently viewed products for the current user (server-tracked). */
  async getUserRecentProducts(limit = 12): Promise<Product[]> {
    const response = await apiClient.get<Product[]>('/api/v1/user/recent-products', {
      params: { limit },
    });
    return response.data;
  }

  /** Track a product view (fire-and-forget, server-side). */
  async trackView(productId: string): Promise<void> {
    try {
      await apiClient.post(`/api/v1/products/${productId}/view`);
    } catch {
      // best-effort tracking
    }
  }

  /** Newest arrivals. */
  async getNewArrivals(limit = 12): Promise<Product[]> {
    const res = await this.getProducts({ page: 1, limit, sortBy: 'createdAt', sortOrder: 'desc' });
    return res.products;
  }

  async getBrands(limit = 12): Promise<string[]> {
    const res = await this.getProducts({
      page: 1,
      limit: 100,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    const brands = [
      ...new Set(res.products.map((p) => p.brand).filter((b): b is string => !!b)),
    ].slice(0, limit);
    return brands;
  }

  /** Similar products (OpenSearch similarity via product-service). */
  async getSimilar(product: Product, limit = 8): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`/api/v1/products/${product.id}/similar`, {
      params: { limit },
    });
    return response.data;
  }

  /** Frequently bought together (co-purchase analysis via ranking engine). */
  async getBundleCandidates(product: Product, limit = 4): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `/api/v1/products/${product.id}/frequently-bought`,
    );
    return response.data.slice(0, limit);
  }

  /** Recommended products based on recently viewed categories. */
  async getRecommended(
    recentCategories: string[],
    excludeIds: string[] = [],
    limit = 12,
  ): Promise<Product[]> {
    const cat = recentCategories.find(Boolean);
    if (cat) {
      const res = await this.getProducts({ page: 1, limit: 60, category: cat });
      const pool = res.products.filter((p) => !excludeIds.includes(p.id) && p.inStock);
      if (pool.length >= limit) return pool.slice(0, limit);
      const rest = await this.getProducts({
        page: 1,
        limit: 100,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      return [
        ...pool,
        ...rest.products.filter((p) => !excludeIds.includes(p.id) && p.inStock),
      ].slice(0, limit);
    }
    const res = await this.getProducts({
      page: 1,
      limit: 100,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    return res.products.filter((p) => !excludeIds.includes(p.id) && p.inStock).slice(0, limit);
  }

  async getReviews(
    productId: string,
    opts: { rating?: number; sort?: ReviewSort; page?: number; limit?: number } = {},
  ): Promise<ReviewResponse> {
    const response = await apiClient.get<ReviewResponse>(`/api/v1/products/${productId}/reviews`, {
      params: opts,
    });
    return response.data;
  }

  async getReviewSummary(productId: string): Promise<ReviewSummary> {
    const response = await apiClient.get<ReviewSummary>(
      `/api/v1/products/${productId}/reviews/summary`,
    );
    return response.data;
  }

  async createReview(
    productId: string,
    input: { rating: number; title?: string; comment?: string; reviewerName?: string },
  ): Promise<Review> {
    const response = await apiClient.post<Review>(`/api/v1/products/${productId}/reviews`, input);
    return response.data;
  }

  async markReviewHelpful(
    productId: string,
    reviewId: string,
  ): Promise<{ helpful: boolean; alreadyVoted: boolean }> {
    const response = await apiClient.post<{ helpful: boolean; alreadyVoted: boolean }>(
      `/api/v1/products/${productId}/reviews/${reviewId}/helpful`,
    );
    return response.data;
  }

  async checkAvailability(sku: string, pincode: string, quantity = 1): Promise<AvailabilityResult> {
    const response = await apiClient.get<AvailabilityResult>(
      `/api/v1/products/${encodeURIComponent(sku)}/availability`,
      { params: { pincode, quantity } },
    );
    return response.data;
  }
}

export const productService = new ProductService();
