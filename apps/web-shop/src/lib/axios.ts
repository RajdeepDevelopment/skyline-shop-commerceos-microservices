import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// All requests go through the API Gateway
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create axios instance with default configuration
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Attach a stable anonymous identity + session id so the backend can track
  // behaviour (recently viewed, recommendations) even for logged-out users.
  instance.interceptors.request.use((config) => {
    try {
      let guestId = localStorage.getItem('skyline-guest-id');
      if (!guestId) {
        guestId = `guest-${crypto.randomUUID()}`;
        localStorage.setItem('skyline-guest-id', guestId);
      }
      config.headers['x-anonymous-id'] = guestId;
      let sessionId = sessionStorage.getItem('skyline-session-id');
      if (!sessionId) {
        sessionId = `session-${crypto.randomUUID()}`;
        sessionStorage.setItem('skyline-session-id', sessionId);
      }
      config.headers['x-session-id'] = sessionId;
    } catch {
      // ignore storage errors
    }
    return config;
  });

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
      // Handle network errors
      if (!error.response) {
        error.message = 'Network error. Please check your connection.';
      }

      return Promise.reject(error);
    },
  );

  return instance;
};

// Single API client - all requests go through the gateway
export const apiClient = createAxiosInstance(API_BASE_URL);

// Service-specific clients all route through the gateway
export const authClient = apiClient;
export const cartClient = apiClient;
export const productClient = apiClient;
export const inventoryClient = apiClient;
export const orderClient = apiClient;
export const paymentClient = apiClient;

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
