import { Badge, type BadgeProps } from '@/components/ui/badge';
import { ORDER_STATUS_LABEL } from '@/lib/constants';
import type { OrderStatus, PaymentStatus } from '@/types';

const statusVariant: Record<OrderStatus, BadgeProps['variant']> = {
  PENDING: 'warning',
  PENDING_PAYMENT: 'warning',
  PAYMENT_FAILED: 'destructive',
  CONFIRMED: 'info',
  PROCESSING: 'info',
  PLACED_WITH_SUPPLIER: 'info',
  SHIPPED: 'gold',
  OUT_FOR_DELIVERY: 'gold',
  DELIVERED: 'success',
  CANCELLED: 'destructive',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={statusVariant[status]}>{ORDER_STATUS_LABEL[status]}</Badge>;
}

const paymentVariant: Record<PaymentStatus, BadgeProps['variant']> = {
  PENDING: 'warning',
  PAID: 'success',
  FAILED: 'destructive',
  REFUNDED: 'secondary',
  COD_PENDING: 'warning',
};

const paymentLabel: Record<PaymentStatus, string> = {
  PENDING: 'Payment Pending',
  PAID: 'Paid',
  FAILED: 'Payment Failed',
  REFUNDED: 'Refunded',
  COD_PENDING: 'COD',
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={paymentVariant[status]}>{paymentLabel[status]}</Badge>;
}
