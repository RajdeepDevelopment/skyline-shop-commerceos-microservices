import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareStore {
  ids: string[];
  add: (productId: string) => boolean;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
}

export const MAX_COMPARE = 4;

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      ids: [],

      add: (productId) => {
        const ids = get().ids;
        if (ids.includes(productId)) return true;
        if (ids.length >= MAX_COMPARE) return false;
        set({ ids: [...ids, productId] });
        return true;
      },

      remove: (productId) => {
        set({ ids: get().ids.filter((id) => id !== productId) });
      },

      clear: () => set({ ids: [] }),

      has: (productId) => get().ids.includes(productId),
    }),
    {
      name: 'skyline-compare',
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
);
