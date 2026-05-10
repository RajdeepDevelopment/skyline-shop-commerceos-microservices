import { Product, Category, ProductFilter, ProductResponse } from '../types/product.types';
import { apiClient } from '../../../lib/axios';

export class ProductService {
  async getProducts(filter: ProductFilter = {}): Promise<ProductResponse> {
    const params = new URLSearchParams();

    if (filter.category) params.append('category', filter.category);
    if (filter.minPrice) params.append('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params.append('maxPrice', filter.maxPrice.toString());
    if (filter.inStock !== undefined) params.append('inStock', filter.inStock.toString());
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

  async getCategories(): Promise<Category[]> {
    const response = await apiClient.get<Category[]>('/api/v1/products/categories');
    return response.data;
  }

  async searchProducts(query: string, filter: ProductFilter = {}): Promise<ProductResponse> {
    return this.getProducts({ ...filter, search: query });
  }
}

export const productService = new ProductService();
