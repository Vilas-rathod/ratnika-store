import type { Material, Occasion, OrderStatus } from '@/types';

export const APP_NAME = 'Ratnika';
export const APP_TAGLINE = 'Exquisite Jewellery, Delivered';
export const HQ_CITY = 'Pune, Maharashtra, India';
export const SUPPORT_EMAIL = 'support@ratnika.in';
export const SUPPORT_PHONE = '+91 98765 43210';

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

export const USE_MOCK_API: boolean = (import.meta.env.VITE_USE_MOCK_API ?? 'true') !== 'false';

export const RAZORPAY_KEY_ID: string = import.meta.env.VITE_RAZORPAY_KEY_ID ?? '';

export const FREE_SHIPPING_THRESHOLD = 999;
export const SHIPPING_FEE = 79;

export const MATERIALS: { value: Material; label: string }[] = [
  { value: 'GOLD_PLATED', label: 'Gold Plated' },
  { value: 'SILVER', label: 'Silver' },
  { value: 'ARTIFICIAL', label: 'Artificial' },
  { value: 'BRASS', label: 'Brass' },
];

export const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: 'WEDDING', label: 'Wedding' },
  { value: 'FESTIVE', label: 'Festive' },
  { value: 'DAILY_WEAR', label: 'Daily Wear' },
  { value: 'PARTY', label: 'Party' },
  { value: 'OFFICE', label: 'Office' },
  { value: 'GIFTING', label: 'Gifting' },
];

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'PLACED_WITH_SUPPLIER',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  PENDING_PAYMENT: 'Awaiting Payment',
  PAYMENT_FAILED: 'Payment Failed',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  PLACED_WITH_SUPPLIER: 'Placed with Supplier',
  SHIPPED: 'Shipped',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
] as const;

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];
