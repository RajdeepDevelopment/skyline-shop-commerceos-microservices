import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { Product } from '../types/product.types';
import { productService } from '../services/product.service';
import { useRecentlyViewedStore } from '../stores/recently-viewed.store';

export function useDeals(limit = 12) {
  return useQuery({
    queryKey: ['discovery', 'deals', limit],
    queryFn: () => productService.getDeals(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTrending(limit = 12, category?: string) {
  return useQuery({
    queryKey: ['discovery', 'trending', category, limit],
    queryFn: () => productService.getTrending(limit, category),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBestSellers(limit = 12, category?: string) {
  return useQuery({
    queryKey: ['discovery', 'best-sellers', category, limit],
    queryFn: () => productService.getBestSellers(limit, category),
    staleTime: 5 * 60 * 1000,
  });
}

export function useNewArrivals(limit = 12) {
  return useQuery({
    queryKey: ['products', 'new', limit],
    queryFn: () => productService.getNewArrivals(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useBrands(limit = 12) {
  return useQuery({
    queryKey: ['products', 'brands', limit],
    queryFn: () => productService.getBrands(limit),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useSimilar(product?: Product | null, limit = 8) {
  return useQuery({
    queryKey: ['products', 'similar', product?.id, limit],
    queryFn: () => productService.getSimilar(product!, limit),
    enabled: !!product?.id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBundleCandidates(product?: Product | null, limit = 4) {
  return useQuery({
    queryKey: ['products', 'bundle', product?.id, limit],
    queryFn: () => productService.getBundleCandidates(product!, limit),
    enabled: !!product?.id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRecentlyViewedProducts(limit = 12) {
  const localIds = useRecentlyViewedStore((s) => s.ids);
  const setIds = useRecentlyViewedStore((s) => s.setIds);
  return useQuery({
    queryKey: ['user', 'recent-products', limit],
    queryFn: async (): Promise<Product[]> => {
      const server = await productService.getUserRecentProducts(limit).catch(() => [] as Product[]);
      if (server.length > 0) {
        setIds(server.map((p) => p.id));
        return server;
      }
      if (localIds.length === 0) return [];
      return productService.getByIds(localIds.slice(0, limit), limit);
    },
    staleTime: 60 * 1000,
  });
}

export function useRecommended(currentCategory?: string, excludeIds: string[] = [], limit = 12) {
  const fallbackCategories = useMemo(
    () => (currentCategory ? [currentCategory] : []),
    [currentCategory],
  );
  return useQuery({
    queryKey: ['recommendations', limit],
    queryFn: async (): Promise<Product[]> => {
      const recs = await productService.getRecommendations(limit).catch(() => [] as Product[]);
      if (recs.length > 0) return recs;
      return productService.getRecommended(fallbackCategories, excludeIds, limit);
    },
    staleTime: 5 * 60 * 1000,
  });
}
