import { create } from 'zustand';
import { ProductState, Product, ProductFilter } from '../types/product.types';
import { productService } from '../services/product.service';

interface ProductStore extends ProductState {
  total: number;
  totalPages: number;
  currentPage: number;
  fetchProducts: (filter?: ProductFilter) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  searchProducts: (query: string, filter?: ProductFilter) => Promise<void>;
  setFilter: (filter: ProductFilter) => void;
  setPage: (page: number) => void;
  setSelectedProduct: (product: Product | null) => void;
  clearError: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  categories: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filters: {},
  total: 0,
  totalPages: 1,
  currentPage: 1,

  fetchProducts: async (filter?: ProductFilter) => {
    set({ isLoading: true, error: null });
    try {
      const activeFilter = filter || get().filters;
      const response = await productService.getProducts(activeFilter);
      const products = response?.products || [];
      set({
        products,
        total: response?.total || 0,
        totalPages: response?.totalPages || 1,
        currentPage: response?.page || 1,
        filters: activeFilter,
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
      set({ selectedProduct: product, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch product',
        isLoading: false,
      });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await productService.getCategories();
      set({ categories });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      });
    }
  },

  searchProducts: async (query: string, filter?: ProductFilter) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.searchProducts(query, filter);
      const products = response?.products || [];
      set({
        products,
        total: response?.total || 0,
        totalPages: response?.totalPages || 1,
        currentPage: response?.page || 1,
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

  setPage: (page: number) => {
    const filters = get().filters;
    void get().fetchProducts({ ...filters, page });
  },

  setSelectedProduct: (product: Product | null) => set({ selectedProduct: product }),
  clearError: () => set({ error: null }),
}));
