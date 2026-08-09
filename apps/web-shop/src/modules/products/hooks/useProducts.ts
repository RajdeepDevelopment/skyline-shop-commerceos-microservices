import { useMutation, useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { Product, ProductFilter, ProductResponse } from '../types/product.types';

export const useProducts = (filter: ProductFilter = {}) => {
  return useQuery<ProductResponse, Error>({
    queryKey: ['products', filter],
    queryFn: () => productService.getProducts(filter),
  });
};

export const useProduct = (id: string) => {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery<string[], Error>({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
  });
};

export const useSearchProducts = () => {
  return useMutation<ProductResponse, Error, { query: string; filter?: ProductFilter }>({
    mutationFn: ({ query, filter }) => productService.searchProducts(query, filter),
  });
};
