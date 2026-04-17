import { Kit } from '@/data/kits';
import { create } from 'zustand';

interface UIState {
  isMiniCartOpen: boolean;
  isSizeGuideOpen: boolean;
  isQuickViewOpen: boolean;
  isSearchOpen: boolean;
  activeQuickViewKit: Kit | null;
  toggleMiniCart: () => void;
  toggleSizeGuide: () => void;
  toggleSearch: () => void;
  openQuickView: (kit: Kit) => void;
  closeQuickView: () => void;
  closeAll: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMiniCartOpen: false,
  isSizeGuideOpen: false,
  isQuickViewOpen: false,
  isSearchOpen: false,
  activeQuickViewKit: null,
  
  toggleMiniCart: () => set((state) => ({ isMiniCartOpen: !state.isMiniCartOpen, isSizeGuideOpen: false, isSearchOpen: false })),
  toggleSizeGuide: () => set((state) => ({ isSizeGuideOpen: !state.isSizeGuideOpen, isMiniCartOpen: false, isSearchOpen: false })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen, isMiniCartOpen: false, isSizeGuideOpen: false })),
  
  openQuickView: (kit) => set({ isQuickViewOpen: true, activeQuickViewKit: kit }),
  closeQuickView: () => set({ isQuickViewOpen: false, activeQuickViewKit: null }),
  
  closeAll: () => set({ isMiniCartOpen: false, isSizeGuideOpen: false, isQuickViewOpen: false, isSearchOpen: false, activeQuickViewKit: null })
}));
