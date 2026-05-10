import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API base URLs for different services
const API_BASE_URLS = {
  default: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',

  auth: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001',

  cart: import.meta.env.VITE_CART_SERVICE_URL || 'http://localhost:3002',

  product: import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:3003',

  inventory: import.meta.env.VITE_INVENTORY_SERVICE_URL || 'http://localhost:3004',

  order: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:3006',

  payment: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:3007',
};

// Create axios instance with default configuration
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      return Promise.reject(error);
    },
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // For 304 Not Modified, the response data might be empty depending on the browser/cache implementation.
      // We should ensure we return a structure that the application expects if data is missing.

      if (response.status === 304 && (!response.data || Object.keys(response.data).length === 0)) {
        console.warn('Received 304 Not Modified with empty data. Check browser cache behavior.');
      }
      return response;
    },
    (error: AxiosError) => {
      // Handle common error scenarios
      if (error.response?.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      // Handle network errors
      if (!error.response) {
        error.message = 'Network error. Please check your connection.';
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

// Create instances for different services
export const apiClient = createAxiosInstance(API_BASE_URLS.default);

export const authClient = createAxiosInstance(API_BASE_URLS.auth);

export const cartClient = createAxiosInstance(API_BASE_URLS.cart);

export const productClient = createAxiosInstance(API_BASE_URLS.product);

export const inventoryClient = createAxiosInstance(API_BASE_URLS.inventory);

export const orderClient = createAxiosInstance(API_BASE_URLS.order);

export const paymentClient = createAxiosInstance(API_BASE_URLS.payment);

// Generic API wrapper functions
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => apiClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => apiClient.delete<T>(url, config),
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, data, config),
};

// Service-specific API wrappers
export const authApi = {
  get: <T>(url: string, config?: AxiosRequestConfig) => authClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    authClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    authClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => authClient.delete<T>(url, config),
};

export const cartApi = {
  get: <T>(url: string, config?: AxiosRequestConfig) => cartClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    cartClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    cartClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => cartClient.delete<T>(url, config),
};

export const productApi = {
  get: <T>(url: string, config?: AxiosRequestConfig) => productClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    productClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    productClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => productClient.delete<T>(url, config),
};

export const inventoryApi = {
  get: <T>(url: string, config?: AxiosRequestConfig) => inventoryClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    inventoryClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    inventoryClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => inventoryClient.delete<T>(url, config),
};

export const orderApi = {
  get: <T>(url: string, config?: AxiosRequestConfig) => orderClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    orderClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    orderClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => orderClient.delete<T>(url, config),
};

export const paymentApi = {
  get: <T>(url: string, config?: AxiosRequestConfig) => paymentClient.get<T>(url, config),
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    paymentClient.post<T>(url, data, config),
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
    paymentClient.put<T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) => paymentClient.delete<T>(url, config),
};

export default apiClient;
