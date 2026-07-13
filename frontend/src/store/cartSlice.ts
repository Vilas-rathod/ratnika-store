import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '@/types';

const CART_KEY = 'ratnika_cart';
const SAVED_KEY = 'ratnika_saved';

function load(key: string): CartItem[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

interface CartState {
  items: CartItem[];
  savedForLater: CartItem[];
}

const initialState: CartState = {
  items: load(CART_KEY),
  savedForLater: load(SAVED_KEY),
};

function persist(state: CartState) {
  localStorage.setItem(CART_KEY, JSON.stringify(state.items));
  localStorage.setItem(SAVED_KEY, JSON.stringify(state.savedForLater));
}

function keyOf(item: Pick<CartItem, 'productId' | 'variantId'>) {
  return `${item.productId}::${item.variantId ?? ''}`;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const incoming = action.payload;
      const existing = state.items.find((it) => keyOf(it) === keyOf(incoming));
      if (existing) {
        existing.quantity = Math.min(existing.stock, existing.quantity + incoming.quantity);
      } else {
        state.items.push({ ...incoming, quantity: Math.min(incoming.stock, incoming.quantity) });
      }
      persist(state);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: string; variantId?: string; quantity: number }>,
    ) {
      const item = state.items.find((it) => keyOf(it) === keyOf(action.payload));
      if (item) {
        item.quantity = Math.max(1, Math.min(item.stock, action.payload.quantity));
        persist(state);
      }
    },
    removeFromCart(state, action: PayloadAction<{ productId: string; variantId?: string }>) {
      state.items = state.items.filter((it) => keyOf(it) !== keyOf(action.payload));
      persist(state);
    },
    saveForLater(state, action: PayloadAction<{ productId: string; variantId?: string }>) {
      const idx = state.items.findIndex((it) => keyOf(it) === keyOf(action.payload));
      if (idx >= 0) {
        const [item] = state.items.splice(idx, 1);
        if (!state.savedForLater.some((s) => keyOf(s) === keyOf(item)))
          state.savedForLater.push(item);
        persist(state);
      }
    },
    moveToCart(state, action: PayloadAction<{ productId: string; variantId?: string }>) {
      const idx = state.savedForLater.findIndex((it) => keyOf(it) === keyOf(action.payload));
      if (idx >= 0) {
        const [item] = state.savedForLater.splice(idx, 1);
        const existing = state.items.find((it) => keyOf(it) === keyOf(item));
        if (existing) existing.quantity = Math.min(existing.stock, existing.quantity + item.quantity);
        else state.items.push(item);
        persist(state);
      }
    },
    removeSaved(state, action: PayloadAction<{ productId: string; variantId?: string }>) {
      state.savedForLater = state.savedForLater.filter(
        (it) => keyOf(it) !== keyOf(action.payload),
      );
      persist(state);
    },
    clearCart(state) {
      state.items = [];
      persist(state);
    },
  },
});

export const {
  addToCart,
  updateQuantity,
  removeFromCart,
  saveForLater,
  moveToCart,
  removeSaved,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
