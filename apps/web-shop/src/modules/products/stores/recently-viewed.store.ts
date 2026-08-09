import { create } from 'zustand';
import { productService } from '../services/product.service';

interface RecentlyViewedStore {
  ids: string[];
  track: (productId: string) => void;
  setIds: (ids: string[]) => void;
}

const MAX = 20;

export const useRecentlyViewedStore = create<RecentlyViewedStore>()((set, get) => ({
  ids: [],
  track: (productId) => {
    if (!productId) return;
    // Server is the source of truth; update locally for instant feedback.
    productService.trackView(productId).catch(() => {});
    const next = [productId, ...get().ids.filter((id) => id !== productId)].slice(0, MAX);
    set({ ids: next });
  },
  setIds: (ids) => set({ ids: ids.slice(0, MAX) }),
}));
