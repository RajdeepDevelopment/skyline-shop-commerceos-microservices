import { apiClient } from '../../../lib/axios';
import { Order } from '../types/order.types';

export interface CreateOrderRequest {
  items: { productId: string; quantity: number; price: number }[];
  shippingAddress: string;
  paymentMethod?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  status: string;
  totalAmount: number;
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const { data } = await apiClient.get('/api/v1/orders');
    return data.orders || data;
  },

  async getOrder(orderId: string): Promise<Order> {
    const { data } = await apiClient.get(`/api/v1/orders/${orderId}`);
    return data;
  },

  async createOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const { data } = await apiClient.post<CreateOrderResponse>('/api/v1/orders', request);
    return data;
  },
};
