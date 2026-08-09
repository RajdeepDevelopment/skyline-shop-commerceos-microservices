import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartState } from '../types/cart.types';
import { cartService } from '../services/cart.service';
import { getUserId } from '../../../lib/user-id';
import { throttle } from '../../../lib/utils';

interface CartStore extends CartState {
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  clearError: () => void;
}

// Throttled API calls to prevent rapid-fire requests
const throttledAddToCart = throttle(async (userId: string, productId: string, quantity: number) => {
  return cartService.addToCart(userId, { productId, quantity });
}, 500);

const throttledUpdateQuantity = throttle(
  async (userId: string, itemId: string, quantity: number) => {
    return cartService.updateCartItem(userId, { itemId, quantity });
  },
  300,
);

const throttledRemoveFromCart = throttle(async (userId: string, itemId: string) => {
  return cartService.removeFromCart(userId, itemId);
}, 300);

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      subtotal: 0,
      discount: 0,
      totalAmount: 0,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const userId = getUserId();
          const cart = await cartService.getCart(userId);
          set({
            items: cart.items,
            subtotal: cart.subtotal,
            discount: cart.discount,
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

      addToCart: async (productId: string, quantity: number) => {
        set({ error: null });
        try {
          const userId = getUserId();
          const cart = await throttledAddToCart(userId, productId, quantity);
          set({
            items: cart.items,
            subtotal: cart.subtotal,
            discount: cart.discount,
            totalAmount: cart.totalAmount,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add to cart',
          });
        }
      },

      updateQuantity: async (itemId: string, quantity: number) => {
        set({ error: null });
        try {
          const userId = getUserId();
          const cart = await throttledUpdateQuantity(userId, itemId, quantity);
          set({
            items: cart.items,
            subtotal: cart.subtotal,
            discount: cart.discount,
            totalAmount: cart.totalAmount,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update cart',
          });
        }
      },

      removeFromCart: async (itemId: string) => {
        set({ error: null });
        try {
          const userId = getUserId();
          const cart = await throttledRemoveFromCart(userId, itemId);
          set({
            items: cart.items,
            subtotal: cart.subtotal,
            discount: cart.discount,
            totalAmount: cart.totalAmount,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to remove from cart',
          });
        }
      },

      clearCart: async () => {
        set({ error: null });
        try {
          const userId = getUserId();
          await cartService.clearCart(userId);
          set({
            items: [],
            subtotal: 0,
            discount: 0,
            totalAmount: 0,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to clear cart',
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({
        items: state.items,
        subtotal: state.subtotal,
        discount: state.discount,
        totalAmount: state.totalAmount,
      }),
    },
  ),
);
