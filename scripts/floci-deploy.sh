#!/bin/bash
# ---------------------------------------------------------------------------
# floci-deploy.sh — deploy the Skyline Shop application services to the
# Floci EKS cluster (local AWS emulation via k3s).
#
#   ./scripts/floci-deploy.sh
#
# Renders k8s/base manifests with REGISTRY/TAG injected, wraps them in a
# light local overlay (1 replica per service to fit a single-node k3s), and
# applies to the cluster referenced by KUBECONFIG (defaults to .kube/config).
# Ingress is skipped (needs an ingress controller + real hostname).
# ---------------------------------------------------------------------------
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
KUBECONFIG="${KUBECONFIG:-${ROOT_DIR}/.kube/config}"
REGISTRY="${REGISTRY:-000000000000.dkr.ecr.us-east-1.localhost:5100}"
TAG="${TAG:-latest}"
BASE_DIR="${ROOT_DIR}/k8s/base"
RENDER_BASE="${ROOT_DIR}/dist/k8s-rendered/base"
OVERLAY_DIR="${ROOT_DIR}/dist/k8s-rendered"

export REGISTRY TAG KUBECONFIG

FLOCI_ENDPOINTS_FILE="${ROOT_DIR}/dist/floci-endpoints.env"
if [[ "${DB_BACKEND:-}" = "aws" && -f "${FLOCI_ENDPOINTS_FILE}" ]]; then
    set -a
    source "${FLOCI_ENDPOINTS_FILE}"
    set +a
    echo "▶ loaded ${FLOCI_ENDPOINTS_FILE}"
fi

echo "▶ KUBECONFIG : ${KUBECONFIG}"
echo "▶ REGISTRY   : ${REGISTRY}"
echo "▶ TAG        : ${TAG}"

mkdir -p "${RENDER_BASE}" "${OVERLAY_DIR}"

# Render base manifests. envsubst can't handle ${TAG:-latest} (bash default
# syntax), so substitute that literal first with sed, then envsubst.
render() {
    local src="$1"
    local out="${RENDER_BASE}/$(basename "$src")"
    sed -e "s|\${TAG:-latest}|${TAG}|g" "${src}" | envsubst > "${out}"
    echo "   rendered $(basename "$src")"
}

# Secrets come from AWS Secrets Manager (materialized by scripts/deploy.sh).
# When the SKYLINE_* values are exported, generate secrets.yml from them so no
# hardcoded/placeholder secret reaches the cluster. Otherwise fall back to the
# committed dev-only template.
render_secrets() {
    local out="${RENDER_BASE}/secrets.yml"
    if [[ -n "${SKYLINE_JWT_SECRET:-}" && -n "${SKYLINE_JWT_REFRESH_SECRET:-}" && -n "${SKYLINE_POSTGRES_PASSWORD:-}" ]]; then
        cat > "${out}" <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: ecommerce-secrets
  namespace: ecommerce
type: Opaque
stringData:
  JWT_SECRET: "${SKYLINE_JWT_SECRET}"
  JWT_REFRESH_SECRET: "${SKYLINE_JWT_REFRESH_SECRET}"
  POSTGRES_PASSWORD: "${SKYLINE_POSTGRES_PASSWORD}"
EOF
        echo "   generated secrets.yml from AWS Secrets Manager"
    else
        render "${BASE_DIR}/secrets.yml"
    fi
}

render "${BASE_DIR}/namespace.yml"
render "${BASE_DIR}/configmap.yml"
render_secrets
for svc in api-gateway auth-service cart-service order-service product-service inventory-service payment-service notification-service web-shop; do
    render "${BASE_DIR}/${svc}.yml"
done

# ---------------------------------------------------------------------------
# Infra wiring (Floci-only): the app ConfigMap references stateful-service
# hostnames (redis-cluster, nats-headless, elasticsearch-*, pgbouncer-*) that
# actually run as docker-compose containers on the host ecommerce network, not
# inside the k3s cluster. Attach the k3s node container to that network and
# publish headless Services + EndpointSlices (hostname-annotated, StatefulSet-
# style) that map each logical name onto the live compose container IPs, so the
# pods can genuinely reach Postgres / Redis / NATS / Elasticsearch.
# ---------------------------------------------------------------------------
COMPOSE_PROJECT="skyline-shop-commerceos-microservices"
COMPOSE_NETWORK="$(docker network ls --format '{{.Name}}' -f "label=com.docker.compose.project=${COMPOSE_PROJECT}" -f "label=com.docker.compose.network=ecommerce_network" 2>/dev/null | head -1 || true)"
K3S_NODE="floci-eks-${SKYLINE_PROJECT:-skyline-shop}-${SKYLINE_ENV:-staging}-cluster"
INFRA_OUT="${OVERLAY_DIR}/floci-infra.yml"

infra_ip() {
    docker inspect -f "{{with index .NetworkSettings.Networks \"${COMPOSE_NETWORK}\"}}{{.IPAddress}}{{end}}" "$1" 2>/dev/null || true
}

connect_k3s_to_compose_network() {
    [[ -n "${COMPOSE_NETWORK}" ]] || { echo "   (compose network not found — skipping infra wiring)"; return 0; }
    local attached
    attached="$(docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' "${K3S_NODE}" 2>/dev/null || true)"
    if grep -q "${COMPOSE_NETWORK}" <<<"${attached}"; then
        echo "   ${K3S_NODE} already on ${COMPOSE_NETWORK}"
    else
        docker network connect "${COMPOSE_NETWORK}" "${K3S_NODE}"
        echo "   connected ${K3S_NODE} → ${COMPOSE_NETWORK}"
    fi
}

# AWS mode: the Floci-managed RDS/Redis data plane is proxied on the emulator's
# own container IP (FLOCI_IP). The emulator runs on the floci bridge network, so
# pods must be able to route there — join the k3s node to that network too.
connect_k3s_to_floci_network() {
    local floci_net
    floci_net="$(docker network ls --format '{{.Name}}' -f 'label=com.docker.compose.project=ecommerce-floci' 2>/dev/null | head -1 || true)"
    [[ -n "${floci_net}" ]] || floci_net="ecommerce-floci_floci_network"
    if ! docker network inspect "${floci_net}" >/dev/null 2>&1; then
        echo "   ⚠ floci network '${floci_net}' not found — skipping floci network join"
        return 0
    fi
    local attached
    attached="$(docker inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{$k}} {{end}}' "${K3S_NODE}" 2>/dev/null || true)"
    if grep -q "${floci_net}" <<<"${attached}"; then
        echo "   ${K3S_NODE} already on ${floci_net}"
    else
        docker network connect "${floci_net}" "${K3S_NODE}"
        echo "   connected ${K3S_NODE} → ${floci_net}"
    fi
}

# emit_pair <svc> <port> [ip hostname]...
# Publishes a headless Service plus an EndpointSlice. Each "ip hostname" pair
# becomes one endpoint; an empty hostname gives a plain endpoint (the svc DNS
# name resolves to the IP), a real hostname gives the StatefulSet-style record
# <hostname>.<svc>.<ns>.svc.cluster.local.
emit_pair() {
    local svc="$1"; shift
    local port="$1"; shift
    cat >> "${INFRA_OUT}" <<EOF
apiVersion: v1
kind: Service
metadata:
  name: ${svc}
  namespace: ecommerce
spec:
  clusterIP: None
  ports:
    - name: ${svc}
      port: ${port}
      targetPort: ${port}
---
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: ${svc}
  namespace: ecommerce
  labels:
    kubernetes.io/service-name: ${svc}
addressType: IPv4
endpoints:
EOF
    while [[ $# -gt 0 ]]; do
        local ip="$1"; local hostname="$2"; shift 2
        if [[ -n "${hostname}" ]]; then
            printf '  - addresses: ["%s"]\n    hostname: %s\n' "${ip}" "${hostname}" >> "${INFRA_OUT}"
        else
            printf '  - addresses: ["%s"]\n' "${ip}" >> "${INFRA_OUT}"
        fi
    done
    cat >> "${INFRA_OUT}" <<EOF
ports:
  - name: ${svc}
    port: ${port}
    protocol: TCP
---
EOF
}

render_infra_services() {
    [[ -n "${COMPOSE_NETWORK}" ]] || { echo "   (compose network not found — skipping infra services)"; return 0; }
    : > "${INFRA_OUT}"

    local redis_ip="${REDIS_HOST:-$(infra_ip ecommerce_redis)}"
    local es_ip="${ES_IP:-$(infra_ip ecommerce_es1)}"
    local nats_ips=()
    local i
    for i in 1 2 3 4 5; do nats_ips+=("$(infra_ip "ecommerce_nats_${i}")"); done

    # Redis: REDIS_HOST=redis-cluster + REDIS_CLUSTER_NODES=redis-cluster-{0..11}.redis-cluster-headless
    # In Floci mode, the Redis endpoint is the AWS-native proxy endpoint. In compose mode,
    # fall back to the local node so the old dev flow still works.
    local redis_eps=()
    for i in 0 1 2 3 4 5 6 7 8 9 10 11; do redis_eps+=("${redis_ip}" "redis-cluster-${i}"); done
    emit_pair "redis-cluster" 6379 "${redis_ip}" ""
    emit_pair "redis-cluster-headless" 6379 "${redis_eps[@]}"

    # NATS: nats://nats-headless:4222 + nats://nats-{0..4}.nats-headless:4222
    local nats_eps=()
    for i in 0 1 2 3 4; do nats_eps+=("${nats_ips[$i]}" "nats-${i}"); done
    emit_pair "nats-headless" 4222 "${nats_eps[@]}"

    # Elasticsearch: ELASTICSEARCH_URL=elasticsearch + ELASTICSEARCH_NODES=elasticsearch-{0..5}
    # Floci provides the OpenSearch domain endpoint directly; when not set, preserve the
    # original 3-node compose-only behavior. Skip entirely if no IP resolved so we never
    # publish an EndpointSlice with an empty/name address (addressType IPv4).
    if [[ "${es_ip}" =~ ^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        emit_pair "elasticsearch" 9200 "${es_ip}" ""
        local es_eps=()
        for i in 0 1 2 3 4 5; do es_eps+=("${es_ip}" "elasticsearch-${i}"); done
        emit_pair "elasticsearch-headless" 9200 "${es_eps[@]}"
    else
        echo "   ⚠ no Elasticsearch/OpenSearch IP available — skipping ES endpoints"
    fi

    # PgBouncers: 10 shard bouncers (auth×2, order×4, product×4)
    # In aws mode the ConfigMap DB URLs point straight at the Floci RDS proxies,
    # so the compose pgbouncers (and their Postgres shards) are not started and
    # no pgbouncer-* services are emitted here.
    if [[ "${DB_BACKEND:-}" != "aws" ]]; then
    local kv svc cip
    for kv in "auth s0 ecommerce_pgbouncer_auth_s0" "auth s1 ecommerce_pgbouncer_auth_s1" \
              "order s0 ecommerce_pgbouncer_order_s0" "order s1 ecommerce_pgbouncer_order_s1" \
              "order s2 ecommerce_pgbouncer_order_s2" "order s3 ecommerce_pgbouncer_order_s3" \
              "product s0 ecommerce_pgbouncer_product_s0" "product s1 ecommerce_pgbouncer_product_s1" \
              "product s2 ecommerce_pgbouncer_product_s2" "product s3 ecommerce_pgbouncer_product_s3"; do
        set -- ${kv}
        svc="pgbouncer-${1}-${2}"
        cip="$(infra_ip "${3}")"
        emit_pair "${svc}" 6432 "${cip}" ""
    done
    fi

    # OTEL collector (OTEL_EXPORTER_OTLP_ENDPOINT)
    emit_pair "otel-collector" 4318 "$(infra_ip ecommerce_otel_collector)" ""

    echo "▶ Applying infra endpoint services..."
    # Fresh cluster: the ecommerce namespace ships with the base manifests
    # (applied next), so create it first or the infra Services/Endpoints fail.
    kubectl apply -f "${RENDER_BASE}/namespace.yml" >/dev/null
    kubectl apply -f "${INFRA_OUT}"
}

# Light local overlay: 1 replica per service + matching HPA/PDB so the whole
# stack fits on a single-node local k3s cluster.
cat > "${OVERLAY_DIR}/kustomization.yml" <<EOF
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: ecommerce

resources:
$(for svc in api-gateway auth-service cart-service order-service product-service inventory-service payment-service notification-service web-shop; do echo "  - base/${svc}.yml"; done)
  - base/configmap.yml
  - base/secrets.yml
  - base/namespace.yml

patches:
  - target:
      kind: Deployment
    patch: |-
      - op: add
        path: /spec/template/spec/securityContext/runAsUser
        value: 1000
      - op: add
        path: /spec/template/spec/securityContext/runAsGroup
        value: 1000
      # Local registry tag is pinned to :latest — always re-pull so updated
      # images are picked up on every deploy.
      - op: replace
        path: /spec/template/spec/containers/0/imagePullPolicy
        value: Always
      # Local emulator: infra is wired in via floci-infra.yml, but /health can
      # still 503 while deps warm up — drop probes so pods stay up.
      - op: remove
        path: /spec/template/spec/containers/0/livenessProbe
      - op: remove
        path: /spec/template/spec/containers/0/readinessProbe
  # web-shop runs nginx (root) to bind :80 — undo the runAsUser/runAsGroup
  # patch applied above so the frontend container keeps the image default user.
  - target:
      kind: Deployment
      name: web-shop
    patch: |-
      - op: remove
        path: /spec/template/spec/securityContext/runAsUser
      - op: remove
        path: /spec/template/spec/securityContext/runAsGroup
  - target:
      kind: HorizontalPodAutoscaler
    patch: |-
      - op: replace
        path: /spec/minReplicas
        value: 1
      - op: replace
        path: /spec/maxReplicas
        value: 1
  - target:
      kind: PodDisruptionBudget
    patch: |-
      - op: replace
        path: /spec/minAvailable
        value: 1
$(for svc in api-gateway auth-service cart-service order-service product-service inventory-service payment-service notification-service web-shop; do cat <<PATCH
  - target:
      kind: Deployment
      name: ${svc}
    patch: |-
      - op: replace
        path: /spec/replicas
        value: 1
PATCH
done)
EOF

# ---------------------------------------------------------------------------
# Data-plane env: the base ConfigMap no longer carries the DB/Redis/ES keys
# (the in-cluster data plane was replaced by AWS-managed equivalents, so those
# keys live in per-env overlay configmaps). This Floci overlay re-injects them:
#   - DB URLs  → compose pgbouncers (k8s mode) or the Floci RDS proxies (aws).
#   - Redis/ES → logical names (redis-cluster / elasticsearch) that the infra
#     EndpointSlices below resolve to the compose containers or the emulator.
# ---------------------------------------------------------------------------
emit_data_key() {
    printf '      - op: add\n        path: /data/%s\n        value: "%s"\n' "$1" "$2" >> "${OVERLAY_DIR}/kustomization.yml"
}

# k8s (compose) mode: shard DBs behind the per-shard compose pgbouncers.
compose_db_url() {
    local key="$1" svc="$2" shard="$3" db="$4" ro=""
    [[ "${key}" == *_READ_URL ]] && ro="_ro"
    printf 'postgresql://%s:%s@pgbouncer-%s-%s:6432/%s%s?schema=public' \
        "${DB_USER:-root}" "${DB_PASSWORD:-password}" "${svc}" "${shard}" "${db}" "${ro}"
}

# AWS mode: point every DB URL at the Floci RDS proxies instead of the compose
# pgbouncers. Read + write both use the same shard database on the emulator (the
# compose _ro replica DBs are a k8s-only concept).
aws_db_url() {
    local svc="$1" shard="$2"
    local ep_var="DB_${svc}_${shard}"
    local ep="${!ep_var:-}"
    [[ -n "${ep}" ]] || return 1
    printf 'postgresql://%s:%s@%s/%s_%s?schema=public' \
        "${DB_USER:-root}" "${DB_PASSWORD:-password}" "${ep}" "${svc}" "${shard}"
}

echo "▶ Re-injecting data-plane env (DB/Redis/ES) into the ConfigMap..."
cat >> "${OVERLAY_DIR}/kustomization.yml" <<'CONFIGMAP_PATCH'
  - target:
      kind: ConfigMap
      name: ecommerce-config
    patch: |-
CONFIGMAP_PATCH

emit_data_key "REDIS_HOST" "redis-cluster"
emit_data_key "REDIS_PORT" "6379"
emit_data_key "REDIS_CLUSTER_MODE" "true"
emit_data_key "REDIS_CLUSTER_NODES" "redis-cluster-0.redis-cluster-headless:6379,redis-cluster-1.redis-cluster-headless:6379,redis-cluster-2.redis-cluster-headless:6379,redis-cluster-3.redis-cluster-headless:6379,redis-cluster-4.redis-cluster-headless:6379,redis-cluster-5.redis-cluster-headless:6379,redis-cluster-6.redis-cluster-headless:6379,redis-cluster-7.redis-cluster-headless:6379,redis-cluster-8.redis-cluster-headless:6379,redis-cluster-9.redis-cluster-headless:6379,redis-cluster-10.redis-cluster-headless:6379,redis-cluster-11.redis-cluster-headless:6379"
emit_data_key "ELASTICSEARCH_URL" "http://elasticsearch:9200"
emit_data_key "ELASTICSEARCH_NODES" "http://elasticsearch-0.elasticsearch-headless:9200,http://elasticsearch-1.elasticsearch-headless:9200,http://elasticsearch-2.elasticsearch-headless:9200,http://elasticsearch-3.elasticsearch-headless:9200,http://elasticsearch-4.elasticsearch-headless:9200,http://elasticsearch-5.elasticsearch-headless:9200"
emit_data_key "ES_NUMBER_OF_SHARDS" "6"
emit_data_key "ES_NUMBER_OF_REPLICAS" "2"
# The `elasticsearch` EndpointSlice is backed by the Floci OpenSearch emulator
# (AWS/floci never runs real Elasticsearch). When no emulator is up the app
# falls back to the local compose ES cluster, in which case it must speak the
# Elasticsearch client again. ES_BACKEND is recorded by floci-infra.sh.
emit_data_key "SEARCH_BACKEND" "${ES_BACKEND:-elasticsearch}"

while read -r key svc shard db; do
    if [[ "${DB_BACKEND:-}" = "aws" && -n "${FLOCI_IP:-}" ]]; then
        if value="$(aws_db_url "${svc}" "${shard}")"; then
            emit_data_key "${key}" "${value}"
        else
            echo "   ⚠ missing endpoint for ${key} — skipping" >&2
        fi
    else
        emit_data_key "${key}" "$(compose_db_url "${key}" "${svc}" "${shard}" "${db}")"
    fi
done <<'URL_MAP'
AUTH_DATABASE_WRITE_URL auth s0 auth
AUTH_DATABASE_READ_URL auth s0 auth
AUTH_S0_DATABASE_WRITE_URL auth s0 auth_s0
AUTH_S0_DATABASE_READ_URL auth s0 auth_s0
AUTH_S1_DATABASE_WRITE_URL auth s1 auth_s1
AUTH_S1_DATABASE_READ_URL auth s1 auth_s1
ORDER_DATABASE_WRITE_URL order s0 orders
ORDER_DATABASE_READ_URL order s0 orders
ORDER_S0_DATABASE_WRITE_URL order s0 orders_s0
ORDER_S0_DATABASE_READ_URL order s0 orders_s0
ORDER_S1_DATABASE_WRITE_URL order s1 orders_s1
ORDER_S1_DATABASE_READ_URL order s1 orders_s1
ORDER_S2_DATABASE_WRITE_URL order s2 orders_s2
ORDER_S2_DATABASE_READ_URL order s2 orders_s2
ORDER_S3_DATABASE_WRITE_URL order s3 orders_s3
ORDER_S3_DATABASE_READ_URL order s3 orders_s3
PRODUCT_DATABASE_WRITE_URL product s0 products
PRODUCT_DATABASE_READ_URL product s0 products
PRODUCT_S0_DATABASE_WRITE_URL product s0 products_s0
PRODUCT_S0_DATABASE_READ_URL product s0 products_s0
PRODUCT_S1_DATABASE_WRITE_URL product s1 products_s1
PRODUCT_S1_DATABASE_READ_URL product s1 products_s1
PRODUCT_S2_DATABASE_WRITE_URL product s2 products_s2
PRODUCT_S2_DATABASE_READ_URL product s2 products_s2
PRODUCT_S3_DATABASE_WRITE_URL product s3 products_s3
PRODUCT_S3_DATABASE_READ_URL product s3 products_s3
CART_DATABASE_WRITE_URL product s0 products
CART_DATABASE_READ_URL product s0 products
URL_MAP

# The ECR-style registry hostname (…localhost:5100) does not resolve to the
# host registry inside the k3s node, so containerd can never pull skyline-*
# images (ErrImagePull). Mirror it to http://host.docker.internal:5100 and
# restart the node so containerd picks it up. Runs on every deploy so a freshly
# recreated node (full emulator reset) gets it automatically.
ensure_k3s_registry() {
    local node="${K3S_NODE}"
    local cfg cur
    cfg='mirrors:
  "000000000000.dkr.ecr.us-east-1.localhost:5100":
    endpoint:
      - "http://host.docker.internal:5100"
configs:
  "000000000000.dkr.ecr.us-east-1.localhost:5100":
    tls:
      insecure_skip_verify: true
'
    if ! docker inspect "${node}" >/dev/null 2>&1; then
        echo "   ⚠ k3s node ${node} not running — skipping registry mirror"
        return 0
    fi
    cur="$(docker exec "${node}" cat /etc/rancher/k3s/registries.yaml 2>/dev/null || true)"
    if [[ "${cur}" = "${cfg}" ]]; then
        echo "   k3s registry mirror already configured"
        return 0
    fi
    echo "   configuring k3s registry mirror (host registry :5100)..."
    docker exec "${node}" sh -c 'mkdir -p /etc/rancher/k3s'
    printf '%s' "${cfg}" | docker exec -i "${node}" sh -c 'cat > /etc/rancher/k3s/registries.yaml'
    docker restart "${node}" >/dev/null
    echo "   waiting for k3s node to come back Ready..."
    for _ in $(seq 1 90); do
        if kubectl get nodes >/dev/null 2>&1 && kubectl get nodes | grep -q Ready; then
            echo "   k3s node Ready"
            return 0
        fi
        sleep 5
    done
    echo "   ⚠ k3s node not Ready after registry mirror restart" >&2
    return 0
}

echo "▶ Attaching k3s node to compose network + publishing infra endpoints..."
connect_k3s_to_compose_network
if [[ "${DB_BACKEND:-}" = "aws" ]]; then
    connect_k3s_to_floci_network
fi
ensure_k3s_registry
render_infra_services

echo "▶ Applying rendered manifests..."
kubectl apply -k "${OVERLAY_DIR}"

echo ""
echo "▶ Deployments:"
kubectl -n ecommerce get deployments
echo ""
echo "▶ Pods:"
kubectl -n ecommerce get pods
