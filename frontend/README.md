# Ratnika — Frontend

Enterprise-grade **jewellery eCommerce + dropshipping** storefront and admin panel.
Built with **React 19, Vite, TypeScript, Redux Toolkit, TanStack Query, Tailwind CSS v4** and
shadcn-style UI. Headquartered in Pune, India. 💍

> This repository contains the **frontend only**. It ships with a fully-functional
> **mock API** (localStorage-backed) so the entire application — storefront, cart, checkout,
> orders, and admin panel — works end-to-end **without a backend**. When the Spring Boot API is
> ready, flip a single environment variable to switch over.

---

## ✨ Features

### Storefront (Customer)
- Home with hero carousel, featured / trending / best-seller / new-arrival sections
- Shop with **search, multi-facet filters** (category, material, occasion, price), sorting & pagination
- Product details with **image zoom**, variants, related products, ratings & reviews
- Wishlist, Cart (with **save-for-later** & free-shipping progress)
- **Checkout** with address selection, coupon codes, **Razorpay** + **COD**
- Orders: tracking timeline, cancel, **downloadable invoice**
- Account: dashboard, profile, change password, multiple addresses, my reviews

### Authentication
- Register, Login, Logout · **JWT access + refresh-token rotation** (auto-refresh on 401)
- Forgot / Reset password · **Email OTP verification** · Change password
- Role-based route guards (Customer / Admin)

### Admin Panel (Seller)
- Dashboard with **revenue/sales analytics** (dependency-free SVG charts)
- Products CRUD (incl. **dropshipping supplier & cost-price fields**), inventory, low-stock alerts
- Categories, Orders (status workflow + tracking), Customers (block/activate)
- Coupons, Reviews (approve/reject), Banners, Store settings

---

## 🧱 Tech Stack

| Area | Choice |
|------|--------|
| Framework | React 19 + Vite 6 + TypeScript 5.8 |
| Routing | React Router 7 (lazy routes + code splitting) |
| Server state | TanStack Query 5 |
| Client state | Redux Toolkit 2 (auth, cart, wishlist, UI — persisted to localStorage) |
| Forms | React Hook Form + Zod |
| HTTP | Axios (interceptors, token refresh) |
| Styling | Tailwind CSS v4, shadcn-style components (Radix UI) |
| Icons / Motion / Toasts | Lucide, Framer Motion, React Toastify |
| Payments | Razorpay Checkout |
| Testing | Vitest + React Testing Library |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js ≥ 20** (LTS) and npm

### Install & Run
```bash
cd frontend
npm install
cp .env.example .env.local   # then edit as needed
npm run dev                  # http://localhost:5173
```

The app starts in **mock mode** (`VITE_USE_MOCK_API=true`) — no backend required.

### Demo Accounts (mock mode)
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@ratnika.in` | `Admin@123` |
| Customer | `customer@ratnika.in` | `Customer@123` |

> OTP / reset codes in mock mode are always **`123456`**.
> The **Login page** has one-click buttons to fill demo credentials.
> Reset demo data anytime from **Admin → Settings → Reset Demo Data**.

### Scripts
```bash
npm run dev        # start dev server
npm run build      # typecheck (tsc -b) + production build
npm run preview    # preview the production build
npm run test       # run vitest once
npm run test:watch # watch mode
```

---

## ⚙️ Environment Variables

All variables are prefixed with `VITE_` (see [`.env.example`](.env.example)):

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL of the Spring Boot REST API | `http://localhost:8080/api/v1` |
| `VITE_USE_MOCK_API` | Use the built-in mock API instead of the real backend | `true` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay publishable key | — |
| `VITE_APP_URL` | Public app URL (SEO / share links) | `http://localhost:5173` |

### Switching to the real backend
1. Start the Spring Boot API (default `http://localhost:8080`).
2. In `.env.local` set:
   ```env
   VITE_USE_MOCK_API=false
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```
3. Restart the dev server.

The frontend expects the backend to return the standard envelope
`{ success, message, data }` and paginated lists as
`{ content, page, size, totalElements, totalPages }`. All expected endpoints are documented in
[`src/services`](src/services) and mirrored by the mock router in
[`src/mock/handlers.ts`](src/mock/handlers.ts) — treat it as the **API contract**.

---

## 📁 Project Structure

```
frontend/
├── public/                     # static assets (favicon)
├── src/
│   ├── components/
│   │   ├── ui/                 # shadcn-style primitives (button, dialog, table…)
│   │   ├── shared/             # ProductCard, Rating, Price, Pagination, OTP…
│   │   ├── home/               # HeroCarousel
│   │   ├── product/            # ProductGallery, ReviewSection
│   │   ├── account/            # AddressFormDialog
│   │   ├── admin/              # StatCard, Charts, ProductFormDialog…
│   │   ├── routing/            # ProtectedRoute, GuestRoute, ScrollToTop
│   │   └── providers/          # ThemeProvider
│   ├── hooks/                  # useAuth, useCatalog, useRazorpay, useDebounce
│   ├── layouts/                # Store / Auth / Account / Admin layouts
│   ├── lib/                    # utils, format, constants, validation (Zod), invoice, placeholder
│   ├── mock/                   # seed data + localStorage DB + API handler (the contract)
│   ├── pages/                  # route pages (public / auth / account / admin)
│   ├── services/               # axios client + typed API service modules
│   ├── store/                  # Redux slices (auth, cart, wishlist, ui)
│   ├── types/                  # shared domain types
│   ├── test/                   # vitest setup
│   ├── App.tsx                 # route tree
│   └── main.tsx                # app entry (providers)
├── Dockerfile                  # multi-stage build → nginx
├── nginx.conf                  # SPA + API proxy + security headers
├── vite.config.ts
└── package.json
```

---

## 🏛️ Architecture Notes

- **Clean separation**: pages → hooks → services → HTTP client. UI never calls axios directly.
- **API abstraction**: `src/services/http.ts` unwraps the response envelope, attaches the JWT,
  and performs **single-flight refresh-token rotation** on `401`. In mock mode it transparently
  routes to `handleMock()` instead — so **every component is backend-agnostic**.
- **State split**: server cache (TanStack Query) vs. client/UI state (Redux). Cart, wishlist,
  auth user and theme are persisted to `localStorage`.
- **Code splitting**: every route is `React.lazy`-loaded; vendor chunks are split
  (react / state / ui) for optimal caching.
- **Type safety**: `strict` TypeScript, Zod schemas validate every form.
- **Accessibility**: Radix primitives, labelled controls, keyboard-navigable dialogs & menus.
- **Theming**: light/dark gold jewellery theme via CSS variables + Tailwind v4 `@theme`.

---

## 🐳 Docker

Build and run the production image (nginx-served static bundle):

```bash
# from the frontend/ directory
docker build \
  --build-arg VITE_USE_MOCK_API=false \
  --build-arg VITE_API_BASE_URL=/api/v1 \
  -t ratnika-frontend .

docker run -p 8080:80 ratnika-frontend
# → http://localhost:8080
```

`nginx.conf` serves the SPA, proxies `/api/*` to the `backend` service, gzips assets,
long-caches hashed files, and sets security headers.

### With docker-compose (full stack)
When the backend is added, drop this service into the root `docker-compose.yml`:

```yaml
services:
  frontend:
    build:
      context: ./frontend
      args:
        VITE_USE_MOCK_API: "false"
        VITE_API_BASE_URL: /api/v1
    ports:
      - "80:80"
    depends_on:
      - backend
```

---

## 🚢 Production Deployment

1. **Build**
   ```bash
   npm run build      # outputs to dist/
   ```
2. **Serve** `dist/` via any static host / CDN (nginx, Vercel, Netlify, S3+CloudFront, etc.).
   Ensure an **SPA fallback** to `index.html` for client-side routing.
3. **Configure** build-time env vars (`VITE_API_BASE_URL`, `VITE_RAZORPAY_KEY_ID`,
   `VITE_USE_MOCK_API=false`).
4. **HTTPS** is required for Razorpay live checkout.
5. Recommended headers (already in `nginx.conf`): HSTS, `X-Content-Type-Options`,
   `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.

---

## 🧪 Testing

```bash
npm run test
```
Includes unit tests for currency/formatting helpers, the cart reducer, and the `Price` component.
Extend under `src/**/*.test.ts(x)`.

---

## 🔌 API Contract (for the backend team)

The mock router in [`src/mock/handlers.ts`](src/mock/handlers.ts) is the source of truth for
routes, payloads, and responses. Key groups:

| Group | Examples |
|-------|----------|
| Auth | `POST /auth/register`, `/auth/login`, `/auth/refresh`, `/auth/reset-password`, `/auth/verify-otp` |
| Catalog | `GET /products`, `/products/slug/{slug}`, `/products/{id}/related`, `/categories`, `/banners` |
| Reviews | `GET/POST /products/{id}/reviews`, `PUT/DELETE /reviews/{id}` |
| Cart/Orders | `POST /orders`, `GET /orders`, `POST /orders/{id}/cancel`, `POST /coupons/validate` |
| Payments | `POST /payments/razorpay/order`, `/payments/razorpay/verify` |
| Account | `GET/PUT /users/me`, `GET/POST/PUT/DELETE /addresses` |
| Admin | `/admin/dashboard`, `/admin/products`, `/admin/orders/{id}/status`, `/admin/customers`, `/admin/coupons`, `/admin/reviews`, `/admin/banners`, `/admin/settings` |

All list endpoints accept `page`, `size` and return the pagination envelope.
Customer-facing product responses **must omit** supplier/cost fields (the mock enforces this).

---

## 📄 License

Proprietary — © Ratnika, Pune, India.
