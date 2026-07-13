import type {
  Address,
  Banner,
  Category,
  Coupon,
  Order,
  Product,
  Review,
  StoreSettings,
  User,
} from '@/types';
import {
  buildOrders,
  buildProducts,
  buildReviews,
  seedBanners,
  seedCategories,
  seedCoupons,
  seedSettings,
  seedUsers,
} from './seed';

const DB_KEY = 'ratnika_mock_db_v1';

export interface MockDB {
  users: (User & { password: string })[];
  addresses: Address[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  banners: Banner[];
  settings: StoreSettings;
  // Verification / reset tokens keyed by email → code
  otps: Record<string, string>;
}

function build(): MockDB {
  const products = buildProducts();
  return {
    users: structuredClone(seedUsers),
    addresses: [
      {
        id: 'adr_1',
        userId: 'usr_customer',
        fullName: 'Aarav Sharma',
        phone: '+91 90000 00002',
        line1: '12 Koregaon Park',
        line2: 'Lane 5',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        country: 'India',
        type: 'HOME',
        isDefault: true,
      },
    ],
    categories: structuredClone(seedCategories),
    products,
    orders: buildOrders(products),
    reviews: buildReviews(products),
    coupons: structuredClone(seedCoupons),
    banners: structuredClone(seedBanners),
    settings: structuredClone(seedSettings),
    otps: {},
  };
}

let cache: MockDB | null = null;

export function getDB(): MockDB {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) {
      cache = JSON.parse(raw) as MockDB;
      return cache;
    }
  } catch {
    /* ignore corrupt storage */
  }
  cache = build();
  persist();
  return cache;
}

export function persist(): void {
  if (!cache) return;
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(cache));
  } catch {
    /* storage full / unavailable — keep in-memory */
  }
}

export function resetDB(): void {
  cache = build();
  persist();
}
