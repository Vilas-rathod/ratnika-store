# Ratnika — Backend

Enterprise-grade REST API for the **Ratnika** jewellery eCommerce + dropshipping platform.
Built with **Java 21, Spring Boot 3.3, Spring Security (JWT), Spring Data JPA, PostgreSQL, Redis,
MapStruct, Flyway-ready** and documented with **OpenAPI / Swagger**. Headquartered in Pune, India. 💍

> This is the **backend only**. It implements the exact API contract the
> [frontend](../frontend) expects — the `{ success, message, data }` envelope and
> `{ content, page, size, totalElements, totalPages }` pagination. Point the frontend at it by
> setting `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL=http://localhost:8080/api/v1`.

---

## 🧱 Tech Stack

| Area | Choice |
|------|--------|
| Language / Runtime | Java 21 (LTS) |
| Framework | Spring Boot 3.3 |
| Security | Spring Security + JWT access tokens + rotating refresh tokens |
| Persistence | Spring Data JPA / Hibernate 6, PostgreSQL 16 |
| Caching | Redis (Spring Cache) |
| Mapping | MapStruct 1.6 |
| Boilerplate | Lombok |
| Migrations | Flyway (wired, opt-in) |
| Docs | springdoc-openapi (Swagger UI) |
| Payments | Razorpay + COD |
| Mail | Spring Mail (MailHog in dev) |
| Monitoring | Actuator + Micrometer + Prometheus |
| Build | Maven |

---

## 🏛️ Architecture — Package by Feature

A modular monolith organised by **feature**, with clean layering inside each module
(`controller → service → repository`, plus `entity`, `dto`, `mapper`). This is the structure
modern product teams use — high cohesion, low coupling, and a clear path to extract microservices.

```
src/main/java/com/ratnika/
├── RatnikaApplication.java
├── config/                 # Security, OpenAPI, Cache, Async, Web, @ConfigurationProperties
│   └── props/              # Typed AppProperties (app.*)
├── common/                 # Cross-cutting: ApiResponse, PageResponse, exceptions, BaseEntity, utils
├── security/               # JwtService, JwtAuthenticationFilter, UserPrincipal, RateLimitFilter…
├── bootstrap/              # DataSeeder + offline SVG placeholder images
│
├── auth/                   # Register, login, refresh rotation, OTP, password reset  (entity/repo/dto/service/controller)
├── user/                   # Profile (/users/me)
├── address/                # Delivery addresses CRUD
├── catalog/
│   ├── category/           # Categories
│   ├── product/            # Products (+ images, variants, attributes, JPA Specifications)
│   ├── review/             # Ratings & reviews
│   └── banner/             # Hero & promo banners
├── coupon/                 # Coupon validation + discount engine
├── order/                  # Orders (place, cancel, tracking timeline, status workflow)
├── payment/                # Razorpay order creation & signature verification
├── notification/           # Async transactional email
└── admin/                  # Admin façade: dashboard analytics, product/category/order/customer/
                            #   coupon/review/banner management, store settings
```

**Layering rules**
- Controllers are thin — validate input, delegate to services, wrap in `ApiResponse`.
- Services own transactions (`@Transactional`) and business rules.
- Entities never leak to the API; MapStruct maps to DTOs. The **customer product view hides
  supplier & cost-price fields** (dropshipping data) — enforced by a separate mapper method.
- The global `@RestControllerAdvice` converts every exception into the standard envelope.

---

## 🔐 Security

- **JWT access tokens** (short-lived, 15 min) signed with HMAC-SHA256.
- **Refresh-token rotation** — opaque tokens persisted in the DB; each use revokes the old and
  issues a new one (reuse of a revoked token is rejected).
- **BCrypt** password hashing.
- **Role-based access control** — `/api/v1/admin/**` requires `ROLE_ADMIN`; method-level
  `@EnableMethodSecurity` available.
- **CORS** configured from `app.cors.allowed-origins`.
- **Rate limiting** on auth endpoints (sliding window; swap for Redis in multi-instance setups).
- **Secure headers** (X-Content-Type-Options, X-Frame-Options: DENY, Referrer-Policy) + stateless
  sessions.
- Bean-Validation (`jakarta.validation`) on every request DTO.

---

## 🚀 Getting Started

### Prerequisites
- **JDK 21**
- **Maven 3.9+**
- **Docker** (for PostgreSQL, Redis, MailHog) — or local installs

### 1. Start infrastructure
From the repository root (`../`):
```bash
docker compose up -d postgres redis mailhog
```

### 2. Configure
```bash
cp .env.example .env      # optional — sensible dev defaults are baked in
```

### 3. Run
```bash
mvn spring-boot:run
# API   → http://localhost:8080/api/v1
# Docs  → http://localhost:8080/swagger-ui.html
# Health→ http://localhost:8080/actuator/health
```

On first run (dev profile) the **DataSeeder** populates demo data:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@ratnika.in` | `Admin@123` |
| Customer | `customer@ratnika.in` | `Customer@123` |

…plus 11 categories, 66 products, coupons (`WELCOME15`, `FESTIVE500`, `SILVER10`) and banners —
the same dataset as the frontend mock, so both stacks tell one story.

### Build & test
```bash
mvn clean package     # compiles, runs tests, builds the jar
mvn test              # unit + integration tests (JUnit 5, Mockito, H2)
```

---

## ⚙️ Configuration

All settings are environment-overridable (see [`.env.example`](.env.example)). Key groups:

| Variable | Purpose | Default |
|----------|---------|---------|
| `SPRING_PROFILES_ACTIVE` | `dev` / `prod` | `dev` |
| `DB_URL` / `DB_USERNAME` / `DB_PASSWORD` | PostgreSQL | localhost/ratnika |
| `REDIS_HOST` / `REDIS_PORT` | Redis cache | localhost:6379 |
| `JWT_SECRET` | Base64 256-bit signing key — **override in prod** | dev key |
| `JWT_ACCESS_EXP` / `JWT_REFRESH_EXP` | Token lifetimes (ms) | 15 min / 7 days |
| `MAIL_HOST` / `MAIL_PORT` | SMTP (MailHog in dev) | localhost:1025 |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins | localhost:5173,4173 |
| `RAZORPAY_ENABLED` / `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Payments | disabled |
| `STORAGE_PROVIDER` | `local` / `cloudinary` / `s3` / `minio` | local |

### Database schema strategy
By default **Hibernate manages the schema** (`ddl-auto=update`, Flyway disabled) so the app runs
out of the box. For strict production, adopt Flyway:
1. Generate the schema SQL from the entities (see [`V1__baseline.sql`](src/main/resources/db/migration/V1__baseline.sql)).
2. Set `DDL_AUTO=validate` and `FLYWAY_ENABLED=true`.

### Razorpay
When `RAZORPAY_ENABLED=false` (default), the payment service returns a mock order and accepts any
signature, so the full checkout flow works locally without live keys. Set your keys and enable it
for real payments.

---

## 📚 API Overview

Full interactive docs at **`/swagger-ui.html`**. Base path: `/api/v1`.

| Group | Key endpoints |
|-------|---------------|
| **Auth** | `POST /auth/register` · `/auth/login` · `/auth/refresh` · `/auth/logout` · `/auth/forgot-password` · `/auth/reset-password` · `/auth/verify-otp` · `/auth/resend-otp` · `/auth/change-password` |
| **User** | `GET/PUT /users/me` |
| **Addresses** | `GET/POST /addresses` · `PUT/DELETE /addresses/{id}` |
| **Catalog** | `GET /products` (search/filter/sort/paginate) · `/products/slug/{slug}` · `/products/{id}/related` · `/categories` · `/banners` |
| **Reviews** | `GET/POST /products/{id}/reviews` · `PUT/DELETE /reviews/{id}` · `/reviews/mine` |
| **Coupons** | `POST /coupons/validate` |
| **Orders** | `GET /orders` · `GET /orders/{idOrNumber}` · `POST /orders` · `POST /orders/{id}/cancel` |
| **Payments** | `POST /payments/razorpay/order` · `/payments/razorpay/verify` |
| **Admin** | `/admin/dashboard` · `/admin/products` · `/admin/categories` · `/admin/orders/{id}/status` · `/admin/customers` · `/admin/coupons` · `/admin/reviews` · `/admin/banners` · `/admin/settings` |

**Envelope** — every response:
```json
{ "success": true, "message": "OK", "data": { ... } }
```
**Pagination** — list endpoints accept `page` & `size` and return:
```json
{ "content": [ ... ], "page": 0, "size": 12, "totalElements": 66, "totalPages": 6 }
```

---

## 🔄 Dropshipping Order Flow

```
Customer places order → payment (Razorpay verified / COD) → Order CONFIRMED
   → admin updates status: PROCESSING → PLACED_WITH_SUPPLIER → SHIPPED (+ tracking #)
   → OUT_FOR_DELIVERY → DELIVERED
```
Each transition appends to the order's **timeline** and emails the customer. Supplier name, URL and
cost price live on the product for admin eyes only — never serialised to customers.

---

## 🐳 Docker

```bash
# Build the image (multi-stage; runs as non-root, JRE-only runtime)
docker build -t ratnika-backend .

# Or run the whole stack from the repo root
cd .. && docker compose up -d --build
```
`docker-compose.yml` (repo root) wires **frontend, backend, postgres, redis, minio, mailhog,
prometheus and grafana**.

---

## 📊 Monitoring

- `GET /actuator/health` — liveness/readiness
- `GET /actuator/prometheus` — metrics scraped by Prometheus (`../monitoring/prometheus.yml`)
- Grafana at `http://localhost:3000` (admin/admin) when running via compose

---

## 🧪 Testing

- `CouponServiceTest` — discount engine (percent cap, flat, minimum-order) with Mockito
- `DataSeederTest` — seeds & verifies the full demo dataset against H2 (idempotent)
- `RatnikaApplicationTests` — full application-context smoke test

```bash
mvn test
```

---

## 📄 License

Proprietary — © Ratnika, Pune, India.
