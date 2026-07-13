import type {
  Banner,
  Category,
  Coupon,
  DashboardStats,
  Order,
  OrderStatus,
  Page,
  Product,
  ProductAttributes,
  ProductVariant,
  Review,
  StoreSettings,
  User,
} from '@/types';
import { http } from './http';

export interface AdminCustomer extends User {
  orderCount: number;
  totalSpent: number;
}

export interface ProductInput {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  mrp: number;
  sku?: string;
  stock: number;
  images: string[];
  variants: ProductVariant[];
  attributes: ProductAttributes;
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  active: boolean;
  supplierName?: string;
  supplierUrl?: string;
  costPrice?: number;
}

export interface CouponInput {
  code: string;
  description: string;
  type: Coupon['type'];
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiresAt: string;
  usageLimit: number;
  active: boolean;
}

export const adminService = {
  dashboard() {
    return http.get<DashboardStats>('/admin/dashboard');
  },

  // Products
  listProducts(params: { q?: string; page?: number; size?: number } = {}) {
    return http.get<Page<Product>>('/admin/products', params);
  },
  createProduct(input: ProductInput) {
    return http.post<Product>('/admin/products', input);
  },
  updateProduct(id: string, input: Partial<ProductInput>) {
    return http.put<Product>(`/admin/products/${id}`, input);
  },
  deleteProduct(id: string) {
    return http.delete<{ ok: boolean }>(`/admin/products/${id}`);
  },

  // Categories
  listCategories() {
    return http.get<Category[]>('/admin/categories');
  },
  createCategory(input: { name: string; description?: string; imageUrl?: string; active?: boolean }) {
    return http.post<Category>('/admin/categories', input);
  },
  updateCategory(id: string, input: Partial<Category>) {
    return http.put<Category>(`/admin/categories/${id}`, input);
  },
  deleteCategory(id: string) {
    return http.delete<{ ok: boolean }>(`/admin/categories/${id}`);
  },

  // Orders
  listOrders(params: { status?: string; page?: number; size?: number } = {}) {
    return http.get<Page<Order>>('/admin/orders', params);
  },
  updateOrderStatus(
    id: string,
    payload: { status: OrderStatus; trackingNumber?: string; courierName?: string; note?: string },
  ) {
    return http.put<Order>(`/admin/orders/${id}/status`, payload);
  },

  // Customers
  listCustomers() {
    return http.get<AdminCustomer[]>('/admin/customers');
  },
  setCustomerBlocked(id: string, blocked: boolean) {
    return http.put<User>(`/admin/customers/${id}/status`, { blocked });
  },

  // Coupons
  listCoupons() {
    return http.get<Coupon[]>('/admin/coupons');
  },
  createCoupon(input: CouponInput) {
    return http.post<Coupon>('/admin/coupons', input);
  },
  updateCoupon(id: string, input: Partial<CouponInput>) {
    return http.put<Coupon>(`/admin/coupons/${id}`, input);
  },
  deleteCoupon(id: string) {
    return http.delete<{ ok: boolean }>(`/admin/coupons/${id}`);
  },

  // Reviews
  listReviews() {
    return http.get<Review[]>('/admin/reviews');
  },
  approveReview(id: string, approved: boolean) {
    return http.put<Review>(`/admin/reviews/${id}/approve`, { approved });
  },
  deleteReview(id: string) {
    return http.delete<{ ok: boolean }>(`/reviews/${id}`);
  },

  // Banners
  listBanners() {
    return http.get<Banner[]>('/admin/banners');
  },
  createBanner(input: Omit<Banner, 'id' | 'sortOrder'>) {
    return http.post<Banner>('/admin/banners', input);
  },
  updateBanner(id: string, input: Partial<Banner>) {
    return http.put<Banner>(`/admin/banners/${id}`, input);
  },
  deleteBanner(id: string) {
    return http.delete<{ ok: boolean }>(`/admin/banners/${id}`);
  },

  // Settings
  getSettings() {
    return http.get<StoreSettings>('/admin/settings');
  },
  updateSettings(input: Partial<StoreSettings>) {
    return http.put<StoreSettings>('/admin/settings', input);
  },
};
