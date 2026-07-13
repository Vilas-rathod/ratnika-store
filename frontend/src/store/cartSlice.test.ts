import { beforeEach, describe, expect, it } from 'vitest';
import reducer, {
  addToCart,
  removeFromCart,
  saveForLater,
  updateQuantity,
} from './cartSlice';
import type { CartItem } from '@/types';

const item: CartItem = {
  productId: 'prd_1',
  name: 'Elegant Ring',
  slug: 'elegant-ring',
  imageUrl: '',
  price: 999,
  mrp: 1299,
  quantity: 1,
  stock: 10,
};

const initial = { items: [], savedForLater: [] };

beforeEach(() => localStorage.clear());

describe('cartSlice', () => {
  it('adds an item to the cart', () => {
    const state = reducer(initial, addToCart(item));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].productId).toBe('prd_1');
  });

  it('merges quantity when adding the same item', () => {
    let state = reducer(initial, addToCart(item));
    state = reducer(state, addToCart({ ...item, quantity: 2 }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('caps quantity at available stock', () => {
    let state = reducer(initial, addToCart({ ...item, quantity: 1, stock: 3 }));
    state = reducer(state, updateQuantity({ productId: 'prd_1', quantity: 99 }));
    expect(state.items[0].quantity).toBe(3);
  });

  it('removes an item', () => {
    let state = reducer(initial, addToCart(item));
    state = reducer(state, removeFromCart({ productId: 'prd_1' }));
    expect(state.items).toHaveLength(0);
  });

  it('moves an item to saved-for-later', () => {
    let state = reducer(initial, addToCart(item));
    state = reducer(state, saveForLater({ productId: 'prd_1' }));
    expect(state.items).toHaveLength(0);
    expect(state.savedForLater).toHaveLength(1);
  });
});
