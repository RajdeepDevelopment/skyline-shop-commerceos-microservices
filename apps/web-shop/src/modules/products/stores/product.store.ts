import { create } from 'zustand';
import { ProductState, Product, ProductFilter } from '../types/product.types';
import { productService } from '../services/product.service';

interface ProductStore extends ProductState {
  fetchProducts: (filter?: ProductFilter) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (query: string, filter?: ProductFilter) => Promise<void>;
  setFilter: (filter: ProductFilter) => void;
  setSelectedProduct: (product: Product | null) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filters: {},

  fetchProducts: async (filter?: ProductFilter) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getProducts(filter);

      // Safety check: if response or response.products is missing, default to empty array
      const products = response?.products || [];

      set({
        products: products,
        filters: filter || {},
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        isLoading: false,
      });
    }
  },

  fetchProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const product = await productService.getProduct(id);
      set({
        selectedProduct: product,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        isLoading: false,
      });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const categories = await productService.getCategories();
      set({
        categories,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  searchProducts: async (query: string, filter?: ProductFilter) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.searchProducts(query, filter);

      // Safety check: if response or response.products is missing, default to empty array
      const products = response?.products || [];

      set({
        products: products,
        filters: { ...filter, search: query },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to search products',
        isLoading: false,
      });
    }
  },

  setFilter: (filter: ProductFilter) => set({ filters: filter }),

  setSelectedProduct: (product: Product | null) => set({ selectedProduct: product }),

  clearError: () => set({ error: null }),
}));
