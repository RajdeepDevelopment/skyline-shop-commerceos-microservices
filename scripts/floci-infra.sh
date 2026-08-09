#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# floci-infra.sh — provision the AWS-native data plane on the Floci emulator
#
# Mirrors the Terraform managed services (infrastructure/aws/data.tf) so the
# SAME AWS resources exist locally and on real AWS:
#   * 10 RDS PostgreSQL shard instances (auth x2, order x4, product x4)
#   * 1  ElastiCache Redis replication group
#   * 1  OpenSearch domain
#
# Idempotent — safe to run any number of times. Writes the resolved endpoints
# to dist/floci-endpoints.env for scripts/floci-deploy.sh to consume.
#
# Usage:
#   ./scripts/floci-infra.sh [DB_PASSWORD]
# ---------------------------------------------------------------------------
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT_DIR}"

PROJECT="${SKYLINE_PROJECT:-skyline-shop}"
ENV_NAME="${SKYLINE_ENV:-staging}"
DB_USER="${SKYLINE_DB_USER:-root}"
DB_PASSWORD="${1:-${SKYLINE_DB_PASSWORD:-password}}"

DIST_DIR="${ROOT_DIR}/dist"
OUT_FILE="${DIST_DIR}/floci-endpoints.env"
OUT_TMP="${OUT_FILE}.tmp"
mkdir -p "${DIST_DIR}"
: > "${OUT_TMP}"

AWS() {
  docker exec -e AWS_ENDPOINT_URL=http://localhost:4566 \
    -e AWS_ACCESS_KEY_ID=test -e AWS_SECRET_ACCESS_KEY=test \
    -e AWS_DEFAULT_REGION=us-east-1 \
    ecommerce_floci aws --endpoint-url http://localhost:4566 "$@"
}

if ! docker ps --format '{{.Names}}' | grep -q '^ecommerce_floci$'; then
  echo "❌ Floci emulator not running. Start it with: docker compose -f docker-compose.floci.yml up -d" >&2
  exit 1
fi

# The container may exist but still be booting its API — wait until it answers
# before hitting RDS/ElastiCache/OpenSearch (a race here aborts the whole deploy).
echo "▶ Waiting for Floci emulator API..."
for i in $(seq 1 60); do
  if AWS sts get-caller-identity >/dev/null 2>&1; then
    echo "   emulator ready"
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "❌ Floci emulator API not reachable after 120s" >&2
    exit 1
  fi
  sleep 2
done

# Resolve the Floci emulator IP on its docker network — it proxies RDS + Redis.
FLOCI_IP="$(docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{$v.IPAddress}}{{end}}' ecommerce_floci 2>/dev/null | awk '{print $1}')"
[[ -n "${FLOCI_IP}" ]] || { echo "❌ could not resolve Floci emulator IP" >&2; exit 1; }
echo "▶ Floci emulator IP : ${FLOCI_IP}"

# Only a dotted-quad IPv4 is routable into the k8s EndpointSlices (addressType
# IPv4) — never accept a container hostname here.
is_ipv4() {
  local v="$1" a
  [[ "${v}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]] || return 1
  IFS=. read -r -a a <<<"${v}"
  [[ "${a[0]}" -le 255 && "${a[1]}" -le 255 && "${a[2]}" -le 255 && "${a[3]}" -le 255 ]]
}

# resolve_container_ip <container> [attempts] — wait for an IPv4 container IP
# (the floci network first, then any network) or return non-zero. A container
# gets its IP as soon as docker starts it, so if this times out the container
# is missing — the caller should force the emulator to recreate the resource.
FLOCI_NETWORK="$(docker network ls --format '{{.Name}}' -f 'label=com.docker.compose.project=ecommerce-floci' 2>/dev/null | head -1 || true)"
FLOCI_NETWORK="${FLOCI_NETWORK:-ecommerce-floci_floci_network}"
resolve_container_ip() {
  local c="$1" n="${2:-30}" ip=""
  for _ in $(seq 1 "${n}"); do
    ip="$(docker inspect -f "{{with index .NetworkSettings.Networks \"${FLOCI_NETWORK}\"}}{{.IPAddress}}{{end}}" "${c}" 2>/dev/null || true)"
    if ! is_ipv4 "${ip}"; then
      ip="$(docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{if ne $v.IPAddress ""}}{{println $v.IPAddress}}{{end}}{{end}}' "${c}" 2>/dev/null | head -1 || true)"
    fi
    if is_ipv4 "${ip}"; then
      printf '%s' "${ip}"
      return 0
    fi
    ip=""
    sleep 2
  done
  return 1
}

SHARDS="auth:s0 auth:s1 order:s0 order:s1 order:s2 order:s3 product:s0 product:s1 product:s2 product:s3"

# --- RDS shard instances ----------------------------------------------------
echo "==> RDS PostgreSQL shard instances"
for pair in ${SHARDS}; do
  svc="${pair%%:*}"; shard="${pair##*:}"
  id="${PROJECT}-${ENV_NAME}-${svc}-${shard}"
  if AWS rds describe-db-instances --db-instance-identifier "${id}" --output json 2>/dev/null | grep -q "${id}"; then
    echo "   exists: ${id}"
  else
    echo "   creating: ${id} ..."
    AWS rds create-db-instance \
      --db-instance-identifier "${id}" \
      --db-instance-class db.t3.micro \
      --engine postgres \
      --allocated-storage 20 \
      --master-username "${DB_USER}" \
      --master-user-password "${DB_PASSWORD}" >/dev/null
    # Wait for the proxy port to be assigned & reachable.
    for _ in $(seq 1 30); do
      port="$(AWS rds describe-db-instances --db-instance-identifier "${id}" --query 'DBInstances[0].Endpoint.Port' --output text 2>/dev/null || true)"
      [[ -n "${port}" && "${port}" != "None" ]] && break
      sleep 2
    done
    echo "   created: ${id} (port ${port})"
  fi
  # Re-query in case it existed from a previous run.
  port="$(AWS rds describe-db-instances --db-instance-identifier "${id}" --query 'DBInstances[0].Endpoint.Port' --output text 2>/dev/null || true)"
  echo "DB_${svc}_${shard}=${FLOCI_IP}:${port}" >> "${OUT_FILE}.tmp"
done

# --- ElastiCache Redis -------------------------------------------------------
echo "==> ElastiCache Redis replication group"
REDIS_ID="${PROJECT}-${ENV_NAME}-redis"
if AWS elasticache describe-replication-groups --replication-group-id "${REDIS_ID}" --output json 2>/dev/null | grep -q "${REDIS_ID}"; then
  echo "   exists: ${REDIS_ID}"
else
  echo "   creating: ${REDIS_ID} ..."
  AWS elasticache create-replication-group \
    --replication-group-id "${REDIS_ID}" \
    --replication-group-description "skyline shop redis" \
    --engine redis \
    --num-node-groups 1 \
    --replicas-per-node-group 0 >/dev/null
fi
# The emulated Redis runs as a real container (floci-valkey-<id>) on the floci
# network. Resolve its IP like OpenSearch below — the emulator itself only
# proxies Redis on localhost, which pods cannot route to. If the container is
# gone (emulator resets leave the resource record but drop the container),
# recreate the replication group so a fresh valkey container comes back.
REDIS_PORT=6379
REDIS_HOST=""
REDIS_CONTAINER="floci-valkey-${REDIS_ID}"
REDIS_HOST="$(resolve_container_ip "${REDIS_CONTAINER}" 15)" || true
if ! is_ipv4 "${REDIS_HOST}"; then
  echo "   ⚠ Redis container ${REDIS_CONTAINER} missing — recreating replication group ${REDIS_ID}..."
  # Plain delete only: this emulator's AWS CLI rejects --no-skip-final-snapshot
  # (the call then silently fails and create-aborts with AlreadyExists).
  AWS elasticache delete-replication-group --replication-group-id "${REDIS_ID}" >/dev/null 2>&1 || true
  sleep 3
  AWS elasticache create-replication-group \
    --replication-group-id "${REDIS_ID}" \
    --replication-group-description "skyline shop redis" \
    --engine redis \
    --num-node-groups 1 \
    --replicas-per-node-group 0 >/dev/null 2>&1 || true
  REDIS_HOST="$(resolve_container_ip "${REDIS_CONTAINER}" 60)" || true
fi
REDIS_HOST="${REDIS_HOST:-}"
if is_ipv4 "${REDIS_HOST}"; then
  echo "   redis endpoint: ${REDIS_HOST}:${REDIS_PORT}"
else
  echo "   ⚠ redis endpoint unresolved — check ecommerce_floci logs" >&2
fi

# --- OpenSearch --------------------------------------------------------------
echo "==> OpenSearch domain"
ES_DOMAIN="${PROJECT}-${ENV_NAME}-search"
if AWS opensearch describe-domain --domain-name "${ES_DOMAIN}" --output json 2>/dev/null | grep -q "${ES_DOMAIN}"; then
  echo "   exists: ${ES_DOMAIN}"
else
  echo "   creating: ${ES_DOMAIN} ..."
  AWS opensearch create-domain \
    --domain-name "${ES_DOMAIN}" \
    --engine-version OpenSearch_2.11 \
    --cluster-config InstanceType=t3.small.search,InstanceCount=1 >/dev/null
fi
# The emulated domain runs as a real container. Resolve a routable container
# IP on any network the Floci emulator spawned it on. Only an IPv4 dotted-quad
# is acceptable — a hostname here would break the EndpointSlice (addressType
# IPv4) that floci-deploy.sh renders, so never write a name into ES_IP. If the
# container is gone (emulator reset drops it while the domain record stays),
# recreate the domain so a fresh OpenSearch container comes back.
ES_CONTAINER="floci-opensearch-${ES_DOMAIN}"
ES_IP=""
ES_IP="$(resolve_container_ip "${ES_CONTAINER}" 20)" || true
if ! is_ipv4 "${ES_IP}"; then
  echo "   ⚠ OpenSearch container ${ES_CONTAINER} missing — recreating domain ${ES_DOMAIN}..."
  AWS opensearch delete-domain --domain-name "${ES_DOMAIN}" >/dev/null 2>&1 || true
  sleep 3
  AWS opensearch create-domain \
    --domain-name "${ES_DOMAIN}" \
    --engine-version OpenSearch_2.11 \
    --cluster-config InstanceType=t3.small.search,InstanceCount=1 >/dev/null 2>&1 || true
  ES_IP="$(resolve_container_ip "${ES_CONTAINER}" 90)" || true
fi
if is_ipv4 "${ES_IP}"; then
  echo "   opensearch endpoint: http://${ES_IP}:9200"
  ES_BACKEND="opensearch"
else
  # Fall back to the compose Elasticsearch cluster, which is real and reachable
  # on the ecommerce network the k3s node joins. AWS/floci never runs real
  # Elasticsearch, so this path means we are back on the local compose setup.
  ES_BACKEND="elasticsearch"
  for es in ecommerce_es1 ecommerce_es2 ecommerce_es3; do
    ES_IP="$(resolve_container_ip "${es}" 1)" || true
    if is_ipv4 "${ES_IP}"; then
      echo "   ⚠ Floci OpenSearch container IP not found — falling back to ${es} (${ES_IP})"
      break
    fi
    ES_IP=""
  done
  if ! is_ipv4 "${ES_IP}"; then
    ES_IP=""
    echo "   ⚠ no reachable OpenSearch/Elasticsearch IP yet — leaving ES_IP empty (floci-deploy.sh will re-resolve)"
  fi
fi

# --- Write endpoint map ------------------------------------------------------
cat > "${OUT_FILE}" <<EOF
FLOCI_IP=${FLOCI_IP}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
REDIS_HOST=${REDIS_HOST}
REDIS_PORT=${REDIS_PORT}
ES_IP=${ES_IP}
ES_BACKEND=${ES_BACKEND}
ES_HOST=${ES_IP:-${ES_CONTAINER}}
EOF
cat "${OUT_TMP}" >> "${OUT_FILE}"
rm -f "${OUT_TMP}"

echo ""
echo "✅ AWS-native data plane provisioned. Endpoint map: ${OUT_FILE}"
cat "${OUT_FILE}"

# Best-effort: fresh RDS instances have no databases/tables. Provision the app
# schema now so pods connect to a ready database. Never fails the deploy.
if bash "${ROOT_DIR}/scripts/floci-rds-schema.sh"; then
  echo "   (RDS schema ready)"
else
  echo "   ⚠ RDS schema provisioning incomplete — see scripts/floci-rds-schema.sh" >&2
fi
