import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Derived selectors
export const useCartCount = () =>
  useAppSelector((s) => s.cart.items.reduce((n, it) => n + it.quantity, 0));

export const useCartSubtotal = () =>
  useAppSelector((s) => s.cart.items.reduce((sum, it) => sum + it.price * it.quantity, 0));

export const useWishlistCount = () => useAppSelector((s) => s.wishlist.items.length);

export const useIsWishlisted = (productId: string) =>
  useAppSelector((s) => s.wishlist.items.some((it) => it.productId === productId));
