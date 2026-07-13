import { useQuery } from '@tanstack/react-query';
import {
  AlertTriangle,
  IndianRupee,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '@/components/admin/StatCard';
import { CategoryBarChart, RevenueAreaChart } from '@/components/admin/Charts';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderStatusBadge } from '@/components/shared/OrderStatusBadge';
import { formatCompactINR, formatDate, formatINR } from '@/lib/format';
import { adminService } from '@/services/admin.service';

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.dashboard(),
  });

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <AdminPageHeader title="Dashboard" description="Your store at a glance" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Dashboard" description="Your store at a glance" />

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatCompactINR(data.totalRevenue)}
          icon={IndianRupee}
          hint={`${formatCompactINR(data.revenueThisMonth)} this month`}
          accent="success"
        />
        <StatCard
          label="Total Orders"
          value={data.totalOrders}
          icon={ShoppingCart}
          hint={`${data.pendingOrders} pending`}
          accent="info"
        />
        <StatCard label="Customers" value={data.totalCustomers} icon={Users} accent="primary" />
        <StatCard
          label="Avg Order Value"
          value={formatINR(data.averageOrderValue)}
          icon={TrendingUp}
          accent="warning"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Revenue chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueAreaChart data={data.revenueByDay} />
          </CardContent>
        </Card>

        {/* Category breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBarChart
              data={data.salesByCategory.map((c) => ({ label: c.category, value: c.revenue }))}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent orders */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link to="/admin/orders" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium">#{o.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {o.customerName} · {formatDate(o.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatINR(o.total)}</span>
                  <OrderStatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top products */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Top Products</CardTitle>
            <Link to="/admin/products" className="text-sm text-primary hover:underline">
              Manage
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topProducts.map((p, i) => (
              <div key={p.productId} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
                    {i + 1}
                  </span>
                  <span className="line-clamp-1 font-medium">{p.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatINR(p.revenue)}</p>
                  <p className="text-xs text-muted-foreground">{p.unitsSold} sold</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Low stock alert */}
      {data.lowStockCount > 0 && (
        <Card className="border-[var(--warning)]/40 bg-[var(--warning-soft)]">
          <CardContent className="flex items-center gap-3 p-5">
            <AlertTriangle className="h-6 w-6 text-[var(--warning)]" />
            <div className="flex-1">
              <p className="font-medium">{data.lowStockCount} product(s) low on stock</p>
              <p className="text-sm text-muted-foreground">
                Review inventory to avoid missed sales.
              </p>
            </div>
            <Link to="/admin/products" className="text-sm font-medium text-primary hover:underline">
              Review <Package className="ml-1 inline h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
