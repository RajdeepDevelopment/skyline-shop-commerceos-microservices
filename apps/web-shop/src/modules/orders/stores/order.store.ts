import { create } from 'zustand';
import { OrderState } from '../types/order.types';
import { orderService, CreateOrderRequest, CreateOrderResponse } from '../services/order.service';

interface OrderStore extends OrderState {
  lastOrder: CreateOrderResponse | null;
  fetchOrders: () => Promise<void>;
  fetchOrder: (orderId: string) => Promise<void>;
  createOrder: (request: CreateOrderRequest) => Promise<CreateOrderResponse>;
  clearError: () => void;
}

function getErrorMessage(error: unknown, fallback: string): string {
  const response = (
    error as { response?: { status?: number; data?: { message?: string | string[] } } }
  ).response;
  const message = response?.data?.message;
  const text = Array.isArray(message) ? message.join(', ') : message;
  if (response?.status === 404) return 'Order not found';
  return text || (error instanceof Error ? error.message : fallback);
}

export const useOrderStore = create<OrderStore>()((set) => ({
  orders: [],
  selectedOrder: null,
  lastOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await orderService.getOrders();
      set({ orders, isLoading: false });
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Failed to fetch orders'),
        isLoading: false,
      });
    }
  },

  fetchOrder: async (orderId: string) => {
    set({ isLoading: true, error: null });
    try {
      const order = await orderService.getOrder(orderId);
      set({ selectedOrder: order, isLoading: false });
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Failed to fetch order'),
        isLoading: false,
      });
    }
  },

  createOrder: async (request: CreateOrderRequest) => {
    set({ isLoading: true, error: null });
    try {
      const result = await orderService.createOrder(request);
      set({ lastOrder: result, isLoading: false });
      return result;
    } catch (error) {
      set({
        error: getErrorMessage(error, 'Failed to create order'),
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
