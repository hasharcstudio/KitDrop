"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  kitId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
  type: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (kitId: string, size: string) => void;
  updateQuantity: (kitId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const { items } = get();
        const existing = items.find(
          (i) => i.kitId === item.kitId && i.size === item.size
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.kitId === item.kitId && i.size === item.size
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
        set({ isOpen: true });
      },
      removeItem: (kitId, size) => {
        set({
          items: get().items.filter(
            (i) => !(i.kitId === kitId && i.size === size)
          ),
        });
      },
      updateQuantity: (kitId, size, quantity) => {
        if (quantity <= 0) {
          get().removeItem(kitId, size);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.kitId === kitId && i.size === size ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "kitdrop-cart" }
  )
);
