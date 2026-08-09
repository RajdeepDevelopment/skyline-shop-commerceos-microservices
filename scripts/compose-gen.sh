#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# compose-gen.sh — generate a docker-compose.yml for a reduced / custom stack.
#
# The canonical `docker-compose.yml` at the repo root is the full-fat stack
# (everything). For low-end machines setup.sh uses this script to render a
# lighter stack to .setup/docker-compose.yml that only provisions what the
# app actually needs:
#
#   - always: main DBs (auth_db, order_db, product_db_master) + Redis + NATS +
#             bootstrap (migrate + seed) + 7 microservices + gateway + web-shop
#   - optional (via flags): shards + replicas, PgBouncer, Elasticsearch + Kibana,
#             full observability, GUI tools, nginx LB
#
# The generated file is standalone (no anchors) and references the repo root
# with absolute paths so it can live in .setup/.
#
# Usage:
#   PROFILE=lite ./scripts/compose-gen.sh > .setup/docker-compose.yml
#
# Profiles (defaults shown; every var can be overridden):
#   lite  -> AUTH_SHARDS=0 ORDER_SHARDS=0 PRODUCT_SHARDS=0 REPLICAS=no ES=no
#            OBSERVABILITY=no GUIS=no NATS_NODES=1 PGBOUNCER=no NGINX=no SEED_COUNT=1000
#   mid   -> AUTH_SHARDS=1 ORDER_SHARDS=2 PRODUCT_SHARDS=2 REPLICAS=yes ES=yes ES_NODES=1
#            OBSERVABILITY=no GUIS=yes NATS_NODES=3 PGBOUNCER=yes NGINX=yes SEED_COUNT=5000
#   custom-> all values must be provided (or use the env var defaults below)
#
# Env vars:
#   AUTH_SHARDS ORDER_SHARDS PRODUCT_SHARDS   shard counts per family (int >= 0)
#   REPLICAS        yes|no   add a read replica container per shard
#   ES              yes|no   provision Elasticsearch + Kibana
#   ES_NODES        1|3      ES node count
#   OBSERVABILITY   yes|no   otel/jaeger/prometheus/alertmanager/grafana/nats-surveyor
#   GUIS            yes|no   pgAdmin + RedisInsight
#   NATS_NODES      1|3|5    NATS cluster size
#   PGBOUNCER       yes|no   shared pooler + one pooler per shard
#   NGINX           yes|no   nginx LB on :80 proxying to the gateway
#   SEED_COUNT      int      products to seed (default 1000)
# ---------------------------------------------------------------------------
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Compose-time interpolation kept literal so `docker compose --env-file .env`
# still applies POSTGRES_PASSWORD / REDIS_PASSWORD / JWT_* at runtime.
PW='${POSTGRES_PASSWORD:-password}'
RWPW='${REDIS_PASSWORD:-password}'
GPW='${GRAFANA_PASSWORD:-admin}'
PPW='${PGADMIN_PASSWORD:-admin}'
JWT='${JWT_SECRET:-super_secret_enterprise_key_change_me_in_prod}'
JWT_R='${JWT_REFRESH_SECRET:-super_secret_refresh_key_change_me_in_prod}'
JWT_EXP='${JWT_EXPIRATION:-15m}'
JWT_REXP='${JWT_REFRESH_EXPIRATION:-7d}'
LL='${LOG_LEVEL:-info}'
CORSO='${CORS_ORIGINS:-http://localhost:5173,http://localhost:8080}'

PROFILE="${PROFILE:-custom}"
case "${PROFILE}" in
  lite)
    AUTH_SHARDS="${AUTH_SHARDS:-0}"
    ORDER_SHARDS="${ORDER_SHARDS:-0}"
    PRODUCT_SHARDS="${PRODUCT_SHARDS:-0}"
    REPLICAS="${REPLICAS:-no}"
    ES="${ES:-no}"
    ES_NODES="${ES_NODES:-1}"
    OBSERVABILITY="${OBSERVABILITY:-no}"
    GUIS="${GUIS:-no}"
    NATS_NODES="${NATS_NODES:-1}"
    PGBOUNCER="${PGBOUNCER:-no}"
    NGINX="${NGINX:-no}"
    SEED_COUNT="${SEED_COUNT:-1000}"
    ;;
  mid)
    AUTH_SHARDS="${AUTH_SHARDS:-1}"
    ORDER_SHARDS="${ORDER_SHARDS:-2}"
    PRODUCT_SHARDS="${PRODUCT_SHARDS:-2}"
    REPLICAS="${REPLICAS:-yes}"
    ES="${ES:-yes}"
    ES_NODES="${ES_NODES:-1}"
    OBSERVABILITY="${OBSERVABILITY:-no}"
    GUIS="${GUIS:-yes}"
    NATS_NODES="${NATS_NODES:-3}"
    PGBOUNCER="${PGBOUNCER:-yes}"
    NGINX="${NGINX:-yes}"
    SEED_COUNT="${SEED_COUNT:-5000}"
    ;;
  custom)
    AUTH_SHARDS="${AUTH_SHARDS:-0}"
    ORDER_SHARDS="${ORDER_SHARDS:-0}"
    PRODUCT_SHARDS="${PRODUCT_SHARDS:-0}"
    REPLICAS="${REPLICAS:-no}"
    ES="${ES:-no}"
    ES_NODES="${ES_NODES:-1}"
    OBSERVABILITY="${OBSERVABILITY:-no}"
    GUIS="${GUIS:-no}"
    NATS_NODES="${NATS_NODES:-1}"
    PGBOUNCER="${PGBOUNCER:-no}"
    NGINX="${NGINX:-no}"
    SEED_COUNT="${SEED_COUNT:-1000}"
    ;;
  *)
    echo "❌ PROFILE must be lite|mid|custom (got: ${PROFILE})" >&2
    exit 2
    ;;
esac

# ---- validation --------------------------------------------------------------
fail() { echo "❌ $*" >&2; exit 2; }

[[ "${AUTH_SHARDS}" =~ ^[0-9]+$ ]] || fail "AUTH_SHARDS must be an int (got: ${AUTH_SHARDS})"
[[ "${ORDER_SHARDS}" =~ ^[0-9]+$ ]] || fail "ORDER_SHARDS must be an int (got: ${ORDER_SHARDS})"
[[ "${PRODUCT_SHARDS}" =~ ^[0-9]+$ ]] || fail "PRODUCT_SHARDS must be an int (got: ${PRODUCT_SHARDS})"
[[ "${SEED_COUNT}" =~ ^[0-9]+$ ]] || fail "SEED_COUNT must be an int (got: ${SEED_COUNT})"
for v in REPLICAS ES OBSERVABILITY GUIS PGBOUNCER NGINX; do
  [[ "${!v}" == "yes" || "${!v}" == "no" ]] || fail "${v} must be yes|no (got: ${!v})"
done
[[ "${NATS_NODES}" =~ ^(1|3|5)$ ]] || fail "NATS_NODES must be 1|3|5 (got: ${NATS_NODES})"
[[ "${ES_NODES}" =~ ^(1|3)$ ]] || fail "ES_NODES must be 1|3 (got: ${ES_NODES})"

# ---- helpers ----------------------------------------------------------------
pgurl() { printf 'postgresql://root:%s@%s:5432/%s?schema=public' "$PW" "$1" "$2"; }

# Join array elements with the given separator into $__out
join() { local sep="$1"; shift; local out="" i; for i in "$@"; do out+="${out:+,${sep}}${i}"; done; __out="$out"; }

# Build shard URL arrays
auth_w=() auth_r=() order_w=() order_r=() prod_w=() prod_r=()
for ((i = 0; i < AUTH_SHARDS; i++)); do
  auth_w+=("$(pgurl "auth_s${i}" "auth_s${i}")")
  auth_r+=("$(pgurl "auth_s${i}_replica" "auth_s${i}")")
done
for ((i = 0; i < ORDER_SHARDS; i++)); do
  order_w+=("$(pgurl "order_s${i}" "order_s${i}")")
  order_r+=("$(pgurl "order_s${i}_replica" "order_s${i}")")
done
for ((i = 0; i < PRODUCT_SHARDS; i++)); do
  prod_w+=("$(pgurl "product_s${i}" "product_s${i}")")
  prod_r+=("$(pgurl "product_s${i}_replica" "product_s${i}")")
done

# All DB URLs (main + provisioned shards, primary + replica) for MIGRATE_URLS
all_db_urls=(
  "$(pgurl auth_db auth_db)"
  "$(pgurl product_db_master product_db)"
)
if [[ "$REPLICAS" == yes ]]; then all_db_urls+=("$(pgurl product_db_replica product_db)"); fi
if [[ ${#auth_w[@]} -gt 0 ]]; then all_db_urls+=("${auth_w[@]}" "${auth_r[@]}"); fi
if [[ ${#order_w[@]} -gt 0 ]]; then all_db_urls+=("${order_w[@]}" "${order_r[@]}"); fi
if [[ ${#prod_w[@]} -gt 0 ]]; then all_db_urls+=("${prod_w[@]}" "${prod_r[@]}"); fi
join ' ' "${all_db_urls[@]}"; MIGRATE_URLS="$__out"

# bootstrap depends_on + SEED_SHARD_URLS
boot_deps="      auth_db: { condition: service_healthy }\n"
boot_deps+="      order_db: { condition: service_healthy }\n"
boot_deps+="      product_db_master: { condition: service_healthy }\n"
if [[ "$REPLICAS" == yes ]]; then boot_deps+="      product_db_replica: { condition: service_healthy }\n"; fi
for ((i = 0; i < AUTH_SHARDS; i++)); do
  boot_deps+="      auth_s${i}: { condition: service_healthy }\n"
  if [[ "$REPLICAS" == yes ]]; then boot_deps+="      auth_s${i}_replica: { condition: service_healthy }\n"; fi
done
for ((i = 0; i < ORDER_SHARDS; i++)); do
  boot_deps+="      order_s${i}: { condition: service_healthy }\n"
  if [[ "$REPLICAS" == yes ]]; then boot_deps+="      order_s${i}_replica: { condition: service_healthy }\n"; fi
done
for ((i = 0; i < PRODUCT_SHARDS; i++)); do
  boot_deps+="      product_s${i}: { condition: service_healthy }\n"
  if [[ "$REPLICAS" == yes ]]; then boot_deps+="      product_s${i}_replica: { condition: service_healthy }\n"; fi
done
if [[ "$ES" == yes ]]; then boot_deps+="      es1: { condition: service_healthy }\n"; fi

if [[ ${#prod_w[@]} -gt 0 ]]; then join ',' "${prod_w[@]}"; SEED_SHARD_URLS="$__out"; else SEED_SHARD_URLS=""; fi

# ES env line for backends
ES_URL_LINE=""
[[ "$ES" == yes ]] && ES_URL_LINE="      ELASTICSEARCH_URL: http://es1:9200"

# Product read-replica env line for product/inventory services
PROD_READ_LINE=""
if [[ "$REPLICAS" == yes ]]; then PROD_READ_LINE="      PRODUCT_DATABASE_READ_URL: $(pgurl product_db_replica product_db)"; fi

# NATS server names + route strings
nats_names=()
for i in $(seq 1 "$NATS_NODES"); do nats_names+=("nats_${i}"); done
nats_routes() { # node index (1-based) -> comma list of peer routes
  local me="$1" peers=() j
  for j in $(seq 1 "$NATS_NODES"); do
    [[ "$j" -eq "$me" ]] && continue
    peers+=("nats://nats_${j}:6222")
  done
  if [[ ${#peers[@]} -gt 0 ]]; then join ',' "${peers[@]}"; printf '%s' "$__out"; fi
}

# Shard env blocks for backend services
auth_shard_env=""
for ((i = 0; i < AUTH_SHARDS; i++)); do
  auth_shard_env+="      AUTH_S${i}_DATABASE_WRITE_URL: ${auth_w[$i]}\n"
  if [[ "$REPLICAS" == yes ]]; then
    auth_shard_env+="      AUTH_S${i}_DATABASE_READ_URL: ${auth_r[$i]}\n"
  fi
done
order_shard_env=""
for ((i = 0; i < ORDER_SHARDS; i++)); do
  order_shard_env+="      ORDER_S${i}_DATABASE_WRITE_URL: ${order_w[$i]}\n"
  if [[ "$REPLICAS" == yes ]]; then
    order_shard_env+="      ORDER_S${i}_DATABASE_READ_URL: ${order_r[$i]}\n"
  fi
done
product_shard_env=""
for ((i = 0; i < PRODUCT_SHARDS; i++)); do
  product_shard_env+="      PRODUCT_S${i}_DATABASE_WRITE_URL: ${prod_w[$i]}\n"
  if [[ "$REPLICAS" == yes ]]; then
    product_shard_env+="      PRODUCT_S${i}_DATABASE_READ_URL: ${prod_r[$i]}\n"
  fi
done

# =============================================================================
# EMIT
# =============================================================================
cat <<EOF
# Generated by scripts/compose-gen.sh — PROFILE=${PROFILE}
# AUTH_SHARDS=${AUTH_SHARDS} ORDER_SHARDS=${ORDER_SHARDS} PRODUCT_SHARDS=${PRODUCT_SHARDS}
# REPLICAS=${REPLICAS} ES=${ES} (nodes=${ES_NODES}) OBSERVABILITY=${OBSERVABILITY}
# GUIS=${GUIS} NATS_NODES=${NATS_NODES} PGBOUNCER=${PGBOUNCER} NGINX=${NGINX}
# SEED_COUNT=${SEED_COUNT}

services:
EOF

pg_svc() { # name db hostport vol
  cat <<EOF
  ${1}:
    image: postgres:15-alpine
    restart: unless-stopped
    container_name: ecommerce_${1}
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: ${PW}
      POSTGRES_DB: ${2}
    ports:
      - '${3}:5432'
    volumes:
      - ${4}:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -h 127.0.0.1 -p 5432 -U root']
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s
    networks:
      - ecommerce_network

EOF
}

pg_svc auth_db auth_db 5433 auth_db_data
pg_svc order_db order_db 5434 order_db_data
pg_svc product_db_master product_db 5435 product_db_master_data
[[ "$REPLICAS" == yes ]] && pg_svc product_db_replica product_db 5436 product_db_replica_data

for ((i = 0; i < AUTH_SHARDS; i++)); do
  pg_svc "auth_s${i}" "auth_s${i}" $((5441 + 2 * i)) "auth_s${i}_data"
  [[ "$REPLICAS" == yes ]] && pg_svc "auth_s${i}_replica" "auth_s${i}" $((5442 + 2 * i)) "auth_s${i}_replica_data"
done
for ((i = 0; i < ORDER_SHARDS; i++)); do
  pg_svc "order_s${i}" "order_s${i}" $((5451 + 2 * i)) "order_s${i}_data"
  [[ "$REPLICAS" == yes ]] && pg_svc "order_s${i}_replica" "order_s${i}" $((5452 + 2 * i)) "order_s${i}_replica_data"
done
for ((i = 0; i < PRODUCT_SHARDS; i++)); do
  pg_svc "product_s${i}" "product_s${i}" $((5461 + 2 * i)) "product_s${i}_data"
  [[ "$REPLICAS" == yes ]] && pg_svc "product_s${i}_replica" "product_s${i}" $((5462 + 2 * i)) "product_s${i}_replica_data"
done

if [[ "$PGBOUNCER" == yes ]]; then
  cat <<EOF
  pgbouncer:
    image: edoburu/pgbouncer:v1.25.2-p0
    restart: unless-stopped
    container_name: ecommerce_pgbouncer
    ports:
      - '6432:6432'
    volumes:
      - ${ROOT}/infrastructure/pgbouncer/pgbouncer.ini:/etc/pgbouncer/pgbouncer.ini:ro
      - ${ROOT}/infrastructure/pgbouncer/userlist.txt:/etc/pgbouncer/userlist.txt:ro
    depends_on:
      auth_db: { condition: service_healthy }
      order_db: { condition: service_healthy }
      product_db_master: { condition: service_healthy }
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -h 127.0.0.1 -p 6432']
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s
    networks:
      - ecommerce_network

EOF
  pgbouncer_shard() { # name hostport urls dep poolsize
    cat <<EOF
  ${1}:
    image: edoburu/pgbouncer:v1.25.2-p0
    restart: unless-stopped
    container_name: ecommerce_${1}
    ports:
      - '${2}:6432'
    volumes:
      - ${ROOT}/infrastructure/pgbouncer/pgbouncer.ini:/etc/pgbouncer/pgbouncer.ini:ro
      - ${ROOT}/infrastructure/pgbouncer/userlist.txt:/etc/pgbouncer/userlist.txt:ro
    depends_on:
      ${4}: { condition: service_healthy }
    networks:
      - ecommerce_network

EOF
  }
  for ((i = 0; i < AUTH_SHARDS; i++)); do
    join ', ' "${auth_w[$i]}" "${auth_r[$i]}"
    pgbouncer_shard "pgbouncer_auth_s${i}" $((6441 + 2 * i)) "$__out" "auth_s${i}" 25
  done
  for ((i = 0; i < ORDER_SHARDS; i++)); do
    join ', ' "${order_w[$i]}" "${order_r[$i]}"
    pgbouncer_shard "pgbouncer_order_s${i}" $((6451 + 2 * i)) "$__out" "order_s${i}" 25
  done
  for ((i = 0; i < PRODUCT_SHARDS; i++)); do
    join ', ' "${prod_w[$i]}" "${prod_r[$i]}"
    pgbouncer_shard "pgbouncer_product_s${i}" $((6461 + 2 * i)) "$__out" "product_s${i}" 30
  done
fi

cat <<EOF
  redis:
    image: redis:7-alpine
    container_name: ecommerce_redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    command: redis-server --requirepass ${RWPW} --maxmemory 256mb --maxmemory-policy allkeys-lru --appendonly yes
    healthcheck:
      test: ['CMD', 'redis-cli', '-a', '${RWPW}', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s
    networks:
      - ecommerce_network

EOF

for k in $(seq 1 "$NATS_NODES"); do
  routes="$(nats_routes "$k")"
  route_line=""
  [[ -n "$routes" ]] && route_line="      --routes ${routes}"
  cluster_line="      --cluster nats://0.0.0.0:6222"
  if [[ "$NATS_NODES" == 1 ]]; then
    route_line=""
    cluster_line=""
  fi
  cat <<EOF
  nats_${k}:
    image: nats:2.9-alpine
    restart: unless-stopped
    container_name: ecommerce_nats_${k}
    ports:
      - '42$((21 + k)):4222'
      - '82$((21 + k)):8222'
    command: >
      --server_name nats_${k} --cluster_name ecommerce_nats_cluster
${cluster_line}
${route_line}
      --js --sd /data -m 8222
    volumes:
      - nats_${k}_data:/data
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://localhost:8222/healthz || exit 1']
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s
    networks:
      - ecommerce_network

EOF
done

if [[ "$NGINX" == yes ]]; then
  cat <<EOF
  nginx_lb:
    image: nginx:alpine
    container_name: ecommerce_lb
    restart: unless-stopped
    ports:
      - '80:80'
    volumes:
      - ${ROOT}/nginx.conf:/etc/nginx/nginx.conf:ro
    healthcheck:
      test: ['CMD-SHELL', 'curl -sf http://localhost:80/health || exit 1']
      timeout: 5s
      retries: 3
      start_period: 10s
    networks:
      - ecommerce_network

EOF
fi

if [[ "$ES" == yes ]]; then
  for k in $(seq 1 "$ES_NODES"); do
    seed_list=""
    if [[ "$ES_NODES" == 3 ]]; then
      peers=()
      for j in $(seq 1 3); do [[ "$j" -eq "$k" ]] && continue; peers+=("es${j}"); done
      join ',' "${peers[@]}"
      seed_list="      discovery.seed_hosts: ${__out}"
    fi
    node_ports=""
    [[ "$k" -eq 1 ]] && node_ports="    ports:
      - '9200:9200'"
    cat <<EOF
  es${k}:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.14.3
    restart: unless-stopped
    container_name: ecommerce_es${k}
    environment:
      cluster.name: ecommerce-es-cluster
      cluster.initial_master_nodes: $(if [[ "$ES_NODES" == 3 ]]; then printf 'es1,es2,es3'; else printf 'es1'; fi)
      bootstrap.memory_lock: 'true'
      xpack.security.enabled: 'false'
      xpack.security.http.ssl.enabled: 'false'
      ES_JAVA_OPTS: '-Xms512m -Xmx512m'
      network.host: 0.0.0.0
      node.name: es${k}
${seed_list}
    ulimits:
      memlock:
        soft: -1
        hard: -1
      nofile:
        soft: 65536
        hard: 65536
${node_ports}
    volumes:
      - es${k}_data:/usr/share/elasticsearch/data
    healthcheck:
      test: ['CMD-SHELL', 'curl -sf http://localhost:9200/_cluster/health || exit 1']
      interval: 20s
      timeout: 10s
      retries: 5
      start_period: 60s
    networks:
      - ecommerce_network

EOF
  done
  cat <<EOF
  kibana:
    image: docker.elastic.co/kibana/kibana:8.14.3
    container_name: ecommerce_kibana
    restart: unless-stopped
    environment:
      - ELASTICSEARCH_HOSTS=http://es1:9200
    ports:
      - '5601:5601'
    depends_on:
      es1:
        condition: service_healthy
    healthcheck:
      test: ['CMD-SHELL', 'curl -sf http://localhost:5601/api/status || exit 1']
      interval: 20s
      timeout: 10s
      retries: 5
      start_period: 60s
    networks:
      - ecommerce_network

EOF
fi

# ---- bootstrap ---------------------------------------------------------------
cat <<EOF
  bootstrap:
    build:
      context: ${ROOT}
      dockerfile: ${ROOT}/docker/bootstrap.Dockerfile
    container_name: ecommerce_bootstrap
    restart: 'no'
    environment:
      SEED_TARGET: compose
      SEED_PRODUCT_COUNT: '${SEED_COUNT}'
      SEED_ES: $(if [[ "$ES" == yes ]]; then printf 'true'; else printf 'false'; fi)
      MIGRATE_PASSWORD: ${PW}
      MIGRATE_URLS: '${MIGRATE_URLS}'
EOF
if [[ "$ES" == yes ]]; then
  cat <<EOF
      ELASTICSEARCH_URL: http://es1:9200
EOF
fi
if [[ ${#prod_w[@]} -gt 0 ]]; then
  cat <<EOF
      SEED_SHARD_URLS: '${SEED_SHARD_URLS}'
EOF
else
  cat <<EOF
      SEED_SHARD_COUNT: '1'
EOF
fi
cat <<EOF
      PRODUCT_DATABASE_WRITE_URL: $(pgurl product_db_master product_db)
    depends_on:
$(printf '%b' "$boot_deps")
    networks:
      - ecommerce_network

EOF

# ---- backend microservices ---------------------------------------------------

# api-gateway
cat <<EOF
  api-gateway:
    build:
      context: ${ROOT}
      dockerfile: ${ROOT}/apps/api-gateway/Dockerfile
    container_name: ecommerce_api_gateway
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: development
      API_GATEWAY_PORT: '3000'
      DATABASE_URL: $(pgurl auth_db auth_db)
      JWT_SECRET: ${JWT}
      JWT_EXPIRATION: ${JWT_EXP}
      JWT_REFRESH_SECRET: ${JWT_R}
      JWT_REFRESH_EXPIRATION: ${JWT_REXP}
      CORS_ORIGINS: ${CORSO}
      CART_SERVICE_URL: http://cart-service:3005
      PRODUCT_SERVICE_URL: http://product-service:3003
      INVENTORY_SERVICE_URL: http://inventory-service:3004
      PAYMENT_SERVICE_URL: http://payment-service:3007
      GRPC_AUTH_URL: auth-service:50051
      GRPC_ORDER_URL: order-service:50056
      GRPC_PRODUCT_URL: product-service:50053
      NATS_URL: nats://nats_1:4222
      REDIS_HOST: redis
      REDIS_PORT: '6379'
      REDIS_PASSWORD: ${RWPW}
${ES_URL_LINE}
      LOG_LEVEL: ${LL}
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://127.0.0.1:3000/api/v1/health || exit 1']
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 20s
    depends_on:
      bootstrap:
        condition: service_completed_successfully
    networks:
      - ecommerce_network

EOF

# auth-service
cat <<EOF
  auth-service:
    build:
      context: ${ROOT}
      dockerfile: ${ROOT}/apps/auth-service/Dockerfile
    container_name: ecommerce_auth_service
    restart: unless-stopped
    ports:
      - '3001:3001'
    environment:
      NODE_ENV: development
      SERVICE_NAME: AUTH
      AUTH_SERVICE_PORT: '3001'
      DATABASE_URL: $(pgurl auth_db auth_db)
$(printf '%b' "$auth_shard_env")
      GRPC_AUTH_URL: auth-service:50051
      JWT_SECRET: ${JWT}
      JWT_EXPIRATION: ${JWT_EXP}
      JWT_REFRESH_SECRET: ${JWT_R}
      JWT_REFRESH_EXPIRATION: ${JWT_REXP}
      NATS_URL: nats://nats_1:4222
      REDIS_HOST: redis
      REDIS_PORT: '6379'
      REDIS_PASSWORD: ${RWPW}
${ES_URL_LINE}
      LOG_LEVEL: ${LL}
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://127.0.0.1:3001/api/v1/health || exit 1']
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 20s
    depends_on:
      bootstrap:
        condition: service_completed_successfully
    networks:
      - ecommerce_network

EOF

# product-service
cat <<EOF
  product-service:
    build:
      context: ${ROOT}
      dockerfile: ${ROOT}/apps/product-service/Dockerfile
    container_name: ecommerce_product_service
    restart: unless-stopped
    ports:
      - '3003:3003'
    environment:
      NODE_ENV: development
      SERVICE_NAME: PRODUCT
      PRODUCT_SERVICE_PORT: '3003'
      PRODUCT_DATABASE_WRITE_URL: $(pgurl product_db_master product_db)
${PROD_READ_LINE}
$(printf '%b' "$product_shard_env")
      GRPC_PRODUCT_URL: product-service:50053
      JWT_SECRET: ${JWT}
      NATS_URL: nats://nats_1:4222
      REDIS_HOST: redis
      REDIS_PORT: '6379'
      REDIS_PASSWORD: ${RWPW}
${ES_URL_LINE}
      LOG_LEVEL: ${LL}
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://127.0.0.1:3003/api/v1/health || exit 1']
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 20s
    depends_on:
      bootstrap:
        condition: service_completed_successfully
    networks:
      - ecommerce_network

EOF

# inventory-service
cat <<EOF
  inventory-service:
    build:
      context: ${ROOT}
      dockerfile: ${ROOT}/apps/inventory-service/Dockerfile
    container_name: ecommerce_inventory_service
    restart: unless-stopped
    ports:
      - '3004:3004'
    environment:
      NODE_ENV: development
      SERVICE_NAME: PRODUCT
      INVENTORY_SERVICE_PORT: '3004'
      PRODUCT_DATABASE_WRITE_URL: $(pgurl product_db_master product_db)
${PROD_READ_LINE}
$(printf '%b' "$product_shard_env")
      NATS_URL: nats://nats_1:4222
      REDIS_HOST: redis
      REDIS_PORT: '6379'
      REDIS_PASSWORD: ${RWPW}
${ES_URL_LINE}
      LOG_LEVEL: ${LL}
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://127.0.0.1:3004/api/v1/health || exit 1']
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 20s
    depends_on:
      bootstrap:
        condition: service_completed_successfully
    networks:
      - ecommerce_network

EOF

# cart-service
cat <<EOF
  cart-service:
    build:
      context: ${ROOT}
      dockerfile: ${ROOT}/apps/cart-service/Dockerfile
    container_name: ecommerce_cart_service
    restart: unless-stopped
    ports:
      - '3005:3005'
    environment:
      NODE_ENV: development
      SERVICE_NAME: CART
      CART_SERVICE_PORT: '3005'
      DATABASE_URL: $(pgurl auth_db auth_db)
      PRODUCT_SERVICE_URL: http://product-service:3003
      GRPC_CART_URL: cart-service:50055
      LOG_LEVEL: ${LL}
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://127.0.0.1:3005/api/v1/health || exit 1']
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 20s
    depends_on:
      bootstrap:
        condition: service_completed_successfully
    networks:
      - ecommerce_network

EOF

# order-service
cat <<EOF
  order-service:
    build:
      context: ${ROOT}
      dockerfile: ${ROOT}/apps/order-service/Dockerfile
    container_name: ecommerce_order_service
    restart: unless-stopped
    ports:
      - '3006:3006'
    environment:
      NODE_ENV: development
      SERVICE_NAME: ORDER
      ORDER_SERVICE_PORT: '3006'
      DATABASE_URL: $(pgurl auth_db auth_db)
$(printf '%b' "$order_shard_env")
      GRPC_ORDER_URL: order-service:50056
      JWT_SECRET: ${JWT}
      NATS_URL: nats://nats_1:4222
      REDIS_HOST: redis
      REDIS_PORT: '6379'
      REDIS_PASSWORD: ${RWPW}
${ES_URL_LINE}
      LOG_LEVEL: ${LL}
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://127.0.0.1:3006/api/v1/health || exit 1']
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 20s
    depends_on:
      bootstrap:
        condition: service_completed_successfully
    networks:
      - ecommerce_network

EOF

# payment-service
cat <<EOF
  payment-service:
    build:
      context: ${ROOT}
      dockerfile: ${ROOT}/apps/payment-service/Dockerfile
    container_name: ecommerce_payment_service
    restart: unless-stopped
    ports:
      - '3007:3007'
    environment:
      NODE_ENV: development
      SERVICE_NAME: ORDER
      PAYMENT_SERVICE_PORT: '3007'
      DATABASE_URL: $(pgurl auth_db auth_db)
$(printf '%b' "$order_shard_env")
      NATS_URL: nats://nats_1:4222
      REDIS_HOST: redis
      REDIS_PORT: '6379'
      REDIS_PASSWORD: ${RWPW}
${ES_URL_LINE}
      LOG_LEVEL: ${LL}
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://127.0.0.1:3007/api/v1/health || exit 1']
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 20s
    depends_on:
      bootstrap:
        condition: service_completed_successfully
    networks:
      - ecommerce_network

EOF

# web-shop
cat <<EOF
  web-shop:
    build:
      context: ${ROOT}
      dockerfile: ${ROOT}/apps/web-shop/Dockerfile
    container_name: ecommerce_web_shop
    restart: unless-stopped
    ports:
      - '8080:80'
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://127.0.0.1/health || exit 1']
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 15s
    depends_on:
      api-gateway:
        condition: service_healthy
    networks:
      - ecommerce_network

EOF

# ---- observability -----------------------------------------------------------
if [[ "$OBSERVABILITY" == yes ]]; then
  cat <<EOF
  otel_collector:
    image: otel/opentelemetry-collector-contrib:0.104.0
    container_name: ecommerce_otel_collector
    restart: unless-stopped
    ports:
      - '4317:4317'
      - '4318:4318'
      - '8889:8889'
    volumes:
      - ${ROOT}/infrastructure/otel/otel-collector-config.yml:/etc/otelcol-contrib/config.yaml:ro
    depends_on:
      jaeger:
        condition: service_healthy
    networks:
      - ecommerce_network

  jaeger:
    image: jaegertracing/all-in-one:1.60
    container_name: ecommerce_jaeger
    restart: unless-stopped
    ports:
      - '16686:16686'
      - '14250:14250'
      - '14268:14268'
    environment:
      - COLLECTOR_OTLP_ENABLED=true
    volumes:
      - jaeger_data:/badger
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://localhost:14269/ || exit 1']
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 20s
    networks:
      - ecommerce_network

  prometheus:
    image: prom/prometheus:v2.45.0
    container_name: ecommerce_prometheus
    restart: unless-stopped
    ports:
      - '9090:9090'
    volumes:
      - ${ROOT}/infrastructure/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=15d'
      - '--web.enable-lifecycle'
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://localhost:9090/-/healthy || exit 1']
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 15s
    networks:
      - ecommerce_network

  alertmanager:
    image: prom/alertmanager:v0.27.0
    container_name: ecommerce_alertmanager
    restart: unless-stopped
    ports:
      - '9093:9093'
    volumes:
      - alertmanager_data:/alertmanager
    command:
      - '--config.file=/etc/alertmanager/alertmanager.yml'
      - '--storage.path=/alertmanager'
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://localhost:9093/-/healthy || exit 1']
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 10s
    networks:
      - ecommerce_network

  grafana:
    image: grafana/grafana:10.0.3
    container_name: ecommerce_grafana
    restart: unless-stopped
    ports:
      - '3100:3000'
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=${GPW}
      - GF_INSTALL_PLUGINS=grafana-clock-panel,grafana-piechart-panel
    volumes:
      - grafana_data:/var/lib/grafana
      - ${ROOT}/infrastructure/grafana/provisioning:/etc/grafana/provisioning
      - ${ROOT}/infrastructure/grafana/dashboards:/var/lib/grafana/dashboards
    depends_on:
      prometheus:
        condition: service_healthy
    healthcheck:
      test: ['CMD-SHELL', 'curl -sf http://localhost:3000/api/health || exit 1']
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 20s
    networks:
      - ecommerce_network

EOF
  survey_count=$((NATS_NODES < 3 ? NATS_NODES : 3))
  join ', ' "$(for s in "${nats_names[@]}"; do printf 'nats://%s:4222' "$s"; done)"
  cat <<EOF
  nats_surveyor:
    image: natsio/nats-surveyor:latest
    container_name: ecommerce_nats_surveyor
    restart: unless-stopped
    ports:
      - '7777:7777'
    environment:
      - NATS_SURVEYOR_SERVERS=${__out}
      - NATS_SURVEYOR_COUNT=${survey_count}
      - NATS_SURVEYOR_PORT=7777
    depends_on:
      nats_1:
        condition: service_healthy
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://localhost:7777/metrics || exit 1']
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 10s
    networks:
      - ecommerce_network

EOF
fi

# ---- GUIs --------------------------------------------------------------------
if [[ "$GUIS" == yes ]]; then
  cat <<EOF
  redis_insight:
    image: redis/redisinsight:2.64
    container_name: ecommerce_redis_insight
    restart: unless-stopped
    ports:
      - '5540:5540'
    environment:
      - REDISINSIGHT_HOST=0.0.0.0
    depends_on:
      redis:
        condition: service_healthy
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://127.0.0.1:5540/ || exit 1']
      interval: 15s
      timeout: 5s
      retries: 5
      start_period: 60s
    networks:
      - ecommerce_network

  pgadmin:
    image: dpage/pgadmin4:8.14
    container_name: ecommerce_pgadmin
    restart: unless-stopped
    ports:
      - '5050:80'
    environment:
      - PGADMIN_DEFAULT_EMAIL=admin@skyline.dev
      - PGADMIN_DEFAULT_PASSWORD=${PPW}
      - PGADMIN_LISTEN_PORT=80
      - PGADMIN_SERVER_JSON_FILE=/pgadmin4/servers.json
      - PGADMIN_CONFIG_SERVER_MODE=False
    volumes:
      - pgadmin_data:/var/lib/pgadmin
      - ${ROOT}/infrastructure/pgadmin/servers.json:/pgadmin4/servers.json:ro
    depends_on:
      auth_db: { condition: service_healthy }
      order_db: { condition: service_healthy }
      product_db_master: { condition: service_healthy }
    healthcheck:
      test: ['CMD-SHELL', 'wget -qO- http://localhost:80/misc/ping || exit 1']
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 15s
    networks:
      - ecommerce_network

EOF
fi

# ---- volumes + networks ------------------------------------------------------
cat <<EOF
volumes:
  auth_db_data:
  order_db_data:
  product_db_master_data:
EOF
[[ "$REPLICAS" == yes ]] && printf '  product_db_replica_data:\n'
for ((i = 0; i < AUTH_SHARDS; i++)); do
  printf '  auth_s%s_data:\n' "$i"
  [[ "$REPLICAS" == yes ]] && printf '  auth_s%s_replica_data:\n' "$i"
done
for ((i = 0; i < ORDER_SHARDS; i++)); do
  printf '  order_s%s_data:\n' "$i"
  [[ "$REPLICAS" == yes ]] && printf '  order_s%s_replica_data:\n' "$i"
done
for ((i = 0; i < PRODUCT_SHARDS; i++)); do
  printf '  product_s%s_data:\n' "$i"
  [[ "$REPLICAS" == yes ]] && printf '  product_s%s_replica_data:\n' "$i"
done
for i in $(seq 1 "$NATS_NODES"); do printf '  nats_%s_data:\n' "$i"; done
printf '  redis_data:\n'
if [[ "$ES" == yes ]]; then
  for i in $(seq 1 "$ES_NODES"); do printf '  es%s_data:\n' "$i"; done
fi
if [[ "$OBSERVABILITY" == yes ]]; then
  printf '  jaeger_data:\n  prometheus_data:\n  alertmanager_data:\n  grafana_data:\n'
fi
if [[ "$GUIS" == yes ]]; then printf '  pgadmin_data:\n'; fi
cat <<EOF

networks:
  ecommerce_network:
    driver: bridge
EOF
