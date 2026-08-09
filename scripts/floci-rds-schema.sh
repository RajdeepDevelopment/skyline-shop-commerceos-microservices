#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# floci-rds-schema.sh — provision the Floci RDS shards with the app schema
#
# The Floci emulator spins up real RDS PostgreSQL containers, but a fresh
# instance has no databases and no tables. This script:
#   1. creates the per-shard database (auth_s0, order_s0, product_s0, ...) on
#      each emulated RDS instance, and
#   2. runs `prisma migrate deploy` against every shard so the tables exist.
#
# Endpoints come from dist/floci-endpoints.env (written by floci-infra.sh).
# Connectivity to the emulated instances is over the floci docker network,
# exactly like the k3s pods (see connect_k3s_to_floci_network in floci-deploy).
#
# Usage:
#   ./scripts/floci-rds-schema.sh
#
# Env:
#   FLOCI_RDS_HOST   override the RDS host when connecting from this machine
#                    (e.g. "localhost" if the emulator publishes host ports)
#   RUN_PRISMA       0 disables the prisma migrate step (default 1)
# ---------------------------------------------------------------------------
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT_DIR}"

ENDPOINTS_FILE="${ROOT_DIR}/dist/floci-endpoints.env"
if [[ -f "${ENDPOINTS_FILE}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${ENDPOINTS_FILE}"
  set +a
else
  echo "❌ ${ENDPOINTS_FILE} not found — run scripts/floci-infra.sh first" >&2
  exit 1
fi

DB_USER="${SKYLINE_DB_USER:-${DB_USER:-root}}"
DB_PASSWORD="${SKYLINE_DB_PASSWORD:-${DB_PASSWORD:-password}}"
RUN_PRISMA="${RUN_PRISMA:-1}"

FLOCI_NETWORK="$(docker network ls --format '{{.Name}}' -f 'label=com.docker.compose.project=ecommerce-floci' 2>/dev/null | head -1 || true)"
FLOCI_NETWORK="${FLOCI_NETWORK:-ecommerce-floci_floci_network}"
if ! docker network inspect "${FLOCI_NETWORK}" >/dev/null 2>&1; then
  echo "❌ floci network '${FLOCI_NETWORK}' not found — is the emulator running?" >&2
  exit 1
fi

# The Floci RDS proxies (FLOCI_IP:7016-7025) are only reachable from inside the
# floci docker network — the emulator publishes no RDS ports to the host. prisma
# runs therefore in a disposable container on that network. We reuse the compose
# bootstrap image (Debian + pnpm + Prisma + linux node_modules).
#
# NOTE: like scripts/compose-db-migrate.sh, this uses `prisma db push` because
# the committed migrations are stale relative to prisma/schema.prisma. migrate
# deploy would leave newer columns (e.g. products.category) missing → 500s.
BOOTSTRAP_IMAGE="${BOOTSTRAP_IMAGE:-skyline-shop-commerceos-microservices-bootstrap:latest}"
if ! docker image inspect "${BOOTSTRAP_IMAGE}" >/dev/null 2>&1; then
  echo "▶ building ${BOOTSTRAP_IMAGE} (bootstrap image for prisma migrate)..."
  docker build -t "${BOOTSTRAP_IMAGE}" -f docker/bootstrap.Dockerfile .
fi

PSQL() {
  docker run --rm --network "${FLOCI_NETWORK}" postgres:15-alpine psql "$@"
}

rds_psql() {
  local host="$1" port="$2"
  PSQL "postgresql://${DB_USER}:${DB_PASSWORD}@${host}:${port}/postgres" "${@:3}"
}

SHARDS="auth:s0 auth:s1 order:s0 order:s1 order:s2 order:s3 product:s0 product:s1 product:s2 product:s3"
FAILED=0

for pair in ${SHARDS}; do
  svc="${pair%%:*}"; shard="${pair##*:}"
  ep_var="DB_${svc}_${shard}"
  ep="${!ep_var:-}"
  if [[ -z "${ep}" ]]; then
    echo "   ⚠ no endpoint for ${svc}_${shard} (${ep_var} missing) — skipping"
    continue
  fi
  host="${ep%:*}"; port="${ep##*:}"
  db="${svc}_${shard}"

  echo "==> ${svc}_${shard}  (${ep})"
  if rds_psql "${host}" "${port}" -tAc "SELECT 1 FROM pg_database WHERE datname='${db}'" | grep -q 1; then
    echo "   db exists: ${db}"
  else
    echo "   creating db: ${db} ..."
    if rds_psql "${host}" "${port}" -c "CREATE DATABASE ${db}"; then
      echo "   created: ${db}"
    else
      echo "   ❌ failed to create ${db}" >&2
      FAILED=1
      continue
    fi
  fi

  if [[ "${RUN_PRISMA}" = "1" ]]; then
    url="postgresql://${DB_USER}:${DB_PASSWORD}@${host}:${port}/${db}?schema=public"
    echo "   migrating schema (${host}:${port}/${db}) ..."
    if docker run --rm --network "${FLOCI_NETWORK}" \
        -e DATABASE_URL="${url}" \
        "${BOOTSTRAP_IMAGE}" bash -lc "pnpm exec prisma db push --accept-data-loss" >/dev/null 2>&1; then
      echo "   migrated: ${db}"
    else
      echo "   ⚠ prisma migrate failed for ${db} (endpoint ${host}:${port})" >&2
      FAILED=1
    fi
  fi
done

if [[ "${FAILED}" = "1" ]]; then
  echo ""
  echo "⚠ RDS schema provisioning finished with errors (see above)." >&2
  exit 1
fi

echo ""
echo "✅ RDS shards provisioned with schema."
