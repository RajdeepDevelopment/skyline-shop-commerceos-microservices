import { create } from 'zustand';
import { CartState } from '../types/cart.types';
import { cartService } from '../services/cart.service';

interface CartStore extends CartState {
  fetchCart: (userId: string) => Promise<void>;
  addToCart: (userId: string, productId: string, quantity: number) => Promise<void>;
  updateQuantity: (userId: string, itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (userId: string, itemId: string) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  clearError: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  totalAmount: 0,
  isLoading: false,
  error: null,

  fetchCart: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.getCart(userId);
      set({
        items: cart.items,
        totalAmount: cart.totalAmount,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch cart',
        isLoading: false,
      });
    }
  },

  addToCart: async (userId: string, productId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.addToCart(userId, { productId, quantity });
      set({
        items: cart.items,
        totalAmount: cart.totalAmount,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to add to cart',
        isLoading: false,
      });
    }
  },

  updateQuantity: async (userId: string, itemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.updateCartItem(userId, { itemId, quantity });
      set({
        items: cart.items,
        totalAmount: cart.totalAmount,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update cart',
        isLoading: false,
      });
    }
  },

  removeFromCart: async (userId: string, itemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.removeFromCart(userId, itemId);
      set({
        items: cart.items,
        totalAmount: cart.totalAmount,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to remove from cart',
        isLoading: false,
      });
    }
  },

  clearCart: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await cartService.clearCart(userId);
      set({
        items: [],
        totalAmount: 0,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to clear cart',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
