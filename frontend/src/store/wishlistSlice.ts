import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const WISHLIST_KEY = 'ratnika_wishlist';

export interface WishlistEntry {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  mrp: number;
}

function load(): WishlistEntry[] {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as WishlistEntry[]) : [];
  } catch {
    return [];
  }
}

interface WishlistState {
  items: WishlistEntry[];
}

const initialState: WishlistState = { items: load() };

function persist(state: WishlistState) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.items));
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist(state, action: PayloadAction<WishlistEntry>) {
      const idx = state.items.findIndex((it) => it.productId === action.payload.productId);
      if (idx >= 0) state.items.splice(idx, 1);
      else state.items.unshift(action.payload);
      persist(state);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((it) => it.productId !== action.payload);
      persist(state);
    },
    clearWishlist(state) {
      state.items = [];
      persist(state);
    },
  },
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
