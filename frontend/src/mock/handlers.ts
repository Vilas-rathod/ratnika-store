import type {
  Address,
  AuthResponse,
  Banner,
  Category,
  Coupon,
  DashboardStats,
  Order,
  OrderStatus,
  Page,
  Product,
  ProductFilters,
  Review,
  User,
} from '@/types';
import { FREE_SHIPPING_THRESHOLD, ORDER_STATUS_LABEL, SHIPPING_FEE } from '@/lib/constants';
import { sleep, uid, slugify } from '@/lib/utils';
import { getDB, persist, resetDB } from './db';

/** Thrown by handlers to simulate an HTTP error response. */
export class MockHttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

function stripPassword(u: User & { password?: string }): User {
  const { password: _pw, ...rest } = u;
  return rest;
}

/** Customers must never receive supplier / cost fields. */
function publicProduct(p: Product): Product {
  const { supplierName: _s, supplierUrl: _u, costPrice: _c, ...rest } = p;
  return rest as Product;
}

function token(role: string, sub: string): string {
  // Fake but structurally-valid-looking JWT (header.payload.signature)
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({ sub, role, iat: Date.now(), exp: Date.now() + 15 * 60 * 1000 }),
  );
  return `${header}.${payload}.mocksig_${uid()}`;
}

function makeAuth(user: User): AuthResponse {
  return {
    user,
    tokens: {
      accessToken: token(user.role, user.id),
      refreshToken: `refresh_${user.id}_${uid()}`,
    },
  };
}

/** Resolve the "current user" from the mock Authorization header. */
function currentUser(headers?: Record<string, string>): (User & { password: string }) | null {
  const auth = headers?.Authorization ?? headers?.authorization;
  if (!auth) return null;
  const raw = auth.replace('Bearer ', '');
  try {
    const payload = JSON.parse(atob(raw.split('.')[1]));
    return getDB().users.find((u) => u.id === payload.sub) ?? null;
  } catch {
    return null;
  }
}

function requireAuth(headers?: Record<string, string>) {
  const user = currentUser(headers);
  if (!user) throw new MockHttpError(401, 'Authentication required');
  if (user.blocked) throw new MockHttpError(403, 'Your account has been blocked');
  return user;
}

function requireAdmin(headers?: Record<string, string>) {
  const user = requireAuth(headers);
  if (user.role !== 'ADMIN') throw new MockHttpError(403, 'Admin access required');
  return user;
}

function paginate<T>(items: T[], page = 0, size = 12): Page<T> {
  const totalElements = items.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const start = page * size;
  return {
    content: items.slice(start, start + size),
    page,
    size,
    totalElements,
    totalPages,
  };
}

function filterProducts(all: Product[], f: ProductFilters): Product[] {
  let list = all.filter((p) => p.active);
  if (f.q) {
    const q = f.q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q),
    );
  }
  if (f.category) list = list.filter((p) => slugify(p.categoryName) === f.category);
  if (f.materials?.length) list = list.filter((p) => f.materials!.includes(p.attributes.material));
  if (f.occasions?.length) list = list.filter((p) => f.occasions!.includes(p.attributes.occasion));
  if (f.minPrice != null) list = list.filter((p) => p.price >= f.minPrice!);
  if (f.maxPrice != null) list = list.filter((p) => p.price <= f.maxPrice!);
  if (f.featured) list = list.filter((p) => p.featured);
  if (f.trending) list = list.filter((p) => p.trending);
  if (f.bestSeller) list = list.filter((p) => p.bestSeller);
  if (f.newArrival) list = list.filter((p) => p.newArrival);

  switch (f.sort) {
    case 'price_asc':
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      list = [...list].sort((a, b) => b.rating - a.rating);
      break;
    case 'popularity':
      list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
      break;
    case 'newest':
    default:
      list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  return list;
}

interface MockRequest {
  method: string;
  url: string; // path after base, e.g. /products?...
  body?: unknown;
  headers?: Record<string, string>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Body = any;

/**
 * Central mock router. Returns the `data` payload (already unwrapped
 * from the ApiResponse envelope by the caller's convention).
 */
export async function handleMock(req: MockRequest): Promise<unknown> {
  await sleep(180 + Math.random() * 220); // simulate latency
  const db = getDB();
  const [path, query] = req.url.split('?');
  const params = new URLSearchParams(query ?? '');
  const body = (req.body ?? {}) as Body;
  const seg = path.split('/').filter(Boolean); // e.g. ['products','prd_1']
  const m = req.method.toUpperCase();

  // ── AUTH ──────────────────────────────────────────────────────
  if (path === '/auth/register' && m === 'POST') {
    if (db.users.some((u) => u.email === body.email))
      throw new MockHttpError(409, 'An account with this email already exists');
    const user: User & { password: string } = {
      id: uid('usr_'),
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      role: 'CUSTOMER',
      emailVerified: false,
      blocked: false,
      createdAt: new Date().toISOString(),
      password: body.password,
    };
    db.users.push(user);
    db.otps[user.email] = '123456';
    persist();
    return makeAuth(stripPassword(user));
  }

  if (path === '/auth/login' && m === 'POST') {
    const user = db.users.find((u) => u.email === body.email);
    if (!user || user.password !== body.password)
      throw new MockHttpError(401, 'Invalid email or password');
    if (user.blocked) throw new MockHttpError(403, 'Your account has been blocked');
    return makeAuth(stripPassword(user));
  }

  if (path === '/auth/refresh' && m === 'POST') {
    const rt: string = body.refreshToken ?? '';
    const userId = rt.split('_')[1];
    const user = db.users.find((u) => u.id === userId);
    if (!user) throw new MockHttpError(401, 'Invalid refresh token');
    return makeAuth(stripPassword(user)).tokens;
  }

  if (path === '/auth/logout' && m === 'POST') return { ok: true };

  if (path === '/auth/forgot-password' && m === 'POST') {
    db.otps[body.email] = '123456';
    persist();
    return { message: 'If the email exists, a reset code has been sent.' };
  }

  if (path === '/auth/reset-password' && m === 'POST') {
    const user = db.users.find((u) => u.email === body.email);
    if (!user || db.otps[body.email] !== body.otp)
      throw new MockHttpError(400, 'Invalid or expired reset code');
    user.password = body.password;
    delete db.otps[body.email];
    persist();
    return { message: 'Password updated. You can now sign in.' };
  }

  if (path === '/auth/verify-otp' && m === 'POST') {
    const user = db.users.find((u) => u.email === body.email);
    if (!user || db.otps[body.email] !== body.otp)
      throw new MockHttpError(400, 'Invalid verification code');
    user.emailVerified = true;
    delete db.otps[body.email];
    persist();
    return stripPassword(user);
  }

  if (path === '/auth/resend-otp' && m === 'POST') {
    db.otps[body.email] = '123456';
    persist();
    return { message: 'Verification code sent (demo code: 123456).' };
  }

  if (path === '/auth/change-password' && m === 'POST') {
    const user = requireAuth(req.headers);
    if (user.password !== body.currentPassword)
      throw new MockHttpError(400, 'Current password is incorrect');
    user.password = body.newPassword;
    persist();
    return { message: 'Password changed successfully' };
  }

  // ── ACCOUNT / PROFILE ─────────────────────────────────────────
  if (path === '/users/me' && m === 'GET') {
    return stripPassword(requireAuth(req.headers));
  }

  if (path === '/users/me' && (m === 'PUT' || m === 'PATCH')) {
    const user = requireAuth(req.headers);
    Object.assign(user, {
      firstName: body.firstName ?? user.firstName,
      lastName: body.lastName ?? user.lastName,
      phone: body.phone ?? user.phone,
    });
    persist();
    return stripPassword(user);
  }

  // ── ADDRESSES ─────────────────────────────────────────────────
  if (path === '/addresses' && m === 'GET') {
    const user = requireAuth(req.headers);
    return db.addresses.filter((a) => a.userId === user.id);
  }
  if (path === '/addresses' && m === 'POST') {
    const user = requireAuth(req.headers);
    const addr: Address = {
      id: uid('adr_'),
      userId: user.id,
      fullName: body.fullName,
      phone: body.phone,
      line1: body.line1,
      line2: body.line2,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      country: body.country ?? 'India',
      type: body.type ?? 'HOME',
      isDefault: body.isDefault ?? db.addresses.filter((a) => a.userId === user.id).length === 0,
    };
    if (addr.isDefault)
      db.addresses.forEach((a) => {
        if (a.userId === user.id) a.isDefault = false;
      });
    db.addresses.push(addr);
    persist();
    return addr;
  }
  if (seg[0] === 'addresses' && seg[1] && m === 'PUT') {
    const user = requireAuth(req.headers);
    const addr = db.addresses.find((a) => a.id === seg[1] && a.userId === user.id);
    if (!addr) throw new MockHttpError(404, 'Address not found');
    if (body.isDefault)
      db.addresses.forEach((a) => {
        if (a.userId === user.id) a.isDefault = false;
      });
    Object.assign(addr, body);
    persist();
    return addr;
  }
  if (seg[0] === 'addresses' && seg[1] && m === 'DELETE') {
    const user = requireAuth(req.headers);
    db.addresses = db.addresses.filter((a) => !(a.id === seg[1] && a.userId === user.id));
    persist();
    return { ok: true };
  }

  // ── CATEGORIES ────────────────────────────────────────────────
  if (path === '/categories' && m === 'GET') {
    return db.categories
      .filter((c) => c.active)
      .map((c) => ({
        ...c,
        productCount: db.products.filter((p) => p.categoryId === c.id && p.active).length,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  if (path === '/admin/categories' && m === 'GET') {
    requireAdmin(req.headers);
    return db.categories
      .map((c) => ({
        ...c,
        productCount: db.products.filter((p) => p.categoryId === c.id).length,
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  if (path === '/admin/categories' && m === 'POST') {
    requireAdmin(req.headers);
    const cat: Category = {
      id: uid('cat_'),
      name: body.name,
      slug: slugify(body.name),
      description: body.description,
      imageUrl: body.imageUrl ?? '',
      parentId: body.parentId ?? null,
      active: body.active ?? true,
      sortOrder: db.categories.length + 1,
    };
    db.categories.push(cat);
    persist();
    return cat;
  }
  if (seg[0] === 'admin' && seg[1] === 'categories' && seg[2] && m === 'PUT') {
    requireAdmin(req.headers);
    const cat = db.categories.find((c) => c.id === seg[2]);
    if (!cat) throw new MockHttpError(404, 'Category not found');
    Object.assign(cat, body, body.name ? { slug: slugify(body.name) } : {});
    persist();
    return cat;
  }
  if (seg[0] === 'admin' && seg[1] === 'categories' && seg[2] && m === 'DELETE') {
    requireAdmin(req.headers);
    if (db.products.some((p) => p.categoryId === seg[2]))
      throw new MockHttpError(400, 'Cannot delete a category that has products');
    db.categories = db.categories.filter((c) => c.id !== seg[2]);
    persist();
    return { ok: true };
  }

  // ── PRODUCTS (public) ─────────────────────────────────────────
  if (path === '/products' && m === 'GET') {
    const f: ProductFilters = {
      q: params.get('q') ?? undefined,
      category: params.get('category') ?? undefined,
      materials: params.getAll('material') as ProductFilters['materials'],
      occasions: params.getAll('occasion') as ProductFilters['occasions'],
      minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      sort: (params.get('sort') as ProductFilters['sort']) ?? 'newest',
      featured: params.get('featured') === 'true' || undefined,
      trending: params.get('trending') === 'true' || undefined,
      bestSeller: params.get('bestSeller') === 'true' || undefined,
      newArrival: params.get('newArrival') === 'true' || undefined,
      page: params.get('page') ? Number(params.get('page')) : 0,
      size: params.get('size') ? Number(params.get('size')) : 12,
    };
    const filtered = filterProducts(db.products, f).map(publicProduct);
    return paginate(filtered, f.page, f.size);
  }

  if (seg[0] === 'products' && seg[1] === 'slug' && seg[2] && m === 'GET') {
    const prod = db.products.find((p) => p.slug === seg[2] && p.active);
    if (!prod) throw new MockHttpError(404, 'Product not found');
    return publicProduct(prod);
  }

  if (seg[0] === 'products' && seg[1] && seg[2] === 'related' && m === 'GET') {
    const prod = db.products.find((p) => p.id === seg[1]);
    if (!prod) return [];
    return db.products
      .filter((p) => p.active && p.categoryId === prod.categoryId && p.id !== prod.id)
      .slice(0, 8)
      .map(publicProduct);
  }

  if (seg[0] === 'products' && seg[1] && m === 'GET') {
    const prod = db.products.find((p) => p.id === seg[1] && p.active);
    if (!prod) throw new MockHttpError(404, 'Product not found');
    return publicProduct(prod);
  }

  // ── REVIEWS ───────────────────────────────────────────────────
  if (seg[0] === 'products' && seg[1] && seg[2] === 'reviews' && m === 'GET') {
    return db.reviews
      .filter((r) => r.productId === seg[1] && r.approved)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  if (seg[0] === 'products' && seg[1] && seg[2] === 'reviews' && m === 'POST') {
    const user = requireAuth(req.headers);
    const prod = db.products.find((p) => p.id === seg[1]);
    if (!prod) throw new MockHttpError(404, 'Product not found');
    const review: Review = {
      id: uid('rev_'),
      productId: prod.id,
      productName: prod.name,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      rating: body.rating,
      title: body.title,
      comment: body.comment,
      approved: false,
      createdAt: new Date().toISOString(),
    };
    db.reviews.push(review);
    recomputeRating(prod.id);
    persist();
    return review;
  }
  if (seg[0] === 'reviews' && seg[1] && m === 'PUT') {
    const user = requireAuth(req.headers);
    const review = db.reviews.find((r) => r.id === seg[1] && r.userId === user.id);
    if (!review) throw new MockHttpError(404, 'Review not found');
    Object.assign(review, { rating: body.rating, title: body.title, comment: body.comment, approved: false });
    recomputeRating(review.productId);
    persist();
    return review;
  }
  if (seg[0] === 'reviews' && seg[1] && m === 'DELETE') {
    const user = requireAuth(req.headers);
    const review = db.reviews.find((r) => r.id === seg[1]);
    if (!review) throw new MockHttpError(404, 'Review not found');
    if (review.userId !== user.id && user.role !== 'ADMIN')
      throw new MockHttpError(403, 'Not allowed');
    db.reviews = db.reviews.filter((r) => r.id !== seg[1]);
    recomputeRating(review.productId);
    persist();
    return { ok: true };
  }
  if (path === '/reviews/mine' && m === 'GET') {
    const user = requireAuth(req.headers);
    return db.reviews.filter((r) => r.userId === user.id);
  }

  // ── COUPONS ───────────────────────────────────────────────────
  if (path === '/coupons/validate' && m === 'POST') {
    const coupon = db.coupons.find((c) => c.code.toUpperCase() === String(body.code).toUpperCase());
    if (!coupon || !coupon.active) throw new MockHttpError(404, 'Invalid coupon code');
    if (new Date(coupon.expiresAt) < new Date())
      throw new MockHttpError(400, 'This coupon has expired');
    if (coupon.usedCount >= coupon.usageLimit)
      throw new MockHttpError(400, 'This coupon has reached its usage limit');
    if (body.subtotal < coupon.minOrderAmount)
      throw new MockHttpError(
        400,
        `Add items worth ₹${coupon.minOrderAmount - body.subtotal} more to use this coupon`,
      );
    const discount =
      coupon.type === 'PERCENT'
        ? Math.min(Math.round((body.subtotal * coupon.value) / 100), coupon.maxDiscount ?? Infinity)
        : coupon.value;
    return { coupon, discount };
  }

  // ── BANNERS ───────────────────────────────────────────────────
  if (path === '/banners' && m === 'GET') {
    return db.banners.filter((b) => b.active).sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // ── ORDERS ────────────────────────────────────────────────────
  if (path === '/orders' && m === 'GET') {
    const user = requireAuth(req.headers);
    return db.orders
      .filter((o) => o.userId === user.id)
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  if (seg[0] === 'orders' && seg[1] && m === 'GET') {
    const user = requireAuth(req.headers);
    const order = db.orders.find((o) => o.id === seg[1] || o.orderNumber === seg[1]);
    if (!order) throw new MockHttpError(404, 'Order not found');
    if (order.userId !== user.id && user.role !== 'ADMIN')
      throw new MockHttpError(403, 'Not allowed');
    return order;
  }
  // ── CHECKOUT SAGA (mock) ──────────────────────────────────────
  if (path === '/checkout/initiate' && m === 'POST') {
    const user = requireAuth(req.headers);
    const order = createOrder(user.id, `${user.firstName} ${user.lastName}`, user.email, body);
    const requiresPayment = body.paymentMethod === 'RAZORPAY';
    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      paymentMethod: order.paymentMethod,
      requiresPayment,
      razorpayOrderId: requiresPayment ? `order_MOCK${uid()}` : null,
      amount: requiresPayment ? Math.round(order.total * 100) : null,
      currency: requiresPayment ? 'INR' : null,
      keyId: requiresPayment ? 'rzp_test_mock' : null,
    };
  }
  if (path === '/checkout/confirm' && m === 'POST') {
    const user = requireAuth(req.headers);
    const order = db.orders.find((o) => o.id === body.orderId && o.userId === user.id);
    if (!order) throw new MockHttpError(404, 'Order not found');
    if (order.status === 'CONFIRMED') return order; // idempotent
    if (order.status !== 'PENDING_PAYMENT')
      throw new MockHttpError(400, 'This order is not awaiting payment');
    order.status = 'CONFIRMED';
    order.paymentStatus = 'PAID';
    order.paymentId = body.razorpayPaymentId ?? `pay_MOCK${uid()}`;
    order.timeline.push({ status: 'CONFIRMED', at: new Date().toISOString(), note: 'Payment received' });
    persist();
    return order;
  }
  if (seg[0] === 'checkout' && seg[1] && seg[2] === 'cancel' && m === 'POST') {
    const user = requireAuth(req.headers);
    const order = db.orders.find((o) => o.id === seg[1] && o.userId === user.id);
    if (!order) throw new MockHttpError(404, 'Order not found');
    if (order.status === 'PENDING_PAYMENT') {
      order.status = 'PAYMENT_FAILED';
      order.paymentStatus = 'FAILED';
      order.timeline.push({
        status: 'PAYMENT_FAILED',
        at: new Date().toISOString(),
        note: 'Payment cancelled by customer',
      });
      order.items.forEach((it) => {
        const p = db.products.find((pp) => pp.id === it.productId);
        if (p) p.stock += it.quantity;
      });
    }
    persist();
    return { ok: true };
  }
  if (seg[0] === 'orders' && seg[1] && seg[2] === 'cancel' && m === 'POST') {
    const user = requireAuth(req.headers);
    const order = db.orders.find((o) => o.id === seg[1] && o.userId === user.id);
    if (!order) throw new MockHttpError(404, 'Order not found');
    if (['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(order.status))
      throw new MockHttpError(400, `Cannot cancel an order that is ${ORDER_STATUS_LABEL[order.status]}`);
    order.status = 'CANCELLED';
    order.timeline.push({ status: 'CANCELLED', at: new Date().toISOString(), note: body.reason ?? 'Cancelled by customer' });
    if (order.paymentStatus === 'PAID') order.paymentStatus = 'REFUNDED';
    persist();
    return order;
  }

  // ── ADMIN: dashboard ──────────────────────────────────────────
  if (path === '/admin/dashboard' && m === 'GET') {
    requireAdmin(req.headers);
    return buildDashboard();
  }

  // ── ADMIN: products ───────────────────────────────────────────
  if (path === '/admin/products' && m === 'GET') {
    requireAdmin(req.headers);
    const q = (params.get('q') ?? '').toLowerCase();
    let list = db.products;
    if (q) list = list.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    list = [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return paginate(list, Number(params.get('page') ?? 0), Number(params.get('size') ?? 10));
  }
  if (path === '/admin/products' && m === 'POST') {
    requireAdmin(req.headers);
    const cat = db.categories.find((c) => c.id === body.categoryId);
    const prod: Product = {
      id: uid('prd_'),
      name: body.name,
      slug: `${slugify(body.name)}-${uid()}`,
      description: body.description ?? '',
      categoryId: body.categoryId,
      categoryName: cat?.name ?? '',
      price: Number(body.price),
      mrp: Number(body.mrp ?? body.price),
      sku: body.sku ?? `VC-${uid().toUpperCase()}`,
      stock: Number(body.stock ?? 0),
      images:
        (body.images ?? []).map((url: string, i: number) => ({
          id: uid('img_'),
          url,
          altText: body.name,
          sortOrder: i,
        })) ?? [],
      variants: body.variants ?? [],
      attributes: body.attributes,
      rating: 0,
      reviewCount: 0,
      featured: body.featured ?? false,
      trending: body.trending ?? false,
      bestSeller: body.bestSeller ?? false,
      newArrival: body.newArrival ?? true,
      active: body.active ?? true,
      supplierName: body.supplierName,
      supplierUrl: body.supplierUrl,
      costPrice: body.costPrice ? Number(body.costPrice) : undefined,
      createdAt: new Date().toISOString(),
    };
    db.products.unshift(prod);
    persist();
    return prod;
  }
  if (seg[0] === 'admin' && seg[1] === 'products' && seg[2] && m === 'PUT') {
    requireAdmin(req.headers);
    const prod = db.products.find((p) => p.id === seg[2]);
    if (!prod) throw new MockHttpError(404, 'Product not found');
    const cat = body.categoryId ? db.categories.find((c) => c.id === body.categoryId) : null;
    Object.assign(prod, body, cat ? { categoryName: cat.name } : {});
    if (Array.isArray(body.images) && typeof body.images[0] === 'string') {
      prod.images = body.images.map((url: string, i: number) => ({
        id: uid('img_'),
        url,
        altText: prod.name,
        sortOrder: i,
      }));
    }
    persist();
    return prod;
  }
  if (seg[0] === 'admin' && seg[1] === 'products' && seg[2] && m === 'DELETE') {
    requireAdmin(req.headers);
    db.products = db.products.filter((p) => p.id !== seg[2]);
    persist();
    return { ok: true };
  }

  // ── ADMIN: orders ─────────────────────────────────────────────
  if (path === '/admin/orders' && m === 'GET') {
    requireAdmin(req.headers);
    const status = params.get('status');
    let list = [...db.orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    if (status) list = list.filter((o) => o.status === status);
    return paginate(list, Number(params.get('page') ?? 0), Number(params.get('size') ?? 10));
  }
  if (seg[0] === 'admin' && seg[1] === 'orders' && seg[2] && seg[3] === 'status' && m === 'PUT') {
    requireAdmin(req.headers);
    const order = db.orders.find((o) => o.id === seg[2]);
    if (!order) throw new MockHttpError(404, 'Order not found');
    order.status = body.status as OrderStatus;
    if (body.trackingNumber) order.trackingNumber = body.trackingNumber;
    if (body.courierName) order.courierName = body.courierName;
    order.timeline.push({ status: order.status, at: new Date().toISOString(), note: body.note ?? '' });
    if (order.status === 'DELIVERED' && order.paymentMethod === 'COD') order.paymentStatus = 'PAID';
    persist();
    return order;
  }

  // ── ADMIN: customers ──────────────────────────────────────────
  if (path === '/admin/customers' && m === 'GET') {
    requireAdmin(req.headers);
    return db.users
      .filter((u) => u.role === 'CUSTOMER')
      .map((u) => {
        const orders = db.orders.filter((o) => o.userId === u.id);
        return {
          ...stripPassword(u),
          orderCount: orders.length,
          totalSpent: orders.filter((o) => o.status !== 'CANCELLED').reduce((s, o) => s + o.total, 0),
        };
      });
  }
  if (seg[0] === 'admin' && seg[1] === 'customers' && seg[2] && seg[3] === 'status' && m === 'PUT') {
    requireAdmin(req.headers);
    const user = db.users.find((u) => u.id === seg[2]);
    if (!user) throw new MockHttpError(404, 'Customer not found');
    user.blocked = body.blocked;
    persist();
    return stripPassword(user);
  }

  // ── ADMIN: coupons ────────────────────────────────────────────
  if (path === '/admin/coupons' && m === 'GET') {
    requireAdmin(req.headers);
    return db.coupons;
  }
  if (path === '/admin/coupons' && m === 'POST') {
    requireAdmin(req.headers);
    const coupon: Coupon = {
      id: uid('cpn_'),
      code: String(body.code).toUpperCase(),
      description: body.description,
      type: body.type,
      value: Number(body.value),
      minOrderAmount: Number(body.minOrderAmount ?? 0),
      maxDiscount: body.maxDiscount ? Number(body.maxDiscount) : undefined,
      expiresAt: body.expiresAt,
      usageLimit: Number(body.usageLimit ?? 1000),
      usedCount: 0,
      active: body.active ?? true,
    };
    db.coupons.push(coupon);
    persist();
    return coupon;
  }
  if (seg[0] === 'admin' && seg[1] === 'coupons' && seg[2] && m === 'PUT') {
    requireAdmin(req.headers);
    const coupon = db.coupons.find((c) => c.id === seg[2]);
    if (!coupon) throw new MockHttpError(404, 'Coupon not found');
    Object.assign(coupon, body, body.code ? { code: String(body.code).toUpperCase() } : {});
    persist();
    return coupon;
  }
  if (seg[0] === 'admin' && seg[1] === 'coupons' && seg[2] && m === 'DELETE') {
    requireAdmin(req.headers);
    db.coupons = db.coupons.filter((c) => c.id !== seg[2]);
    persist();
    return { ok: true };
  }

  // ── ADMIN: reviews ────────────────────────────────────────────
  if (path === '/admin/reviews' && m === 'GET') {
    requireAdmin(req.headers);
    return [...db.reviews].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  if (seg[0] === 'admin' && seg[1] === 'reviews' && seg[2] && seg[3] === 'approve' && m === 'PUT') {
    requireAdmin(req.headers);
    const review = db.reviews.find((r) => r.id === seg[2]);
    if (!review) throw new MockHttpError(404, 'Review not found');
    review.approved = body.approved ?? true;
    recomputeRating(review.productId);
    persist();
    return review;
  }

  // ── ADMIN: banners ────────────────────────────────────────────
  if (path === '/admin/banners' && m === 'GET') {
    requireAdmin(req.headers);
    return [...db.banners].sort((a, b) => a.sortOrder - b.sortOrder);
  }
  if (path === '/admin/banners' && m === 'POST') {
    requireAdmin(req.headers);
    const banner: Banner = {
      id: uid('ban_'),
      title: body.title,
      subtitle: body.subtitle,
      imageUrl: body.imageUrl,
      ctaLabel: body.ctaLabel,
      ctaLink: body.ctaLink,
      placement: body.placement ?? 'HERO',
      active: body.active ?? true,
      sortOrder: db.banners.length + 1,
    };
    db.banners.push(banner);
    persist();
    return banner;
  }
  if (seg[0] === 'admin' && seg[1] === 'banners' && seg[2] && m === 'PUT') {
    requireAdmin(req.headers);
    const banner = db.banners.find((b) => b.id === seg[2]);
    if (!banner) throw new MockHttpError(404, 'Banner not found');
    Object.assign(banner, body);
    persist();
    return banner;
  }
  if (seg[0] === 'admin' && seg[1] === 'banners' && seg[2] && m === 'DELETE') {
    requireAdmin(req.headers);
    db.banners = db.banners.filter((b) => b.id !== seg[2]);
    persist();
    return { ok: true };
  }

  // ── ADMIN: settings ───────────────────────────────────────────
  if (path === '/admin/settings' && m === 'GET') {
    requireAdmin(req.headers);
    return db.settings;
  }
  if (path === '/admin/settings' && m === 'PUT') {
    requireAdmin(req.headers);
    Object.assign(db.settings, body);
    persist();
    return db.settings;
  }

  // ── DEV: reset ────────────────────────────────────────────────
  if (path === '/dev/reset' && m === 'POST') {
    resetDB();
    return { ok: true };
  }

  throw new MockHttpError(404, `Mock endpoint not found: ${m} ${path}`);
}

// ── Helpers that mutate the DB ──────────────────────────────────

function recomputeRating(productId: string): void {
  const db = getDB();
  const prod = db.products.find((p) => p.id === productId);
  if (!prod) return;
  const approved = db.reviews.filter((r) => r.productId === productId && r.approved);
  prod.reviewCount = approved.length;
  prod.rating = approved.length
    ? Math.round((approved.reduce((s, r) => s + r.rating, 0) / approved.length) * 10) / 10
    : 0;
}

interface CreateOrderBody {
  items: { productId: string; quantity: number; variantId?: string; variantLabel?: string }[];
  shippingAddress: Order['shippingAddress'];
  paymentMethod: Order['paymentMethod'];
  couponCode?: string;
  paymentId?: string;
}

function createOrder(userId: string, name: string, email: string, body: CreateOrderBody): Order {
  const db = getDB();
  if (!body.items?.length) throw new MockHttpError(400, 'Your cart is empty');

  const items = body.items.map((it) => {
    const prod = db.products.find((p) => p.id === it.productId);
    if (!prod) throw new MockHttpError(404, `Product ${it.productId} no longer available`);
    if (prod.stock < it.quantity)
      throw new MockHttpError(400, `Only ${prod.stock} left of ${prod.name}`);
    const variant = it.variantId ? prod.variants.find((v) => v.id === it.variantId) : undefined;
    return {
      productId: prod.id,
      name: prod.name,
      imageUrl: prod.images[0].url,
      price: prod.price + (variant?.priceDelta ?? 0),
      quantity: it.quantity,
      variantLabel: it.variantLabel ?? (variant ? `${variant.name}: ${variant.value}` : undefined),
      _prod: prod,
    };
  });

  const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);

  let discount = 0;
  if (body.couponCode) {
    const coupon = db.coupons.find(
      (c) => c.code.toUpperCase() === body.couponCode!.toUpperCase() && c.active,
    );
    if (coupon && subtotal >= coupon.minOrderAmount) {
      discount =
        coupon.type === 'PERCENT'
          ? Math.min(Math.round((subtotal * coupon.value) / 100), coupon.maxDiscount ?? Infinity)
          : coupon.value;
      coupon.usedCount += 1;
    }
  }

  const shippingFee = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal - discount + shippingFee;
  const now = new Date().toISOString();

  // Decrement stock
  items.forEach((it) => {
    it._prod.stock = Math.max(0, it._prod.stock - it.quantity);
  });

  const isCod = body.paymentMethod === 'COD';
  const order: Order = {
    id: uid('ord_'),
    orderNumber: `RTN${Date.now().toString().slice(-8)}`,
    userId,
    customerName: name,
    customerEmail: email,
    items: items.map(({ _prod, ...rest }) => {
      void _prod;
      return rest;
    }),
    subtotal,
    discount,
    shippingFee,
    total,
    couponCode: body.couponCode,
    paymentMethod: body.paymentMethod,
    // COD confirms immediately; Razorpay stays pending until payment is confirmed.
    paymentStatus: isCod ? 'COD_PENDING' : 'PENDING',
    paymentId: body.paymentId,
    status: isCod ? 'CONFIRMED' : 'PENDING_PAYMENT',
    shippingAddress: body.shippingAddress,
    timeline: isCod
      ? [
          { status: 'PENDING', at: now, note: 'Order placed' },
          { status: 'CONFIRMED', at: now, note: 'COD order confirmed' },
        ]
      : [{ status: 'PENDING', at: now, note: 'Order placed — awaiting payment' }],
    createdAt: now,
  };
  db.orders.unshift(order);
  persist();
  return order;
}

function buildDashboard(): DashboardStats {
  const db = getDB();
  const paidOrders = db.orders.filter((o) => o.status !== 'CANCELLED');
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const revenueThisMonth = paidOrders
    .filter((o) => new Date(o.createdAt) >= monthStart)
    .reduce((s, o) => s + o.total, 0);

  // Revenue by day (last 14 days)
  const byDay: Record<string, { revenue: number; orders: number }> = {};
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 3600 * 1000).toISOString().slice(0, 10);
    byDay[d] = { revenue: 0, orders: 0 };
  }
  paidOrders.forEach((o) => {
    const d = o.createdAt.slice(0, 10);
    if (byDay[d]) {
      byDay[d].revenue += o.total;
      byDay[d].orders += 1;
    }
  });

  // Sales by category
  const catRevenue: Record<string, number> = {};
  const prodSales: Record<string, { name: string; units: number; revenue: number }> = {};
  paidOrders.forEach((o) => {
    o.items.forEach((it) => {
      const prod = db.products.find((p) => p.id === it.productId);
      const catName = prod?.categoryName ?? 'Other';
      catRevenue[catName] = (catRevenue[catName] ?? 0) + it.price * it.quantity;
      const rec = prodSales[it.productId] ?? { name: it.name, units: 0, revenue: 0 };
      rec.units += it.quantity;
      rec.revenue += it.price * it.quantity;
      prodSales[it.productId] = rec;
    });
  });

  return {
    totalRevenue,
    revenueThisMonth,
    totalOrders: db.orders.length,
    pendingOrders: db.orders.filter((o) =>
      ['PENDING', 'CONFIRMED', 'PROCESSING', 'PLACED_WITH_SUPPLIER'].includes(o.status),
    ).length,
    totalCustomers: db.users.filter((u) => u.role === 'CUSTOMER').length,
    totalProducts: db.products.filter((p) => p.active).length,
    lowStockCount: db.products.filter((p) => p.active && p.stock < 5).length,
    averageOrderValue: paidOrders.length ? Math.round(totalRevenue / paidOrders.length) : 0,
    revenueByDay: Object.entries(byDay).map(([date, v]) => ({ date, ...v })),
    salesByCategory: Object.entries(catRevenue)
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6),
    topProducts: Object.entries(prodSales)
      .map(([productId, v]) => ({ productId, name: v.name, unitsSold: v.units, revenue: v.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5),
    recentOrders: [...db.orders]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 5),
  };
}
