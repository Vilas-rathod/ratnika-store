import { useQuery } from '@tanstack/react-query';
import { Heart, MapPin, Package, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderStatusBadge } from '@/components/shared/OrderStatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { formatDate, formatINR } from '@/lib/format';
import { orderService } from '@/services/order.service';
import { useAppSelector } from '@/store/hooks';

export default function AccountDashboardPage() {
  const wishlistCount = useAppSelector((s) => s.wishlist.items.length);
  const { data: orders } = useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.listMyOrders(),
  });

  const stats = [
    { label: 'Total Orders', value: orders?.length ?? 0, icon: Package, to: '/account/orders' },
    { label: 'Wishlist Items', value: wishlistCount, icon: Heart, to: '/wishlist' },
    {
      label: 'Delivered',
      value: orders?.filter((o) => o.status === 'DELIVERED').length ?? 0,
      icon: Star,
      to: '/account/orders',
    },
  ];

  const recent = orders?.slice(0, 4);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <s.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-semibold">{s.value}</p>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/account/orders">View all</Link>
            </Button>
          </div>

          {recent && recent.length > 0 ? (
            <div className="space-y-3">
              {recent.map((order) => (
                <Link
                  key={order.id}
                  to={`/account/orders/${order.id}`}
                  className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-accent/40"
                >
                  <img
                    src={order.items[0]?.imageUrl}
                    alt=""
                    className="h-14 w-14 rounded border border-border object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">#{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(order.createdAt)} · {order.items.length} item(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatINR(order.total)}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="Start shopping to see your orders here."
              action={
                <Button asChild>
                  <Link to="/shop">Browse Jewellery</Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium">Manage your addresses</p>
              <p className="text-sm text-muted-foreground">Add or edit delivery addresses.</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link to="/account/addresses">Manage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
