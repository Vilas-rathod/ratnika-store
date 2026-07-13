import { ArrowRight, Minus, Plus, ShoppingCart, Tag, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatINR } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/constants';
import { useAppDispatch, useAppSelector, useCartSubtotal } from '@/store/hooks';
import {
  moveToCart,
  removeFromCart,
  removeSaved,
  saveForLater,
  updateQuantity,
} from '@/store/cartSlice';
import { useAuth } from '@/hooks/useAuth';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const items = useAppSelector((s) => s.cart.items);
  const saved = useAppSelector((s) => s.cart.savedForLater);
  const subtotal = useCartSubtotal();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;
  const freeShippingGap = FREE_SHIPPING_THRESHOLD - subtotal;

  const goCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to continue to checkout');
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0 && saved.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 font-display text-3xl font-semibold">Shopping Cart</h1>
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Let's find something beautiful."
          action={
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild>
                <Link to="/shop">Start Shopping</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/account/orders">Go to your orders</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* Free shipping progress */}
          {items.length > 0 && freeShippingGap > 0 && (
            <div className="rounded-lg border border-border bg-accent/50 p-4 text-sm">
              Add <span className="font-semibold">{formatINR(freeShippingGap)}</span> more to get{' '}
              <span className="font-semibold text-[var(--success)]">FREE shipping!</span>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {items.map((item) => (
            <Card key={`${item.productId}-${item.variantId ?? ''}`}>
              <CardContent className="flex gap-4 p-4">
                <Link to={`/product/${item.slug}`} className="shrink-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-24 w-24 rounded-md border border-border object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <Link to={`/product/${item.slug}`} className="font-medium hover:text-primary line-clamp-2">
                      {item.name}
                    </Link>
                    <span className="whitespace-nowrap font-semibold">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                  {item.variantLabel && (
                    <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{formatINR(item.price)} each</p>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-md border border-input">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              variantId: item.variantId,
                              quantity: item.quantity - 1,
                            }),
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center hover:bg-accent"
                        aria-label="Decrease"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              productId: item.productId,
                              variantId: item.variantId,
                              quantity: item.quantity + 1,
                            }),
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center hover:bg-accent"
                        aria-label="Increase"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          dispatch(saveForLater({ productId: item.productId, variantId: item.variantId }))
                        }
                      >
                        Save for later
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          dispatch(removeFromCart({ productId: item.productId, variantId: item.variantId }));
                          toast.info('Removed from cart');
                        }}
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Saved for later */}
          {saved.length > 0 && (
            <div className="pt-4">
              <h2 className="mb-3 text-lg font-semibold">Saved for Later ({saved.length})</h2>
              <div className="space-y-3">
                {saved.map((item) => (
                  <Card key={`${item.productId}-${item.variantId ?? ''}`}>
                    <CardContent className="flex items-center gap-4 p-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-16 w-16 rounded-md border border-border object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{formatINR(item.price)}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          dispatch(moveToCart({ productId: item.productId, variantId: item.variantId }))
                        }
                      >
                        Move to Cart
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          dispatch(removeSaved({ productId: item.productId, variantId: item.variantId }))
                        }
                        aria-label="Remove"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Card>
              <CardContent className="space-y-4 p-6">
                <h2 className="text-lg font-semibold">Order Summary</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatINR(total)}</span>
                </div>
                <Button size="lg" className="w-full" onClick={goCheckout}>
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Tag className="h-3 w-3" /> Have a coupon? Apply it at checkout.
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
