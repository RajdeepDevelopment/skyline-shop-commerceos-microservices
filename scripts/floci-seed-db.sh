#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# floci-seed-db.sh — seed the Floci RDS product shards + OpenSearch emulator
#
# The RDS proxies and OpenSearch emulator are only reachable from inside the
# floci docker network (no host ports are published), so the bulk seeder runs
# in the bootstrap image attached to that network — the same image floci-rds-
# schema.sh uses for prisma.
#
# Usage:
#   ./scripts/floci-seed-db.sh            # seed 10,000 products (default)
#   SEED_PRODUCT_COUNT=2000 ./scripts/floci-seed-db.sh
#
# Env:
#   SEED_PRODUCT_COUNT    products to seed (default 10000)
#   BOOTSTRAP_IMAGE       image used to run the seeder (default: the compose
#                         bootstrap image, built on first use)
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

[[ -n "${FLOCI_IP:-}" ]] || { echo "❌ FLOCI_IP missing in ${ENDPOINTS_FILE}" >&2; exit 1; }

# OpenSearch is best-effort: the emulator sometimes drops the backing container
# while keeping the domain record. Re-resolve (and recreate the domain) before
# giving up; if it truly can't come up, seed RDS only rather than aborting the
# whole deploy.
ES_AVAILABLE="false"
if [[ "${ES_IP:-}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  ES_AVAILABLE="true"
else
  ES_CONTAINER="${ES_HOST:-floci-opensearch-skyline-shop-staging-search}"
  echo "   ⚠ ES_IP missing — waiting for ${ES_CONTAINER}..."
  ES_IP=""
  for _ in $(seq 1 30); do
    ES_IP="$(docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{if ne $v.IPAddress ""}}{{printf "%s\n" $v.IPAddress}}{{end}}{{end}}' "${ES_CONTAINER}" 2>/dev/null | head -1 || true)"
    [[ "${ES_IP}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] && break
    ES_IP=""
    sleep 2
  done
  if [[ ! "${ES_IP}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    ES_DOMAIN="${ES_CONTAINER#floci-opensearch-}"
    echo "   ⚠ OpenSearch container missing — recreating domain ${ES_DOMAIN}..."
    docker exec ecommerce_floci aws --endpoint-url http://localhost:4566 \
      opensearch delete-domain --domain-name "${ES_DOMAIN}" >/dev/null 2>&1 || true
    sleep 3
    docker exec ecommerce_floci aws --endpoint-url http://localhost:4566 \
      opensearch create-domain --domain-name "${ES_DOMAIN}" \
      --engine-version OpenSearch_2.11 \
      --cluster-config InstanceType=t3.small.search,InstanceCount=1 >/dev/null 2>&1 || true
    for _ in $(seq 1 90); do
      ES_IP="$(docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{if ne $v.IPAddress ""}}{{printf "%s\n" $v.IPAddress}}{{end}}{{end}}' "${ES_CONTAINER}" 2>/dev/null | head -1 || true)"
      [[ "${ES_IP}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] && break
      ES_IP=""
      sleep 2
    done
  fi
  if [[ "${ES_IP}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    ES_AVAILABLE="true"
  fi
fi

DB_USER="${SKYLINE_DB_USER:-${DB_USER:-root}}"
DB_PASSWORD="${SKYLINE_DB_PASSWORD:-${DB_PASSWORD:-password}}"
SEED_PRODUCT_COUNT="${SEED_PRODUCT_COUNT:-10000}"

FLOCI_NETWORK="$(docker network ls --format '{{.Name}}' -f 'label=com.docker.compose.project=ecommerce-floci' 2>/dev/null | head -1 || true)"
FLOCI_NETWORK="${FLOCI_NETWORK:-ecommerce-floci_floci_network}"
if ! docker network inspect "${FLOCI_NETWORK}" >/dev/null 2>&1; then
  echo "❌ floci network '${FLOCI_NETWORK}' not found — is the emulator running?" >&2
  exit 1
fi

BOOTSTRAP_IMAGE="${BOOTSTRAP_IMAGE:-skyline-shop-commerceos-microservices-bootstrap:latest}"
if ! docker image inspect "${BOOTSTRAP_IMAGE}" >/dev/null 2>&1; then
  echo "▶ building ${BOOTSTRAP_IMAGE} (bootstrap image for the seeder)..."
  docker build -t "${BOOTSTRAP_IMAGE}" -f docker/bootstrap.Dockerfile .
fi

SHARD_URLS=()
for i in 0 1 2 3; do
  ep_var="DB_product_s${i}"
  ep="${!ep_var:-}"
  [[ -n "${ep}" ]] || { echo "   ⚠ ${ep_var} missing — skipping shard ${i}"; continue; }
  SHARD_URLS+=("postgresql://${DB_USER}:${DB_PASSWORD}@${ep}/product_s${i}?schema=public")
done
if [[ "${#SHARD_URLS[@]}" -eq 0 ]]; then
  echo "❌ no product shard endpoints in ${ENDPOINTS_FILE}" >&2
  exit 1
fi
SEED_SHARD_URLS="$(IFS=,; echo "${SHARD_URLS[*]}")"

if [[ "${ES_AVAILABLE}" == "true" ]]; then
  echo "▶ Seeding ${SEED_PRODUCT_COUNT} products → RDS shards + OpenSearch (${ES_IP}:9200)..."
else
  echo "   ⚠ OpenSearch unreachable — seeding RDS only (search index will be missing)."
  echo "     Re-run ./scripts/floci-seed-db.sh once the emulator is healthy to backfill search."
fi

SEED_ES=false
ES_URL_ARGS=()
if [[ "${ES_AVAILABLE}" == "true" ]]; then
  SEED_ES=true
  ES_URL_ARGS=(-e ELASTICSEARCH_URL="http://${ES_IP}:9200")
fi

docker run --rm --network "${FLOCI_NETWORK}" \
  -e SEED_PRODUCT_COUNT="${SEED_PRODUCT_COUNT}" \
  -e SEED_SHARD_URLS="${SEED_SHARD_URLS}" \
  -e SEARCH_BACKEND=opensearch \
  "${ES_URL_ARGS[@]}" \
  -e SEED_ES="${SEED_ES}" \
  -e SEED_RESET=true \
  "${BOOTSTRAP_IMAGE}" bash -lc "npx ts-node scripts/seed/seed-db.ts"

echo "✅ Product seed complete (${SEED_PRODUCT_COUNT})."
