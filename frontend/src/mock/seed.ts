import type {
  Banner,
  Category,
  Coupon,
  Order,
  Product,
  Review,
  StoreSettings,
  User,
} from '@/types';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE, SUPPORT_EMAIL, SUPPORT_PHONE } from '@/lib/constants';
import { jewelleryImage, bannerImage } from '@/lib/placeholder';
import { slugify } from '@/lib/utils';

// NOTE: Passwords here are plain for the mock only. The real backend
// stores BCrypt hashes and never returns them.
export const seedUsers: (User & { password: string })[] = [
  {
    id: 'usr_admin',
    firstName: 'Ratnika',
    lastName: 'Admin',
    email: 'admin@ratnika.in',
    phone: '+91 90000 00001',
    role: 'ADMIN',
    emailVerified: true,
    blocked: false,
    createdAt: '2025-01-05T09:00:00.000Z',
    password: 'Admin@123',
  },
  {
    id: 'usr_customer',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: 'customer@ratnika.in',
    phone: '+91 90000 00002',
    role: 'CUSTOMER',
    emailVerified: true,
    blocked: false,
    createdAt: '2025-03-12T11:30:00.000Z',
    password: 'Customer@123',
  },
  {
    id: 'usr_priya',
    firstName: 'Priya',
    lastName: 'Nair',
    email: 'priya@example.com',
    phone: '+91 90000 00003',
    role: 'CUSTOMER',
    emailVerified: true,
    blocked: false,
    createdAt: '2025-04-02T08:15:00.000Z',
    password: 'Customer@123',
  },
  {
    id: 'usr_isha',
    firstName: 'Isha',
    lastName: 'Patel',
    email: 'isha@example.com',
    phone: '+91 90000 00004',
    role: 'CUSTOMER',
    emailVerified: false,
    blocked: false,
    createdAt: '2025-05-20T14:45:00.000Z',
    password: 'Customer@123',
  },
];

const categoryDefs: { name: string; motif: string; desc: string }[] = [
  { name: 'Rings', motif: 'ring', desc: 'Statement & everyday rings crafted to shine.' },
  { name: 'Earrings', motif: 'earring', desc: 'Studs, jhumkas & danglers for every occasion.' },
  { name: 'Necklaces', motif: 'necklace', desc: 'Timeless necklaces to elevate any look.' },
  { name: 'Chains', motif: 'chain', desc: 'Delicate to bold chains in premium finishes.' },
  { name: 'Pendants', motif: 'pendant', desc: 'Meaningful pendants with intricate detail.' },
  { name: 'Bangles', motif: 'bangle', desc: 'Traditional & contemporary bangles.' },
  { name: 'Bracelets', motif: 'bracelet', desc: 'Chic bracelets that make a statement.' },
  { name: 'Anklets', motif: 'anklet', desc: 'Playful anklets with a graceful jingle.' },
  { name: 'Mangalsutra', motif: 'mangalsutra', desc: 'Sacred designs, modern craftsmanship.' },
  { name: 'Nose Pins', motif: 'nosepin', desc: 'Subtle sparkle for a classic touch.' },
  { name: 'Jewellery Sets', motif: 'set', desc: 'Perfectly matched sets for grand occasions.' },
];

export const seedCategories: Category[] = categoryDefs.map((c, i) => ({
  id: `cat_${i + 1}`,
  name: c.name,
  slug: slugify(c.name),
  description: c.desc,
  imageUrl: jewelleryImage(c.motif, i, c.name),
  parentId: null,
  active: true,
  sortOrder: i + 1,
}));

const MATERIALS = ['GOLD_PLATED', 'SILVER', 'ARTIFICIAL', 'BRASS'] as const;
const OCCASIONS = ['WEDDING', 'FESTIVE', 'DAILY_WEAR', 'PARTY', 'OFFICE', 'GIFTING'] as const;
const STONES = ['American Diamond', 'Kundan', 'Cubic Zirconia', 'Pearl', 'Ruby', 'Emerald', 'None'];
const COLORS = ['Gold', 'Rose Gold', 'Silver', 'Oxidised', 'Multicolour'];

const adjectives = [
  'Elegant', 'Royal', 'Timeless', 'Ethereal', 'Regal', 'Divine', 'Blossom', 'Celestial',
  'Heritage', 'Aurora', 'Radiant', 'Grace', 'Opulent', 'Serene', 'Meenakari', 'Temple',
];
const nouns = [
  'Charm', 'Bloom', 'Whisper', 'Aura', 'Muse', 'Grace', 'Sparkle', 'Petal', 'Crown',
  'Drift', 'Glow', 'Mystique', 'Legacy', 'Dazzle',
];

function priceFor(seed: number): { price: number; mrp: number; cost: number } {
  const base = 299 + ((seed * 137) % 40) * 75; // 299 .. ~3299
  const mrp = Math.round((base * (1.25 + ((seed % 5) * 0.08))) / 10) * 10;
  const cost = Math.round(base * 0.45);
  return { price: base, mrp, cost };
}

const SUPPLIERS = [
  { name: 'Jaipur Gems Wholesale', url: 'https://supplier.example/jaipur-gems' },
  { name: 'Mumbai Jewel Hub', url: 'https://supplier.example/mumbai-jewel' },
  { name: 'Rajkot Silver Co.', url: 'https://supplier.example/rajkot-silver' },
  { name: 'Delhi Fashion Imports', url: 'https://supplier.example/delhi-fashion' },
];

export function buildProducts(): Product[] {
  const products: Product[] = [];
  let n = 0;
  for (let ci = 0; ci < seedCategories.length; ci++) {
    const category = seedCategories[ci];
    const motif = categoryDefs[ci].motif;
    const perCat = 7;
    for (let p = 0; p < perCat; p++) {
      n++;
      const seed = n;
      const name = `${adjectives[(seed * 3) % adjectives.length]} ${
        nouns[(seed * 5) % nouns.length]
      } ${category.name.replace(/s$/, '')}`;
      const { price, mrp, cost } = priceFor(seed);
      const material = MATERIALS[seed % MATERIALS.length];
      const occasion = OCCASIONS[seed % OCCASIONS.length];
      const stone = STONES[seed % STONES.length];
      const color = COLORS[seed % COLORS.length];
      const rating = Math.round((3.6 + ((seed * 7) % 14) / 10) * 10) / 10; // 3.6 - 5.0
      const reviewCount = 4 + ((seed * 13) % 180);
      const stock = (seed * 17) % 6 === 0 ? (seed % 4) : 12 + ((seed * 11) % 90);
      const supplier = SUPPLIERS[seed % SUPPLIERS.length];
      const slug = `${slugify(name)}-${seed}`;

      const images = [0, 1, 2].map((k) => ({
        id: `img_${seed}_${k}`,
        url: jewelleryImage(motif, seed + k, k === 0 ? category.name : ''),
        altText: `${name} view ${k + 1}`,
        sortOrder: k,
      }));

      const hasVariants = ci === 0 || ci === 5; // rings & bangles get size variants
      const variants = hasVariants
        ? ['14', '16', '18', '20'].map((sz, vi) => ({
            id: `var_${seed}_${vi}`,
            name: 'Size',
            value: sz,
            priceDelta: vi * 40,
            stock: 5 + ((seed + vi) % 20),
            sku: `VC-${seed}-S${sz}`,
          }))
        : [];

      products.push({
        id: `prd_${seed}`,
        name,
        slug,
        description:
          `Discover the ${name.toLowerCase()} — a ${material
            .toLowerCase()
            .replace('_', ' ')} piece finished with ${stone === 'None' ? 'a polished sheen' : stone.toLowerCase() + ' accents'}. ` +
          `Thoughtfully crafted for ${occasion.toLowerCase().replace('_', ' ')} and designed to last. ` +
          `Lightweight at ~${(2 + (seed % 18)).toFixed(1)}g, hypoallergenic and skin-friendly. ` +
          `Comes in a premium Ratnika gift box with a care card.`,
        categoryId: category.id,
        categoryName: category.name,
        price,
        mrp,
        sku: `VC-${category.slug.slice(0, 3).toUpperCase()}-${seed}`,
        stock,
        images,
        variants,
        attributes: {
          material,
          stoneType: stone === 'None' ? undefined : stone,
          weightGrams: Number((2 + (seed % 18)).toFixed(1)),
          color,
          occasion,
        },
        rating,
        reviewCount,
        featured: seed % 6 === 0,
        trending: seed % 5 === 0,
        bestSeller: seed % 7 === 0,
        newArrival: seed % 4 === 0,
        active: true,
        supplierName: supplier.name,
        supplierUrl: supplier.url,
        costPrice: cost,
        createdAt: new Date(Date.now() - seed * 36 * 3600 * 1000).toISOString(),
      });
    }
  }
  return products;
}

export const seedBanners: Banner[] = [
  {
    id: 'ban_1',
    title: 'The Festive Edit',
    subtitle: 'Handcrafted jewellery to light up every celebration. Up to 40% off.',
    imageUrl: bannerImage(0),
    ctaLabel: 'Shop Festive',
    ctaLink: '/shop?occasion=FESTIVE',
    placement: 'HERO',
    active: true,
    sortOrder: 1,
  },
  {
    id: 'ban_2',
    title: 'Bridal Splendour',
    subtitle: 'Complete sets & mangalsutra for your special day.',
    imageUrl: bannerImage(3),
    ctaLabel: 'Explore Bridal',
    ctaLink: '/shop?category=jewellery-sets',
    placement: 'HERO',
    active: true,
    sortOrder: 2,
  },
  {
    id: 'ban_3',
    title: 'Everyday Silver',
    subtitle: '925 sterling-look pieces for daily grace.',
    imageUrl: bannerImage(2),
    ctaLabel: 'Shop Silver',
    ctaLink: '/shop?material=SILVER',
    placement: 'HERO',
    active: true,
    sortOrder: 3,
  },
  {
    id: 'ban_promo_1',
    title: 'First Order? Get 15% Off',
    subtitle: 'Use code WELCOME15 at checkout.',
    imageUrl: bannerImage(4, 1200, 300),
    ctaLabel: 'Grab the Deal',
    ctaLink: '/shop',
    placement: 'PROMO',
    active: true,
    sortOrder: 1,
  },
];

export const seedCoupons: Coupon[] = [
  {
    id: 'cpn_1',
    code: 'WELCOME15',
    description: '15% off your first order (max ₹300)',
    type: 'PERCENT',
    value: 15,
    minOrderAmount: 799,
    maxDiscount: 300,
    expiresAt: '2026-12-31T23:59:59.000Z',
    usageLimit: 1000,
    usedCount: 214,
    active: true,
  },
  {
    id: 'cpn_2',
    code: 'FESTIVE500',
    description: 'Flat ₹500 off on orders above ₹2499',
    type: 'FLAT',
    value: 500,
    minOrderAmount: 2499,
    expiresAt: '2026-11-15T23:59:59.000Z',
    usageLimit: 500,
    usedCount: 88,
    active: true,
  },
  {
    id: 'cpn_3',
    code: 'SILVER10',
    description: '10% off sitewide (max ₹250)',
    type: 'PERCENT',
    value: 10,
    minOrderAmount: 499,
    maxDiscount: 250,
    expiresAt: '2026-09-30T23:59:59.000Z',
    usageLimit: 2000,
    usedCount: 640,
    active: true,
  },
];

export function buildReviews(products: Product[]): Review[] {
  const authors = ['Aarav Sharma', 'Priya Nair', 'Isha Patel', 'Rohan Mehta', 'Sneha Kulkarni', 'Vikram Rao'];
  const titles = ['Absolutely stunning!', 'Great value', 'Loved it', 'Better than expected', 'Perfect gift', 'Good quality'];
  const comments = [
    'The finish is gorgeous and it looks even better in person. Got so many compliments!',
    'Lightweight and comfortable to wear all day. Packaging was premium too.',
    'Exactly as pictured. Delivery was quick and the gift box was lovely.',
    'Beautiful craftsmanship for the price. Would definitely buy again.',
    'My wife loved it. The stonework catches light beautifully.',
    'Good product overall, though the colour is slightly lighter than shown.',
  ];
  const reviews: Review[] = [];
  products.slice(0, 30).forEach((prod, i) => {
    const count = 1 + (i % 3);
    for (let r = 0; r < count; r++) {
      const idx = (i + r) % authors.length;
      reviews.push({
        id: `rev_${prod.id}_${r}`,
        productId: prod.id,
        productName: prod.name,
        userId: `usr_${idx}`,
        userName: authors[idx],
        rating: 4 + ((i + r) % 2),
        title: titles[(i + r) % titles.length],
        comment: comments[(i + r) % comments.length],
        approved: (i + r) % 5 !== 0,
        createdAt: new Date(Date.now() - (i + r) * 52 * 3600 * 1000).toISOString(),
      });
    }
  });
  return reviews;
}

export function buildOrders(products: Product[]): Order[] {
  const statuses = ['DELIVERED', 'SHIPPED', 'PROCESSING', 'CONFIRMED', 'PENDING', 'DELIVERED', 'OUT_FOR_DELIVERY'] as const;
  const orders: Order[] = [];
  for (let i = 0; i < 14; i++) {
    const status = statuses[i % statuses.length];
    const itemCount = 1 + (i % 3);
    const items = Array.from({ length: itemCount }, (_, k) => {
      const prod = products[(i * 3 + k) % products.length];
      const qty = 1 + ((i + k) % 2);
      return {
        productId: prod.id,
        name: prod.name,
        imageUrl: prod.images[0].url,
        price: prod.price,
        quantity: qty,
        variantLabel: prod.variants[0] ? `Size: ${prod.variants[0].value}` : undefined,
      };
    });
    const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const discount = i % 3 === 0 ? Math.round(subtotal * 0.1) : 0;
    const shippingFee = subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal - discount + shippingFee;
    const daysAgo = i * 3 + 1;
    const createdAt = new Date(Date.now() - daysAgo * 24 * 3600 * 1000).toISOString();
    const isCust = i % 2 === 0;
    const method = i % 3 === 0 ? 'COD' : 'RAZORPAY';

    const timeline = [{ status: 'PENDING' as const, at: createdAt, note: 'Order placed' }];
    const flow = ['CONFIRMED', 'PROCESSING', 'PLACED_WITH_SUPPLIER', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    for (const s of flow) {
      if (statuses.indexOf(status) === -1) break;
      timeline.push({
        status: s as (typeof timeline)[number]['status'],
        at: new Date(Date.now() - (daysAgo - timeline.length * 0.4) * 24 * 3600 * 1000).toISOString(),
        note: '',
      });
      if (s === status) break;
    }

    orders.push({
      id: `ord_${1000 + i}`,
      orderNumber: `VC${(20260100 + i).toString()}`,
      userId: isCust ? 'usr_customer' : 'usr_priya',
      customerName: isCust ? 'Aarav Sharma' : 'Priya Nair',
      customerEmail: isCust ? 'customer@ratnika.in' : 'priya@example.com',
      items,
      subtotal,
      discount,
      shippingFee,
      total,
      couponCode: discount ? 'SILVER10' : undefined,
      paymentMethod: method,
      paymentStatus: method === 'COD' ? (status === 'DELIVERED' ? 'PAID' : 'COD_PENDING') : 'PAID',
      paymentId: method === 'RAZORPAY' ? `pay_MOCK${i}xyz` : undefined,
      status,
      shippingAddress: {
        fullName: isCust ? 'Aarav Sharma' : 'Priya Nair',
        phone: isCust ? '+91 90000 00002' : '+91 90000 00003',
        line1: `${12 + i} Koregaon Park`,
        line2: 'Lane 5',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001',
        country: 'India',
        type: 'HOME',
      },
      trackingNumber: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status)
        ? `BLUEDART${900000 + i}IN`
        : undefined,
      courierName: ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(status) ? 'BlueDart' : undefined,
      timeline,
      createdAt,
    });
  }
  return orders;
}

export const seedSettings: StoreSettings = {
  storeName: 'Ratnika',
  supportEmail: SUPPORT_EMAIL,
  supportPhone: SUPPORT_PHONE,
  addressLine: 'Koregaon Park, Pune, Maharashtra 411001, India',
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  shippingFee: SHIPPING_FEE,
  codEnabled: true,
};
