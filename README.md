# Ratnika 💍

Enterprise, production-grade **jewellery eCommerce + dropshipping** platform. Headquartered in
Pune, India.

A full-stack monorepo:

| Folder | Stack | Docs |
|--------|-------|------|
| [`frontend/`](frontend) | React 19 · Vite · TypeScript · Redux Toolkit · TanStack Query · Tailwind v4 · shadcn UI | [frontend/README.md](frontend/README.md) |
| [`backend/`](backend) | Java 21 · Spring Boot 3.3 · Spring Security (JWT) · JPA · PostgreSQL · Redis · MapStruct · OpenAPI | [backend/README.md](backend/README.md) |

The frontend ships with a **localStorage-backed mock API** so it runs standalone, and switches to
the real Spring Boot backend by flipping one env flag. Both stacks share the same demo dataset and
the same API contract (`{ success, message, data }` envelope + paginated lists).

---

## Quick start (whole stack, Docker)

```bash
docker compose up -d --build
```

| Service | URL |
|---------|-----|
| Storefront (frontend) | http://localhost |
| API (backend) | http://localhost:8080/api/v1 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| MinIO console | http://localhost:9001 |
| MailHog | http://localhost:8025 |
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3000 (admin/admin) |

## Quick start (local dev)

```bash
# Backend — needs Postgres + Redis (docker compose up -d postgres redis mailhog)
cd backend && mvn spring-boot:run

# Frontend — standalone mock, or point at the backend
cd frontend && npm install && npm run dev
```

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin (seller) | `admin@ratnika.in` | `Admin@123` |
| Customer | `customer@ratnika.in` | `Customer@123` |

OTP / reset codes in the frontend mock are always `123456`; the backend logs/emails real OTPs
(view them in MailHog).

## Deliverables

Folder structure · database schema (JPA entities) · authentication (JWT + refresh rotation + OTP) ·
Razorpay + COD · email service · Docker & Compose · OpenAPI docs · seed data · monitoring
(Actuator/Prometheus/Grafana) · end-to-end customer & admin workflows.

## License

Proprietary — © Ratnika, Pune, India.
