import type { Coupon, Order } from '@/types';
import { http } from './http';

export const orderService = {
  listMyOrders() {
    return http.get<Order[]>('/orders');
  },

  getOrder(idOrNumber: string) {
    return http.get<Order>(`/orders/${idOrNumber}`);
  },

  cancelOrder(id: string, reason?: string) {
    return http.post<Order>(`/orders/${id}/cancel`, { reason });
  },

  validateCoupon(code: string, subtotal: number) {
    return http.post<{ coupon: Coupon; discount: number }>('/coupons/validate', { code, subtotal });
  },
};
