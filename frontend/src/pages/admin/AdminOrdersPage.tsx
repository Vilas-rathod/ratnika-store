import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Order, OrderStatus } from '@/types';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/shared/OrderStatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { ORDER_STATUS_LABEL } from '@/lib/constants';
import { formatDate, formatINR } from '@/lib/format';
import { adminService } from '@/services/admin.service';
import type { ApiError } from '@/services/http';

const ALL_STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'PLACED_WITH_SUPPLIER',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<string>('ALL');
  const [page, setPage] = useState(0);
  const [editing, setEditing] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('CONFIRMED');
  const [tracking, setTracking] = useState('');
  const [courier, setCourier] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', status, page],
    queryFn: () =>
      adminService.listOrders({ status: status === 'ALL' ? undefined : status, page, size: 10 }),
  });

  const openEdit = (order: Order) => {
    setEditing(order);
    setNewStatus(order.status);
    setTracking(order.trackingNumber ?? '');
    setCourier(order.courierName ?? '');
  };

  const updateStatus = useMutation({
    mutationFn: () =>
      adminService.updateOrderStatus(editing!.id, {
        status: newStatus,
        trackingNumber: tracking || undefined,
        courierName: courier || undefined,
      }),
    onSuccess: () => {
      toast.success('Order updated');
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (err: ApiError) => toast.error(err.message),
  });

  return (
    <div>
      <AdminPageHeader title="Orders" description={`${data?.totalElements ?? 0} total orders`} />

      <div className="mb-4 max-w-xs">
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(0);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {ALL_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {ORDER_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : data && data.content.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.content.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">#{o.orderNumber}</TableCell>
                  <TableCell>
                    <p className="text-sm">{o.customerName}</p>
                    <p className="text-xs text-muted-foreground">{o.customerEmail}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(o.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">{formatINR(o.total)}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={o.paymentStatus} />
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={o.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openEdit(o)}>
                      <Eye className="h-3.5 w-3.5" /> Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <EmptyState
            icon={ShoppingCart}
            title="No orders"
            description="Orders will appear here once customers start buying."
            className="border-none"
          />
        )}
      </Card>

      {data && data.totalPages > 1 && (
        <div className="mt-6">
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
        </div>
      )}

      {/* Manage order dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Order #{editing?.orderNumber}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              {/* Items summary */}
              <div className="max-h-40 space-y-2 overflow-y-auto rounded-lg border border-border p-3">
                {editing.items.map((it, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <img src={it.imageUrl} alt="" className="h-8 w-8 rounded object-cover" />
                    <span className="line-clamp-1 flex-1">{it.name}</span>
                    <span className="text-muted-foreground">×{it.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="rounded-lg bg-accent/40 p-3 text-sm">
                <p className="font-medium">Dropshipping workflow</p>
                <p className="text-xs text-muted-foreground">
                  Update status as you place the order with the supplier and it ships.
                </p>
              </div>

              <FormField label="Order Status">
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as OrderStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALL_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {ORDER_STATUS_LABEL[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Courier Name">
                  <Input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="BlueDart" />
                </FormField>
                <FormField label="Tracking Number">
                  <Input
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                    placeholder="BLUEDART123IN"
                  />
                </FormField>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button onClick={() => updateStatus.mutate()} loading={updateStatus.isPending}>
                  Update Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
