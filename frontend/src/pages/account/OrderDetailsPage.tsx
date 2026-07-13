import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Download,
  MapPin,
  Truck,
  X,
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/shared/OrderStatusBadge';
import { PageLoader } from '@/components/shared/Spinner';
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABEL } from '@/lib/constants';
import { formatDateTime, formatINR } from '@/lib/format';
import { downloadInvoice } from '@/lib/invoice';
import { cn } from '@/lib/utils';
import { orderService } from '@/services/order.service';
import type { ApiError } from '@/services/http';

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(id!),
    enabled: !!id,
  });

  const cancelOrder = useMutation({
    mutationFn: () => orderService.cancelOrder(order!.id, 'Cancelled by customer'),
    onSuccess: () => {
      toast.success('Order cancelled');
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  if (isLoading) return <PageLoader label="Loading order…" />;
  if (!order)
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-semibold">Order not found</p>
        <Button asChild className="mt-4">
          <Link to="/account/orders">Back to Orders</Link>
        </Button>
      </div>
    );

  const cancelled = order.status === 'CANCELLED';
  const currentStep = ORDER_STATUS_FLOW.indexOf(order.status);
  const canCancel = !['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(order.status);

  return (
    <div>
      <button
        onClick={() => navigate('/account/orders')}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </button>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Order #{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex items-center gap-2">
          <PaymentStatusBadge status={order.paymentStatus} />
          <OrderStatusBadge status={order.status} />
          <Button variant="outline" size="sm" onClick={() => downloadInvoice(order)}>
            <Download className="h-4 w-4" /> Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Tracking */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Truck className="h-5 w-5 text-primary" /> Order Tracking
              </h2>

              {cancelled ? (
                <div className="flex items-center gap-3 rounded-lg bg-[var(--info-soft)] p-4 text-sm">
                  <X className="h-5 w-5 text-destructive" />
                  <span>This order was cancelled.</span>
                </div>
              ) : (
                <ol className="relative ml-3 border-l-2 border-border">
                  {ORDER_STATUS_FLOW.map((status, i) => {
                    const done = i <= currentStep;
                    const active = i === currentStep;
                    return (
                      <li key={status} className="mb-6 ml-6 last:mb-0">
                        <span
                          className={cn(
                            'absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full',
                            done ? 'bg-primary text-primary-foreground' : 'bg-muted',
                          )}
                        >
                          {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
                        </span>
                        <p className={cn('text-sm font-medium', active && 'text-primary')}>
                          {ORDER_STATUS_LABEL[status]}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              )}

              {order.trackingNumber && (
                <div className="mt-2 rounded-lg border border-border p-3 text-sm">
                  <p className="text-muted-foreground">
                    Courier: <span className="font-medium text-foreground">{order.courierName}</span>
                  </p>
                  <p className="text-muted-foreground">
                    Tracking #: <span className="font-mono font-medium text-foreground">{order.trackingNumber}</span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Items ({order.items.length})</h2>
              <div className="space-y-4">
                {order.items.map((it, i) => (
                  <div key={i} className="flex gap-4">
                    <img
                      src={it.imageUrl}
                      alt={it.name}
                      className="h-16 w-16 rounded-md border border-border object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{it.name}</p>
                      {it.variantLabel && (
                        <p className="text-xs text-muted-foreground">{it.variantLabel}</p>
                      )}
                      <p className="text-sm text-muted-foreground">Qty: {it.quantity}</p>
                    </div>
                    <span className="font-medium">{formatINR(it.price * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {canCancel && (
            <Button
              variant="outline"
              className="text-destructive hover:text-destructive"
              onClick={() => cancelOrder.mutate()}
              loading={cancelOrder.isPending}
            >
              <X className="h-4 w-4" /> Cancel Order
            </Button>
          )}
        </div>

        {/* Summary + address */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-3 flex items-center gap-2 font-semibold">
                <MapPin className="h-4 w-4 text-primary" /> Delivery Address
              </h2>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                <p>
                  {order.shippingAddress.line1}
                  {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
                </p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  {order.shippingAddress.pincode}
                </p>
                <p>{order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2 p-6 text-sm">
              <h2 className="mb-3 font-semibold">Payment Summary</h2>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-[var(--success)]">
                  <span>Discount</span>
                  <span>−{formatINR(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shippingFee === 0 ? 'FREE' : formatINR(order.shippingFee)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatINR(order.total)}</span>
              </div>
              <p className="pt-2 text-xs text-muted-foreground">
                Paid via {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Razorpay'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
