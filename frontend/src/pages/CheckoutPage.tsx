import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, MapPin, Plus, Tag, Truck, Wallet, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { Address, Coupon, PaymentMethod } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AddressFormDialog } from '@/components/account/AddressFormDialog';
import { formatINR } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { accountService } from '@/services/account.service';
import { checkoutService } from '@/services/checkout.service';
import { orderService } from '@/services/order.service';
import { useAppDispatch, useAppSelector, useCartSubtotal } from '@/store/hooks';
import { clearCart } from '@/store/cartSlice';
import { useAuth } from '@/hooks/useAuth';
import { useRazorpay } from '@/hooks/useRazorpay';
import type { ApiError } from '@/services/http';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { openCheckout } = useRazorpay();
  const items = useAppSelector((s) => s.cart.items);
  const subtotal = useCartSubtotal();

  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [addressDialog, setAddressDialog] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>('RAZORPAY');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ coupon: Coupon; discount: number } | null>(null);
  const [placing, setPlacing] = useState(false);

  const { data: addresses } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => accountService.listAddresses(),
  });

  // Default the selected address once loaded
  useMemo(() => {
    if (addresses?.length && !selectedAddress) {
      setSelectedAddress(addresses.find((a) => a.isDefault)?.id ?? addresses[0].id);
    }
  }, [addresses, selectedAddress]);

  const discount = appliedCoupon?.discount ?? 0;
  const shipping = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyCoupon = useMutation({
    mutationFn: () => orderService.validateCoupon(couponCode, subtotal),
    onSuccess: (res) => {
      setAppliedCoupon(res);
      toast.success(`Coupon applied! You saved ${formatINR(res.discount)}`);
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  if (items.length === 0) {
    navigate('/cart', { replace: true });
    return null;
  }

  const finishSuccess = (orderId: string) => {
    dispatch(clearCart());
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    toast.success('Order placed successfully! 🎉');
    navigate(`/account/orders/${orderId}`, { replace: true });
  };

  // Checkout saga: initiate → (COD done | Razorpay: pay → confirm)
  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    const address = addresses?.find((a) => a.id === selectedAddress) as Address;
    const { id: _i, userId: _u, isDefault: _d, ...shippingAddress } = address;
    void _i;
    void _u;
    void _d;

    setPlacing(true);
    try {
      const init = await checkoutService.initiate({
        items: items.map((it) => ({
          productId: it.productId,
          quantity: it.quantity,
          variantId: it.variantId,
          variantLabel: it.variantLabel,
        })),
        shippingAddress,
        paymentMethod: payment,
        couponCode: appliedCoupon?.coupon.code,
      });

      // COD — order already confirmed by the backend
      if (!init.requiresPayment) {
        finishSuccess(init.orderId);
        return;
      }

      // Razorpay — open checkout, then confirm the payment (verifies signature server-side)
      await openCheckout({
        razorpayOrderId: init.razorpayOrderId!,
        amountPaise: init.amount!,
        keyId: init.keyId ?? undefined,
        customer: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email ?? '',
          contact: user?.phone ?? '',
        },
        onSuccess: async (response) => {
          try {
            await checkoutService.confirm({
              orderId: init.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            finishSuccess(init.orderId);
          } catch (err) {
            toast.error((err as ApiError).message);
            setPlacing(false);
          }
        },
        onDismiss: async () => {
          // Release the stock we reserved at initiate.
          try {
            await checkoutService.cancel(init.orderId);
          } catch {
            /* best-effort; the expiry sweeper will release it otherwise */
          }
          setPlacing(false);
          toast.info('Payment cancelled');
        },
      });
    } catch (err) {
      toast.error((err as ApiError).message);
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Address */}
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="h-5 w-5 text-primary" /> Delivery Address
                </h2>
                <Button variant="outline" size="sm" onClick={() => setAddressDialog(true)}>
                  <Plus className="h-4 w-4" /> Add New
                </Button>
              </div>

              {addresses && addresses.length > 0 ? (
                <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress} className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={cn(
                        'flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors',
                        selectedAddress === addr.id ? 'border-primary bg-accent/40' : 'border-border',
                      )}
                    >
                      <RadioGroupItem value={addr.id} className="mt-1" />
                      <div className="text-sm">
                        <p className="font-medium">
                          {addr.fullName}{' '}
                          <span className="ml-1 rounded bg-muted px-1.5 py-0.5 text-xs">{addr.type}</span>
                        </p>
                        <p className="text-muted-foreground">
                          {addr.line1}, {addr.line2 && `${addr.line2}, `}
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-muted-foreground">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </RadioGroup>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No saved addresses. Add one to continue.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Wallet className="h-5 w-5 text-primary" /> Payment Method
              </h2>
              <RadioGroup value={payment} onValueChange={(v) => setPayment(v as PaymentMethod)} className="space-y-3">
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
                    payment === 'RAZORPAY' ? 'border-primary bg-accent/40' : 'border-border',
                  )}
                >
                  <RadioGroupItem value="RAZORPAY" />
                  <div className="flex-1">
                    <p className="font-medium">Pay Online</p>
                    <p className="text-xs text-muted-foreground">
                      UPI, Cards, Netbanking & Wallets via Razorpay
                    </p>
                  </div>
                  <Truck className="h-5 w-5 text-muted-foreground" />
                </label>
                <label
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors',
                    payment === 'COD' ? 'border-primary bg-accent/40' : 'border-border',
                  )}
                >
                  <RadioGroupItem value="COD" />
                  <div className="flex-1">
                    <p className="font-medium">Cash on Delivery</p>
                    <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="max-h-52 space-y-3 overflow-y-auto">
                {items.map((it) => (
                  <div key={`${it.productId}-${it.variantId ?? ''}`} className="flex gap-3">
                    <img
                      src={it.imageUrl}
                      alt={it.name}
                      className="h-14 w-14 rounded border border-border object-cover"
                    />
                    <div className="flex-1 text-sm">
                      <p className="line-clamp-1 font-medium">{it.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {it.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{formatINR(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Coupon */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between rounded-md bg-[var(--success-soft)] px-3 py-2 text-sm">
                  <span className="flex items-center gap-2 font-medium text-[var(--success)]">
                    <Tag className="h-4 w-4" /> {appliedCoupon.coupon.code}
                  </span>
                  <button
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode('');
                    }}
                    aria-label="Remove coupon"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <Button
                    variant="outline"
                    onClick={() => applyCoupon.mutate()}
                    disabled={!couponCode || applyCoupon.isPending}
                    loading={applyCoupon.isPending}
                  >
                    Apply
                  </Button>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[var(--success)]">
                    <span>Discount</span>
                    <span>−{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatINR(shipping)}</span>
                </div>
              </div>

              <Separator />
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatINR(total)}</span>
              </div>

              <Button size="lg" className="w-full" onClick={placeOrder} loading={placing}>
                <CheckCircle2 className="h-5 w-5" />
                {payment === 'COD' ? 'Place Order' : `Pay ${formatINR(total)}`}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By placing your order you agree to our Terms & Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddressFormDialog
        open={addressDialog}
        onOpenChange={setAddressDialog}
        onSaved={(addr) => {
          queryClient.invalidateQueries({ queryKey: ['addresses'] });
          setSelectedAddress(addr.id);
        }}
      />
    </div>
  );
}
