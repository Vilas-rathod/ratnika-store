import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/shared/OrderStatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate, formatINR } from '@/lib/format';
import { orderService } from '@/services/order.service';

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.listMyOrders(),
  });

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold">My Orders</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <p className="font-medium">Order #{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <PaymentStatusBadge status={order.paymentStatus} />
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>

                <div className="flex items-center gap-3 py-3">
                  <div className="flex -space-x-3">
                    {order.items.slice(0, 3).map((it, i) => (
                      <img
                        key={i}
                        src={it.imageUrl}
                        alt={it.name}
                        className="h-14 w-14 rounded-md border-2 border-card object-cover"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <span className="flex h-14 w-14 items-center justify-center rounded-md border-2 border-card bg-muted text-xs font-medium">
                        +{order.items.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm">{order.items[0]?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} item(s) · {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatINR(order.total)}</p>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/account/orders/${order.id}`}>View Details</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place an order, it will show up here."
          action={
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
