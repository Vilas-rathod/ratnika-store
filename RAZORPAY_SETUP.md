# Razorpay — Going Live (real keys)

The checkout saga is fully wired for Razorpay. To switch from the built-in mock
gateway to real payments you only set **environment variables** — no code changes.

> 🔒 Never commit secrets. `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET`
> stay on the **backend** only. The browser only ever receives the publishable
> **key id** (returned by the backend at `/checkout/initiate`).

---

## 1. Get your keys (test mode first)

Razorpay Dashboard → **Settings → API Keys → Generate Test Key**. You get:
- **Key Id** — `rzp_test_xxxxxxxxxxxxxx` (publishable, safe for the browser)
- **Key Secret** — shown once; copy it (backend only)

Use **Test** keys until KYC is approved, then repeat with **Live** keys (`rzp_live_…`).

---

## 2. Backend — set env vars

The backend reads these (see `backend/src/main/resources/application.yml`):

| Variable | Value |
|----------|-------|
| `RAZORPAY_ENABLED` | `true` |
| `RAZORPAY_KEY_ID` | `rzp_test_xxxxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | your key secret |
| `RAZORPAY_WEBHOOK_SECRET` | a secret you choose in step 4 |

**Where to put them (pick one):**

- **IntelliJ** → Run/Debug Configurations → your Spring Boot app →
  *Environment variables* → add each `NAME=VALUE` (semicolon-separated).
- **OS / shell** (PowerShell): `setx RAZORPAY_ENABLED true` (then reopen the shell), or
  set them in the terminal you launch Maven from.
- **A gitignored local override** — create `backend/src/main/resources/application-local.yml`,
  put the values there, and run with `SPRING_PROFILES_ACTIVE=dev,local`. Add
  `application-local.yml` to `.gitignore` so secrets never get committed.

Restart the backend after setting them.

---

## 3. Frontend — point at the real gateway

Edit `frontend/.env.local`:
```env
VITE_USE_MOCK_API=false
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx   # same key id (publishable)
```
Then **restart** the Vite dev server (`npm run dev`) — env vars are read at startup.

> The frontend actually uses the key id the backend returns, so this is a
> fallback — but set it for clarity. `VITE_RAZORPAY_KEY_ID` must be the
> publishable key id, never the secret.

---

## 4. Webhook (authoritative payment confirmation)

The webhook is the source of truth (handles captures, failures, refunds, and
network drop-offs after the user pays). Endpoint:

```
POST  {backend}/api/v1/payments/razorpay/webhook      (public, signature-verified)
```

**Local testing** — expose your backend with a tunnel:
```bash
ngrok http 8080
# → https://<random>.ngrok-free.app
```

Razorpay Dashboard → **Settings → Webhooks → Add New Webhook**:
- **URL**: `https://<random>.ngrok-free.app/api/v1/payments/razorpay/webhook`
- **Secret**: choose any strong string → set the **same** value as
  `RAZORPAY_WEBHOOK_SECRET` on the backend.
- **Active events**: `payment.captured`, `payment.failed`, `order.paid`,
  `refund.processed`, `refund.created`.

In production, use your real HTTPS domain instead of ngrok.

---

## 5. Test a payment

With test keys active, place an order → the real Razorpay checkout opens. Use a
Razorpay **test instrument**:

- **Card**: `4111 1111 1111 1111`, any future expiry, any CVV, OTP `1234` /
  choose *Success*.
- **UPI**: `success@razorpay` (or `failure@razorpay` to test the failure path).

Expected: order goes `PENDING_PAYMENT` → (pay) → **`CONFIRMED` / `PAID`**, cart
clears, order page shows the tracking timeline. Verify the row in the `payments`
table. Trigger `failure@razorpay` and confirm the order becomes `PAYMENT_FAILED`
and stock is released.

---

## 6. Going live (production)

1. Complete Razorpay **KYC**; generate **Live** keys.
2. Set `RAZORPAY_KEY_ID=rzp_live_…`, `RAZORPAY_KEY_SECRET=…` (live), and a live
   webhook pointing at your production HTTPS URL with its own secret.
3. `VITE_RAZORPAY_KEY_ID=rzp_live_…` on the frontend.
4. HTTPS is mandatory for live checkout.
5. Keep `RAZORPAY_ENABLED=true`.

---

## How the code uses these (no changes needed)

- `RazorpayService.createOrder` → real `RazorpayClient(keyId, keySecret)` when
  `enabled=true`; a mock order otherwise.
- `RazorpayService.verifySignature` → `Utils.verifyPaymentSignature` (checkout callback).
- `RazorpayService.verifyWebhookSignature` → `Utils.verifyWebhookSignature`
  (webhook, using `RAZORPAY_WEBHOOK_SECRET`).
- `RazorpayService.refund` → real refunds on compensation when a payment was captured.
- Frontend `useRazorpay` opens the real checkout for real order ids and only
  auto-completes for mock (`order_MOCK…`) ids.

**Fallback:** if you leave `RAZORPAY_ENABLED=false`, everything still works with
the mock gateway — handy for demos and CI.
