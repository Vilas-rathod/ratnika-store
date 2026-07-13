import { useCallback } from 'react';
import { RAZORPAY_KEY_ID, USE_MOCK_API } from '@/lib/constants';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

const SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface CheckoutParams {
  razorpayOrderId: string;
  amountPaise: number;
  keyId?: string;
  customer: { name: string; email: string; contact: string };
  onSuccess: (response: RazorpayResponse) => void;
  onDismiss?: () => void;
}

export function useRazorpay() {
  const openCheckout = useCallback(async (params: CheckoutParams) => {
    // Synthesize success when there's no real gateway: either the frontend is in
    // mock mode, OR the backend returned a mock order id (Razorpay keys not yet
    // configured, app.razorpay.enabled=false). This keeps the whole saga
    // testable end-to-end before live keys are added.
    const isMockOrder = params.razorpayOrderId.startsWith('order_MOCK');
    if (USE_MOCK_API || isMockOrder) {
      await new Promise((r) => setTimeout(r, 800));
      params.onSuccess({
        razorpay_order_id: params.razorpayOrderId,
        razorpay_payment_id: `pay_MOCK${Date.now()}`,
        razorpay_signature: 'mock_signature',
      });
      return;
    }

    const loaded = await loadScript();
    if (!loaded) throw new Error('Failed to load Razorpay. Check your connection.');

    const rzp = new window.Razorpay!({
      key: params.keyId ?? RAZORPAY_KEY_ID,
      amount: params.amountPaise,
      currency: 'INR',
      name: 'Ratnika',
      description: 'Jewellery order payment',
      order_id: params.razorpayOrderId,
      prefill: params.customer,
      theme: { color: '#a16207' },
      handler: params.onSuccess,
      modal: { ondismiss: params.onDismiss },
    });
    rzp.open();
  }, []);

  return { openCheckout };
}
