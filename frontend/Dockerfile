# ── Stage 1: Build ───────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

# Build-time configuration (baked into the static bundle)
ARG VITE_API_BASE_URL=/api/v1
ARG VITE_USE_MOCK_API=false
ARG VITE_RAZORPAY_KEY_ID=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_USE_MOCK_API=$VITE_USE_MOCK_API \
    VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID

COPY . .
RUN npm run build

# ── Stage 2: Serve with nginx ────────────────────────────────────
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
# Use 127.0.0.1 (IPv4), not localhost — nginx listens on IPv4 only, and
# localhost also resolves to ::1 (IPv6) inside the container, which would fail.
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
