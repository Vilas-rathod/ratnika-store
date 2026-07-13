import type { Order, PaymentMethod } from '@/types';
import { http } from './http';

export interface InitiateCheckoutPayload {
  items: { productId: string; quantity: number; variantId?: string; variantLabel?: string }[];
  shippingAddress: Order['shippingAddress'];
  paymentMethod: PaymentMethod;
  couponCode?: string;
}

export interface InitiateCheckoutResponse {
  orderId: string;
  orderNumber: string;
  paymentMethod: PaymentMethod;
  requiresPayment: boolean;
  razorpayOrderId?: string | null;
  amount?: number | null; // paise
  currency?: string | null;
  keyId?: string | null;
}

export interface ConfirmPaymentPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/**
 * Checkout saga client. Flow:
 *   initiate() → (COD: done) | (Razorpay: open checkout → confirm())
 *   cancel()   → releases reserved stock if the customer abandons payment.
 */
export const checkoutService = {
  initiate(payload: InitiateCheckoutPayload) {
    return http.post<InitiateCheckoutResponse>('/checkout/initiate', payload);
  },

  confirm(payload: ConfirmPaymentPayload) {
    return http.post<Order>('/checkout/confirm', payload);
  },

  cancel(orderId: string) {
    return http.post<void>(`/checkout/${orderId}/cancel`, {});
  },
};
