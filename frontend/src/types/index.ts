// ── Domain types (mirror the backend entity/DTO design) ─────────

export type Role = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  emailVerified: boolean;
  blocked: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: 'HOME' | 'WORK' | 'OTHER';
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl: string;
  parentId?: string | null;
  productCount?: number;
  active: boolean;
  sortOrder: number;
}

export type Material = 'GOLD_PLATED' | 'SILVER' | 'ARTIFICIAL' | 'BRASS';
export type Occasion = 'WEDDING' | 'FESTIVE' | 'DAILY_WEAR' | 'PARTY' | 'OFFICE' | 'GIFTING';

export interface ProductAttributes {
  material: Material;
  stoneType?: string;
  weightGrams: number;
  color: string;
  occasion: Occasion;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size", "Color"
  value: string; // e.g. "16 (56mm)", "Rose Gold"
  priceDelta: number; // added to base price
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName: string;
  price: number; // selling price (INR)
  mrp: number; // strike-through price
  sku: string;
  stock: number;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttributes;
  rating: number;
  reviewCount: number;
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  active: boolean;
  // Dropshipping (admin-only fields; backend omits these for customers)
  supplierName?: string;
  supplierUrl?: string;
  costPrice?: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  mrp: number;
  quantity: number;
  stock: number;
  variantId?: string;
  variantLabel?: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'PENDING_PAYMENT'
  | 'PAYMENT_FAILED'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PLACED_WITH_SUPPLIER'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'RAZORPAY' | 'COD';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'COD_PENDING';

export interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  variantLabel?: string;
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  note?: string;
  at: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  status: OrderStatus;
  shippingAddress: Omit<Address, 'id' | 'userId' | 'isDefault'>;
  trackingNumber?: string;
  courierName?: string;
  timeline: OrderTimelineEvent[];
  createdAt: string;
}

export type CouponType = 'PERCENT' | 'FLAT';

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: CouponType;
  value: number; // percent (1-100) or flat INR
  minOrderAmount: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaLabel: string;
  ctaLink: string;
  placement: 'HERO' | 'PROMO';
  active: boolean;
  sortOrder: number;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  supportPhone: string;
  addressLine: string;
  freeShippingThreshold: number;
  shippingFee: number;
  codEnabled: boolean;
}

// ── API envelope & pagination (matches backend global wrapper) ──

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Page<T> {
  content: T[];
  page: number; // zero-based
  size: number;
  totalElements: number;
  totalPages: number;
}

export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popularity';

export interface ProductFilters {
  q?: string;
  category?: string; // slug
  materials?: Material[];
  occasions?: Occasion[];
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSort;
  page?: number;
  size?: number;
  featured?: boolean;
  trending?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
}

// ── Admin analytics ─────────────────────────────────────────────

export interface DailyPoint {
  date: string; // yyyy-MM-dd
  revenue: number;
  orders: number;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueThisMonth: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  averageOrderValue: number;
  revenueByDay: DailyPoint[];
  salesByCategory: { category: string; revenue: number }[];
  topProducts: { productId: string; name: string; unitsSold: number; revenue: number }[];
  recentOrders: Order[];
}
