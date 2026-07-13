#!/usr/bin/env bash
# ── Ratnika smoke test + Actuator health check ───────────────────
# Run after deploy. Verifies the live stack through the nginx edge:
#   1. Actuator health reports UP
#   2. Prometheus metrics are exposed
#   3. Storefront (SPA) responds
#   4. A public API endpoint responds
#
# Usage:  ci/smoke-test.sh [base-url]      (default http://localhost)
set -euo pipefail

BASE="${1:-http://localhost}"
RETRIES="${RETRIES:-30}"
SLEEP="${SLEEP:-5}"

echo "── Smoke testing ${BASE} ──"

# Wait for the backend to become healthy (Actuator).
echo -n "Health check (Actuator): "
for i in $(seq 1 "$RETRIES"); do
  body="$(curl -fsS "${BASE}/actuator/health" 2>/dev/null || true)"
  if echo "$body" | grep -q '"status":"UP"'; then
    echo "UP ✅"
    break
  fi
  if [ "$i" -eq "$RETRIES" ]; then
    echo "FAILED ❌ (still not UP after $((RETRIES * SLEEP))s)"
    echo "Last response: ${body:-<empty>}"
    exit 1
  fi
  sleep "$SLEEP"
done

check() {
  local name="$1" url="$2" expect="${3:-200}"
  echo -n "${name}: "
  code="$(curl -s -o /dev/null -w '%{http_code}' "$url" || echo 000)"
  if [ "$code" = "$expect" ]; then
    echo "$code ✅"
  else
    echo "$code (expected $expect) ❌"
    return 1
  fi
}

check "Prometheus metrics" "${BASE}/actuator/prometheus" 200
check "Storefront (SPA)"   "${BASE}/"                     200
# Public catalog endpoint (adjust path if your API differs).
check "API — products"     "${BASE}/api/v1/products"      200

echo "✅ Smoke test passed — application is live at ${BASE}"
