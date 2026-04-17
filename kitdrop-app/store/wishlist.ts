import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  items: string[]; // Store kit IDs
  addItem: (id: string) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  hasItem: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (id) => set((state) => ({ items: [...new Set([...state.items, id])] })),
      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i !== id) })),
      toggleItem: (id) => {
        const { items, addItem, removeItem } = get();
        if (items.includes(id)) {
          removeItem(id);
        } else {
          addItem(id);
        }
      },
      hasItem: (id) => get().items.includes(id),
    }),
    {
      name: 'kitdrop-wishlist-storage', // unique name
    }
  )
);
