#!/bin/bash
# ---------------------------------------------------------------------------
# deploy.sh — ONE command to deploy the full Skyline Shop stack
#
#   ./scripts/deploy.sh           # deploy to Floci  (local AWS emulation)
#   ./scripts/deploy.sh floci     # same as above
#   ./scripts/deploy.sh aws       # deploy to real AWS (ECR + EKS/ArgoCD)
#
# Pipeline (runs for both targets):
#   1. switch .env to the target mode            (scripts/use-env.sh)
#   2. floci only: start emulator + seed AWS     (docker-compose.floci.yml, floci-seed.sh)
#   3. resolve secrets from AWS Secrets Manager  (secret: <project>/<env>/app-secrets)
#   4. build service images if missing & push to the registry (local :5100 or ECR)
#   5. floci: render + apply k8s manifests to the Floci k3s cluster
#      aws:   push images to ECR, then let ArgoCD sync (or kubectl apply the overlay)
#
# Env knobs: REGISTRY, TAG, KUBECONFIG, SKYLINE_PROJECT, SKYLINE_ENV
# ---------------------------------------------------------------------------
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT_DIR}"

TARGET="${1:-}"
case "${TARGET}" in
    "") ;;
    floci|aws) ;;
    *) echo "Usage: ./scripts/deploy.sh [floci|aws]" >&2; exit 1 ;;
esac

PROJECT="${SKYLINE_PROJECT:-skyline-shop}"
ENV_NAME="${SKYLINE_ENV:-staging}"
DB_BACKEND="${DB_BACKEND:-aws}"
export TAG="${TAG:-latest}"
export FORCE_REBUILD="${FORCE_REBUILD:-0}"

# ---------------------------------------------------------------------------
# Friendly interactive setup. When no target is passed and we're on a real
# terminal, walk the user through a few quick questions before deploying.
# Every answer has a sensible default, so just pressing Enter keeps the plan
# simple and the script stays fully non-interactive in CI (no TTY).
# ---------------------------------------------------------------------------
if [[ -z "${TARGET}" ]]; then
    TARGET="floci"
    if [[ -t 0 ]]; then
        echo ""
        echo "👋 Hey! Let's get Skyline Shop up and running."
        echo "    I'll ask a couple of quick questions — press Enter to accept the default. 😊"
        echo ""
        printf "📍 Where should we deploy?  [floci/aws] (floci = local emulator, aws = real AWS) > "
        read -r answer
        if [[ -n "${answer}" ]]; then
            TARGET="$(echo "${answer}" | tr '[:upper:]' '[:lower:]')"
        fi
        case "${TARGET}" in
            floci|aws) ;;
            *) echo "   Hmm, I don't know \"${TARGET}\" — no worries, I'll use floci for you. 😉"
               TARGET="floci" ;;
        esac

        printf "🏷️  Environment?  [staging/prod] (staging) > "
        read -r answer
        if [[ -n "${answer}" ]]; then
            ENV_NAME="$(echo "${answer}" | tr '[:upper:]' '[:lower:]')"
        fi
        case "${ENV_NAME}" in
            staging|prod|production) [[ "${ENV_NAME}" = "production" ]] && ENV_NAME="prod" ;;
            *) echo "   Got it — using \"${ENV_NAME}\" for the environment. 👍"
        esac

        printf "💾  Database backend?  [aws/k8s] (aws = Floci-managed RDS/Redis/OpenSearch, k8s = local compose/K8s DB stack) > "
        read -r answer
        if [[ -n "${answer}" ]]; then
            DB_BACKEND="$(echo "${answer}" | tr '[:upper:]' '[:lower:]')"
        fi

        printf "🔨 Rebuild images from source?  [y/N] (only builds missing images otherwise) > "
        read -r answer
        case "${answer}" in
            y|Y|yes|YES) FORCE_REBUILD="1" ;;
        esac
    fi
fi
case "${DB_BACKEND}" in
    aws|k8s) ;;
    *) DB_BACKEND="aws" ;;
esac
export DB_BACKEND
export KUBECONFIG="${KUBECONFIG:-${ROOT_DIR}/.kube/config}"
SECRET_ID="${PROJECT}/${ENV_NAME}/app-secrets"

if [ "${TARGET}" = "floci" ]; then
    export REGISTRY="${REGISTRY:-000000000000.dkr.ecr.us-east-1.localhost:5100}"
    AWS() { "${ROOT_DIR}/scripts/floci-aws.sh" "$@"; }
else
    # Real AWS: require an account id for the ECR registry URI.
    : "${AWS_ACCOUNT_ID:?set AWS_ACCOUNT_ID (or REGISTRY) for real AWS deploys}"
    export REGISTRY="${REGISTRY:-${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_DEFAULT_REGION:-us-east-1}.amazonaws.com}"
    AWS() { aws "$@"; }
fi

SERVICES=(api-gateway auth-service cart-service order-service product-service \
          inventory-service payment-service notification-service web-shop)

# ---------------------------------------------------------------------------
# refresh_kubeconfig — Floci only. The k3s node container is recreated by the
# emulator on every full reset, which regenerates its TLS CA and may remap the
# API port. Rewrite .kube/config so kubectl works without any manual touch:
# CA pulled from the live node container, server port discovered from docker,
# exec plugin command resolved to the absolute repo path.
# ---------------------------------------------------------------------------
refresh_kubeconfig() {
    local node="floci-eks-${PROJECT}-${ENV_NAME}-cluster"
    local kube="${KUBECONFIG}"
    local ca="" host_port=""
    for _ in $(seq 1 30); do
        ca="$(docker exec "${node}" cat /var/lib/rancher/k3s/server/tls/server-ca.crt 2>/dev/null || true)"
        host_port="$(docker port "${node}" 6443/tcp 2>/dev/null | head -1 | sed -E 's/.*:([0-9]+)$/\1/' || true)"
        [[ -n "${ca}" && -n "${host_port}" ]] && break
        sleep 2
    done
    if [[ -z "${ca}" || -z "${host_port}" ]]; then
        echo "   ⚠ k3s CA/port not found for ${node} — reusing existing kubeconfig"
        return 0
    fi

    local ca_b64 cur=""
    ca_b64="$(printf '%s' "${ca}" | base64 | tr -d '\n')"
    if [[ -f "${kube}" ]]; then
        cur="$(awk '/certificate-authority-data:/{print $2; exit}' "${kube}" 2>/dev/null || true)"
    fi

    if [[ "${cur}" != "${ca_b64}" ]]; then
        cat > "${kube}" <<EOF
apiVersion: v1
kind: Config
clusters:
- cluster:
    server: https://localhost:${host_port}
    certificate-authority-data: ${ca_b64}
  name: floci-skyline
contexts:
- context:
    cluster: floci-skyline
    user: floci-admin
  name: floci-skyline
current-context: floci-skyline
users:
- name: floci-admin
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: ${ROOT_DIR}/scripts/floci-kube-token.sh
      env:
      - name: CLUSTER_NAME
        value: ${PROJECT}-${ENV_NAME}-cluster
      interactiveMode: Never
      provideClusterInfo: false
EOF
        echo "   refreshed .kube/config (new CA, server :${host_port})"
    fi

    for _ in $(seq 1 30); do
        if kubectl --kubeconfig "${kube}" get nodes >/dev/null 2>&1; then
            echo "   kubeconfig verified"
            return 0
        fi
        sleep 3
    done
    echo "   ⚠ kubectl not reachable yet — this will surface in floci-deploy.sh" >&2
}

# ---------------------------------------------------------------------------
# prune_stale_nodes — a Floci emulator reset recreates the k3s node container,
# but the previous container's Node object (old InternalIP) lingers as
# NotReady. kube-apiserver routes port-forward to that stale kubelet and
# fails with "502 Bad Gateway while dialing <old-ip>:10250". Drop every
# NotReady node so port-forward targets the live node.
# ---------------------------------------------------------------------------
prune_stale_nodes() {
    local stale=""
    stale="$(kubectl --kubeconfig "${KUBECONFIG}" get nodes --no-headers 2>/dev/null | awk '$2 != "Ready" {print $1}' || true)"
    if [[ -n "${stale}" ]]; then
        for n in ${stale}; do
            echo "   pruning stale node ${n}"
            kubectl --kubeconfig "${KUBECONFIG}" delete node "${n}" >/dev/null 2>&1 || true
        done
    fi
}

# ---------------------------------------------------------------------------
# ensure_k3s_node — a Floci emulator reset sometimes drops the k3s node
# container while the EKS cluster record survives. Without the node there is no
# kube-apiserver to talk to, so delete + recreate the EKS cluster to make the
# emulator spawn a fresh node container, then wait for it to come up. This
# wipes k8s workload state, but floci-deploy.sh re-applies everything and the
# RDS/Redis/OpenSearch data plane is untouched.
# ---------------------------------------------------------------------------
ensure_k3s_node() {
    local node="floci-eks-${PROJECT}-${ENV_NAME}-cluster"
    if docker ps --format '{{.Names}}' | grep -q "^${node}$"; then
        return 0
    fi
    local cluster="${PROJECT}-${ENV_NAME}-cluster"
    echo "   ⚠ k3s node ${node} not running — recreating Floci EKS cluster ${cluster}..."
    AWS eks delete-cluster --name "${cluster}" >/dev/null 2>&1 || true
    sleep 3
    AWS eks create-cluster --name "${cluster}" \
        --role-arn arn:aws:iam::000000000000:role/eks-cluster \
        --resources-vpc-config "{}" >/dev/null 2>&1 || true
    for _ in $(seq 1 60); do
        if docker ps --format '{{.Names}}' | grep -q "^${node}$"; then
            echo "   k3s node ${node} recreated"
            return 0
        fi
        sleep 2
    done
    echo "   ⚠ k3s node did not come back — check ecommerce_floci logs" >&2
    return 1
}

# ---------------------------------------------------------------------------
# start_port_forwards — the k8s api-gateway and web-shop Services are ClusterIP
# (no ingress controller / NodePort in the local k3s), so expose them to the
# host browser with background kubectl port-forwards. Runs after every deploy
# and replaces any forward left behind by a previous run.
#
# The k3s node container is managed by the Floci emulator, which respawns it
# during this run (ensure_k3s_registry restarts it and the emulator recreates
# it), orphaning the previous Node object as NotReady with the old InternalIP.
# kube-apiserver would then route port-forwards at the dead kubelet (502).
# So: prune stale nodes, wait for every pod to run on a Ready node, and only
# then start the forwards.
# ---------------------------------------------------------------------------
start_port_forwards() {
    local pidfile_api="/tmp/skyline-fwd-api.pid"
    local pidfile_web="/tmp/skyline-fwd-web.pid"
    for pidfile in "${pidfile_api}" "${pidfile_web}"; do
        if [[ -f "${pidfile}" ]]; then
            kill "$(cat "${pidfile}")" 2>/dev/null || true
            rm -f "${pidfile}"
        fi
    done

    prune_stale_nodes
    echo "   waiting for pods to be Ready on the live node..."
    for _ in $(seq 1 90); do
        local ready_node bad_pod
        ready_node="$(kubectl --kubeconfig "${KUBECONFIG}" get nodes --no-headers 2>/dev/null | awk '$2 == "Ready" {print $1; exit}')"
        bad_pod="$(kubectl --kubeconfig "${KUBECONFIG}" -n ecommerce get pods --no-headers 2>/dev/null | awk -v n="${ready_node}" '$7 != n || $3 != "Running" || $2 != "1/1" {print $1; exit}')"
        if [[ -n "${ready_node}" && -z "${bad_pod}" ]]; then
            break
        fi
        sleep 3
    done

    echo "▶ Exposing web-shop + api-gateway via kubectl port-forward..."
    kubectl --kubeconfig "${KUBECONFIG}" -n ecommerce port-forward svc/api-gateway 3000:3000 >/tmp/skyline-fwd-api.log 2>&1 &
    echo $! > "${pidfile_api}"
    kubectl --kubeconfig "${KUBECONFIG}" -n ecommerce port-forward svc/web-shop 8080:80 >/tmp/skyline-fwd-web.log 2>&1 &
    echo $! > "${pidfile_web}"

    sleep 3
    for pair in "${pidfile_api}:api-gateway" "${pidfile_web}:web-shop"; do
        local pidfile="${pair%%:*}" name="${pair##*:}"
        if ! kill -0 "$(cat "${pidfile}")" 2>/dev/null; then
            echo "   ⚠ ${name} port-forward failed — see /tmp/skyline-fwd-*.log" >&2
        fi
    done
}

echo "=========================================================="
echo "▶ Deploying Skyline Shop   target=${TARGET}  env=${ENV_NAME}"
echo "▶ Registry : ${REGISTRY}   tag=${TAG}"
echo "=========================================================="

if [[ -t 0 && -z "${SKIP_CONFIRM:-}" ]]; then
    printf "🚀 Ready to roll? [Y/n] > "
    read -r answer
    case "${answer}" in
        n|N|no|NO) echo "   Okay, aborting — nothing was changed. 👋"; exit 0 ;;
    esac
fi

# --- 0. Ensure .env exists (fresh clones won't have one) -------------------
if [ ! -f "${ROOT_DIR}/.env" ]; then
    echo "▶ Creating .env from .env.example..."
    cp "${ROOT_DIR}/.env.example" "${ROOT_DIR}/.env"
fi

# --- 1. Switch .env to the target mode -------------------------------------
# use-env.sh speaks `local` (Floci) and `aws`; map our target names onto them.
ENV_MODE="local"
[ "${TARGET}" = "aws" ] && ENV_MODE="aws"
"${ROOT_DIR}/scripts/use-env.sh" "${ENV_MODE}"

# --- 2. (floci) start infra + emulator, seed AWS resources & secrets --------
if [ "${TARGET}" = "floci" ]; then
    if [ "${DB_BACKEND}" = "aws" ]; then
        echo "▶ Using AWS-managed Floci DB backend — compose runs ONLY the shared infra"
        echo "  (NATS + OpenTelemetry collector + Jaeger). The app services run in k8s"
        echo "  only; the data plane comes from Floci RDS/ElastiCache/OpenSearch."
        # docker compose config --services lists every service; in aws mode we
        # stop everything EXCEPT the shared infra the k8s cluster still wires to
        # through floci-deploy.sh EndpointSlices. In particular the compose app
        # services + web-shop must NOT run: they shadow the k8s deployments on
        # :3000/:8080 and 500 against the stopped compose data plane.
        COMPOSE_SERVICES=()
        while IFS= read -r svc; do COMPOSE_SERVICES+=("${svc}"); done < <(docker compose -f docker-compose.yml config --services 2>/dev/null)
        KEEP=(nats_1 nats_2 nats_3 nats_4 nats_5 otel_collector jaeger)
        STOP=()
        for svc in "${COMPOSE_SERVICES[@]}"; do
            case " ${KEEP[*]} " in
                *" ${svc} "*) ;;
                *) STOP+=("${svc}") ;;
            esac
        done
        echo "▶ Starting compose shared infra: ${KEEP[*]}"
        docker compose -f docker-compose.yml up -d "${KEEP[@]}"
        # Stop containers a previous full compose run may still be running.
        if [[ "${#STOP[@]}" -gt 0 ]]; then
            docker compose -f docker-compose.yml stop "${STOP[@]}" >/dev/null 2>&1 || true
        fi
    else
        echo "▶ Using K8s/compose DB backend — starting the full local infra stack"
        echo "  (Postgres shards, Redis, NATS, Elasticsearch, observability)"
        docker compose -f docker-compose.yml up -d
    fi
    docker compose -f docker-compose.floci.yml up -d
    if [ "${DB_BACKEND}" = "aws" ]; then
        bash "${ROOT_DIR}/scripts/floci-infra.sh"
        bash "${ROOT_DIR}/scripts/floci-seed-db.sh"
        bash "${ROOT_DIR}/scripts/floci-pgadmin.sh"
        # The tools compose reuses the standard container names from the main
        # compose — drop any stopped leftovers so it can take them over.
        docker rm -f ecommerce_pgadmin ecommerce_redis_insight >/dev/null 2>&1 || true
        echo "▶ Starting data tools (pgAdmin :5050, Redis Insight :5540, OpenSearch Dashboards :5601)..."
        docker compose -f docker-compose.tools.yml up -d
    fi
    "${ROOT_DIR}/scripts/floci-seed.sh"
    ensure_k3s_node
    refresh_kubeconfig
    prune_stale_nodes
fi

# --- 3. Resolve secrets from AWS Secrets Manager ---------------------------
echo "▶ Resolving secrets from AWS Secrets Manager (${SECRET_ID})..."
if SECRET_JSON="$(AWS secretsmanager get-secret-value --secret-id "${SECRET_ID}" --query SecretString --output text 2>/dev/null)"; then
    export SKYLINE_JWT_SECRET="$(echo "${SECRET_JSON}" | jq -r '.JWT_SECRET')"
    export SKYLINE_JWT_REFRESH_SECRET="$(echo "${SECRET_JSON}" | jq -r '.JWT_REFRESH_SECRET')"
    export SKYLINE_POSTGRES_PASSWORD="$(echo "${SECRET_JSON}" | jq -r '.POSTGRES_PASSWORD')"
    echo "   secrets resolved"
else
    echo "   ⚠ ${SECRET_ID} not found — generating throwaway values (not persisted)."
    echo "   Run scripts/floci-seed.sh to store real values in Secrets Manager."
    export SKYLINE_JWT_SECRET="$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 48)"
    export SKYLINE_JWT_REFRESH_SECRET="$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 48)"
    export SKYLINE_POSTGRES_PASSWORD="$(openssl rand -base64 36 | tr -dc 'A-Za-z0-9' | head -c 32)"
fi

# --- 4. Build (if missing) & push service images ---------------------------
build_and_push() {
    local svc="$1"
    local local_tag="skyline-${svc}:${TAG}"
    local remote="${REGISTRY}/skyline-${svc}:${TAG}"

    if [[ "${FORCE_REBUILD}" = "1" ]] || ! docker image inspect "${local_tag}" >/dev/null 2>&1; then
        if [[ "${FORCE_REBUILD}" = "1" ]]; then
            echo "==> rebuilding ${svc} (forced)..."
            docker build -t "${local_tag}" -f "apps/${svc}/Dockerfile" .
        elif docker image inspect "${remote}" >/dev/null 2>&1; then
            docker tag "${remote}" "${local_tag}"
        else
            echo "==> building ${svc} (image not found locally)..."
            docker build -t "${local_tag}" -f "apps/${svc}/Dockerfile" .
        fi
    fi

    echo "==> pushing ${remote}"
    docker tag "${local_tag}" "${remote}"
    # Retry the push — Docker Desktop's HTTP proxy intermittently times out on :5100.
    for _ in 1 2 3 4 5; do
        if docker push "${remote}" >/dev/null 2>&1; then
            echo "   pushed ${svc}"
            return 0
        fi
        sleep 3
    done
    echo "   ❌ failed to push ${svc}" >&2
    return 1
}

for svc in "${SERVICES[@]}"; do
    build_and_push "${svc}"
done

# --- 5. Deploy to the cluster ----------------------------------------------
if [ "${TARGET}" = "floci" ]; then
    echo "▶ Deploying to the Floci EKS cluster (.kube/config)..."
    "${ROOT_DIR}/scripts/floci-deploy.sh"
    start_port_forwards
else
    echo "▶ Images pushed to ECR (${REGISTRY})."
    if kubectl --kubeconfig "${KUBECONFIG}" cluster-info >/dev/null 2>&1; then
        echo "▶ Applying k8s/overlays/production to the live cluster..."
        kubectl --kubeconfig "${KUBECONFIG}" apply -k k8s/overlays/production
    else
        echo "▶ No live cluster reachable — ArgoCD will sync the new image tags"
        echo "   from k8s/overlays/production (see argocd/application.yml)."
    fi
fi

echo ""
echo "✅ Done. Stack deployed to ${TARGET}."
if [ "${TARGET}" = "floci" ]; then
    echo "   UI console: http://localhost:8080   API: http://localhost:3000"
fi
