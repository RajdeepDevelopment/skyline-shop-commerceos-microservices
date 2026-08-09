import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistItem } from '../types/wishlist.types';

interface WishlistStore {
  items: WishlistItem[];
  toggle: (productId: string) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (productId) => {
        const exists = get().items.some((i) => i.productId === productId);
        if (exists) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
        } else {
          set({ items: [{ productId, addedAt: new Date().toISOString() }, ...get().items] });
        }
      },

      add: (productId) => {
        if (get().items.some((i) => i.productId === productId)) return;
        set({ items: [{ productId, addedAt: new Date().toISOString() }, ...get().items] });
      },

      remove: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) });
      },

      clear: () => set({ items: [] }),

      isWishlisted: (productId) => get().items.some((i) => i.productId === productId),
    }),
    {
      name: 'skyline-wishlist',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
