#!/usr/bin/env bash
# ── Trivy security scan ──────────────────────────────────────────
# Usage:
#   ci/trivy-scan.sh fs <path>            # filesystem / dependency scan
#   ci/trivy-scan.sh image <image:tag>    # container image scan
#
# Fails the build (exit 1) on HIGH/CRITICAL vulnerabilities.
# Unfixed vulns are ignored so builds aren't blocked by upstream gaps.
set -euo pipefail

MODE="${1:?usage: trivy-scan.sh <fs|image> <target>}"
TARGET="${2:?missing scan target}"

COMMON_ARGS=(
  --severity HIGH,CRITICAL
  --ignore-unfixed
  --exit-code 1
  --no-progress
)

echo "── Trivy ${MODE} scan: ${TARGET} ──"

case "$MODE" in
  fs)
    trivy fs "${COMMON_ARGS[@]}" --scanners vuln,secret,misconfig "$TARGET"
    ;;
  image)
    trivy image "${COMMON_ARGS[@]}" "$TARGET"
    ;;
  *)
    echo "Unknown mode: $MODE (expected 'fs' or 'image')" >&2
    exit 2
    ;;
esac

echo "✅ Trivy ${MODE} scan passed for ${TARGET}"
