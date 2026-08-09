#!/usr/bin/env bash
# =============================================================================
# Skyline Shop — interactive setup / installer
#
#   ./setup.sh            guided setup (test or prod, then lite/mid/full/custom)
#   ./setup.sh --dry-run  resolve the plan, validate compose, but do NOT start
#   ./setup.sh --volumes  also wipe named volumes when tearing the old stack down
#   ./setup.sh --help     usage
#
# Profiles:
#   lite   minimal stack for low-end devices (no shards/ES/observability/GUIs)
#   mid    balanced dev stack (shards + replicas, single-node ES + Kibana,
#          pgAdmin/RedisInsight, nginx LB)
#   full   everything, identical to `docker compose up -d` (63 containers)
#   custom pick every component yourself
#
# The resolved compose file is written to .setup/docker-compose.yml and the
# active file is remembered in .setup/active so a later run tears the previous
# stack down before starting the new one (container names are shared).
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${ROOT}"

# ----------------------------------------------------------------------------
# ANSI palette + terminal helpers
# ----------------------------------------------------------------------------
GREEN=$'\033[0;32m'; CYAN=$'\033[0;36m'; YELLOW=$'\033[0;33m'
RED=$'\033[0;31m';   BOLD=$'\033[1m';     DIM=$'\033[2m'
RESET=$'\033[0m'

info()  { printf '%s›%s %s\n'   "${CYAN}" "${RESET}" "$*"; }
ok()    { printf '%s✔%s %s\n'   "${GREEN}" "${RESET}" "$*"; }
warn()  { printf '%s⚠%s %s\n'   "${YELLOW}" "${RESET}" "$*"; }
err()   { printf '%s✖%s %s\n'   "${RED}" "${RESET}" "$*" >&2; }
dim()   { printf '%s%s%s' "${DIM}" "$*" "${RESET}"; }

section() { printf '\n%s%s %s %s%s\n' "${CYAN}" "$(printf '%*s' 2 '')" "$1" "$(printf '─%.0s' $(seq 1 $((60 - ${#1}))))" "${RESET}"; }

PROJECT_NAME="skyline-shop-commerceos-microservices"
SETUP_DIR="${ROOT}/.setup"
ACTIVE_FILE="${SETUP_DIR}/active"

# ----------------------------------------------------------------------------
# Spinner (run in background while a job runs)
# ----------------------------------------------------------------------------
spin() {
  local pid=$1 msg=$2 chars='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏' i=0
  while kill -0 "${pid}" 2>/dev/null; do
    i=$(( (i + 1) % ${#chars} ))
    printf '\r%s %s %s' "${CYAN}" "${chars:$i:1}" "${msg}"
    sleep 0.1
  done
  printf '\r\033[K'
}

# ----------------------------------------------------------------------------
# Banner
# ----------------------------------------------------------------------------
banner() {
  cat <<'EOF'

  ███████╗██╗  ██╗██╗   ██╗██╗     ██╗███╗   ██╗███████╗
  ██╔════╝██║ ██╔╝╚██╗ ██╔╝██║     ██║████╗  ██║██╔════╝
  ███████╗█████╔╝  ╚████╔╝ ██║     ██║██╔██╗ ██║█████╗
  ╚════██║██╔═██╗   ╚██╔╝  ██║     ██║██║╚██╗██║██╔══╝
  ███████║██║  ██╗   ██║   ███████╗██║██║ ╚████║███████╗
  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝╚═╝  ╚═══╝╚══════╝

EOF
  printf '%s' "${BOLD}"; printf '%*s' 12 ''; printf 'Skyline Shop — e-commerce microservices%s\n\n' "${RESET}"
}

# ----------------------------------------------------------------------------
# Small input helpers
# ----------------------------------------------------------------------------
ask() { # question default
  local q="$1" d="$2" ans=""
  printf '%s %s ' "${q}" "$(dim "[${d}]")" >&2
  read -r ans || ans="${d}"
  printf '%s' "${ans:-${d}}"
}

ask_int() { # question default min max
  local q="$1" d="$2" min="$3" max="$4" ans
  while true; do
    ans="$(ask "${q}" "${d}")"
    if [[ "${ans}" =~ ^[0-9]+$ ]] && (( ans >= min && ans <= max )); then
      printf '%s' "${ans}"; return 0
    fi
    warn "Please enter a number between ${min} and ${max}."
  done
}

ask_yn() { # question default(1|0 -> yes|no)
  local q="$1" d="$2" ans
  local disp=yes; [[ "${d}" == "no" ]] && disp=no
  while true; do
    ans="$(ask "${q}" "${disp}")"
    case "${ans}" in
      y|Y|yes|YES) printf '%s' yes; return 0 ;;
      n|N|no|NO)   printf '%s' no;  return 0 ;;
      *) warn "Please answer y or n." ;;
    esac
  done
}

confirm() { # question default(yes|no) -> run while user disagrees
  local q="$1" d="$2" ans
  ans="$(ask_yn "${q}" "${d}")"
  [[ "${ans}" == "yes" ]]
}

set_env_var() { # key value — upsert into .env
  local key="$1" value="$2"
  if grep -q "^${key}=" ".env"; then
    sed -i.bak "s|^${key}=.*|${key}=\"${value}\"|" ".env" && rm -f ".env.bak"
  else
    printf '%s="%s"\n' "${key}" "${value}" >> ".env"
  fi
}

# ----------------------------------------------------------------------------
# Flags
# ----------------------------------------------------------------------------
CLEAN_VOLUMES=false
DRY_RUN=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    -v|--volumes) CLEAN_VOLUMES=true ;;
    --dry-run)    DRY_RUN=true ;;
    -h|--help)
      sed -n '2,22p' "${BASH_SOURCE[0]}"
      exit 0
      ;;
    *) err "Unknown argument: $1"; exit 1 ;;
  esac
  shift
done

trap 'printf "\n%s Interrupted.\n" "${YELLOW}"' INT TERM

banner

# ----------------------------------------------------------------------------
# 1. Dependency checks
# ----------------------------------------------------------------------------
section "Dependencies"

DC=()
if docker compose version >/dev/null 2>&1; then
  DC=(docker compose)
  ok "docker found ($(docker --version 2>/dev/null | sed 's/^Docker version //'))"
  ok "docker compose plugin found"
elif command -v docker-compose >/dev/null 2>&1; then
  DC=(docker-compose)
  ok "docker found + docker-compose v1 (v2 plugin recommended)"
else
  err "docker compose plugin not found."
  echo "   Install Docker Desktop (macOS/Windows) or docker.io + docker-compose-plugin (Linux):"
  echo "     Ubuntu/Debian:  sudo apt-get install docker.io docker-compose-plugin"
  echo "     Fedora:         sudo dnf install docker-ce docker-compose-plugin"
  exit 1
fi

if ! command -v git >/dev/null 2>&1; then
  err "git not found. Please install git and re-run."
  exit 1
else
  ok "git found ($(git --version 2>/dev/null))"
fi

if ! command -v node >/dev/null 2>&1; then
  warn "node not found — only needed for local dev; the docker images build their own toolchain."
else
  ok "node found ($(node --version 2>/dev/null))"
fi
if ! command -v pnpm >/dev/null 2>&1; then
  warn "pnpm not found — only needed for local dev (optional)."
else
  ok "pnpm found ($(pnpm --version 2>/dev/null))"
fi

# Docker daemon running?
if ! docker info >/dev/null 2>&1; then
  warn "Docker daemon is not running — attempting to start it."
  case "$(uname -s)" in
    Darwin) open -a Docker ;;
    Linux)
      if command -v systemctl >/dev/null 2>&1; then
        sudo systemctl start docker 2>/dev/null || sudo service docker start 2>/dev/null || true
      else
        sudo service docker start 2>/dev/null || true
      fi
      ;;
    *) warn "Unknown OS — please start Docker manually." ;;
  esac
  info "Waiting for the Docker daemon (up to 120s)..."
  local_started=$SECONDS
  until docker info >/dev/null 2>&1; do
    if (( SECONDS - local_started > 120 )); then
      err "Docker did not come up in time. Start it manually and re-run ./setup.sh"
      exit 1
    fi
    sleep 2
  done
  ok "Docker daemon is running."
else
  ok "Docker daemon is running."
fi

# ----------------------------------------------------------------------------
# 2. .env
# ----------------------------------------------------------------------------
section "Environment"

if [[ ! -f .env ]]; then
  cp .env.example .env
  ok "Created .env from .env.example"
else
  ok ".env already present — kept as-is"
fi

if grep -q '^POSTGRES_PASSWORD=' .env && [[ "$(grep '^POSTGRES_PASSWORD=' .env | cut -d= -f2 | tr -d '"')" != "" ]]; then
  info "POSTGRES_PASSWORD already set in .env — reusing it."
else
  pw="$(ask "Set a POSTGRES_PASSWORD? (blank keeps the default \"password\")" "")"
  if [[ -n "${pw}" ]]; then
    set_env_var "POSTGRES_PASSWORD" "${pw}"
    ok "POSTGRES_PASSWORD saved to .env"
  else
    info "Using default password \"password\" (dev only)."
  fi
fi

# ----------------------------------------------------------------------------
# 3. Mode
# ----------------------------------------------------------------------------
section "Mode"

echo "   ${BOLD}1)${RESET} ${CYAN}test${RESET}  — run the full app locally with Docker Compose"
echo "   ${BOLD}2)${RESET} ${CYAN}prod${RESET}  — deploy to real AWS EKS, or the local Floci emulator (free)"
printf "   Choose [${BOLD}1${RESET} or ${BOLD}2${RESET}]: "
read -r mode_ans || mode_ans=""
MODE="${mode_ans:-1}"
case "${MODE}" in
  1|test) MODE="test" ;;
  2|prod) MODE="prod" ;;
  *) err "Invalid mode: ${MODE}"; exit 1 ;;
esac
ok "Mode: ${MODE}"

if [[ "${MODE}" == "prod" ]]; then
  echo
  target="$(ask "Deploy target" "floci")"
  case "${target}" in
    floci|aws) ;;
    *) err "Deploy target must be floci|aws"; exit 1 ;;
  esac
  echo
  if [[ "${target}" == "aws" ]]; then
    warn "Real AWS deploy — this uses your AWS credentials and CAN incur AWS costs (ECR + EKS/ArgoCD)."
    if ! confirm "Continue?" "no"; then
      info "Aborted by user."
      exit 0
    fi
  else
    info "Floci is a free local emulator — no AWS account, no credentials, no AWS cost."
  fi
  env_name="$(ask "SKYLINE_ENV (deployment env name)" "staging")"
  section "Deploy"
  if [[ "${target}" == "aws" ]]; then
    info "Switching .env to real AWS endpoints..."
    if confirm "Run ./scripts/use-env.sh aws now?" "yes"; then
      ./scripts/use-env.sh aws
    fi
  else
    info "Switching .env to local Floci emulation..."
    ./scripts/use-env.sh local 2>/dev/null || true
  fi
  info "Running: SKYLINE_ENV=${env_name} ./scripts/deploy.sh ${target}"
  if confirm "Start the deploy?" "yes"; then
    SKYLINE_ENV="${env_name}" ./scripts/deploy.sh "${target}"
  else
    info "Deploy skipped — run it later with: SKYLINE_ENV=${env_name} ./scripts/deploy.sh ${target}"
  fi
  exit 0
fi

# ----------------------------------------------------------------------------
# 4. Size / profile
# ----------------------------------------------------------------------------
section "Setup size"

echo "   ${BOLD}lite${RESET}   — minimal, for low-end devices.  No shards, replicas, ES, or"
echo "            monitoring. ~14 containers, 1,000 products."
echo "   ${BOLD}mid${RESET}    — balanced dev stack. Shards + replicas, single-node ES + Kibana,"
echo "            pgAdmin + RedisInsight, nginx LB. ~38 containers, 5,000 products."
echo "   ${BOLD}full${RESET}   — everything. Identical to 'docker compose up -d'."
echo "            63 containers, 10,000 products, full observability."
echo "   ${BOLD}custom${RESET} — pick every component yourself."
printf "   Choose [${BOLD}full${RESET}]: "
read -r size_ans || size_ans=""
case "${size_ans}" in
  1|1l) PROFILE="lite" ;;
  2|2m) PROFILE="mid" ;;
  3|3f|"") PROFILE="full" ;;
  4|4c) PROFILE="custom" ;;
  lite|mid|full|custom) PROFILE="${size_ans}" ;;
  *) err "Invalid size: ${size_ans} (choose lite, mid, full, custom, or 1-4)"; exit 1 ;;
esac
ok "Profile: ${PROFILE}"

GEN_VARS=()
if [[ "${PROFILE}" == "lite" || "${PROFILE}" == "mid" ]]; then
  GEN_VARS+=("PROFILE=${PROFILE}")
fi

if [[ "${PROFILE}" == "custom" ]]; then
  section "Custom build"
  info "Leave a prompt at its default by pressing Enter."
  a="$(ask_int "Auth shard count" 0 0 4)";  GEN_VARS+=("AUTH_SHARDS=${a}")
  o="$(ask_int "Order shard count" 0 0 4)"; GEN_VARS+=("ORDER_SHARDS=${o}")
  p="$(ask_int "Product shard count" 0 0 4)"; GEN_VARS+=("PRODUCT_SHARDS=${p}")
  r="$(ask_yn "Read replicas per shard?" "no")"; GEN_VARS+=("REPLICAS=${r}")
  e="$(ask_yn "Elasticsearch (+Kibana)?" "no")"; GEN_VARS+=("ES=${e}")
  if [[ "${e}" == "yes" ]]; then
    n="$(ask_int "ES nodes (1 or 3)" 1 1 3)"; GEN_VARS+=("ES_NODES=${n}")
  fi
  nat="$(ask_int "NATS nodes (1/3/5)" 1 1 5)"; GEN_VARS+=("NATS_NODES=${nat}")
  pb="$(ask_yn "PgBouncer poolers?" "no")"; GEN_VARS+=("PGBOUNCER=${pb}")
  nx="$(ask_yn "Nginx load balancer on :80?" "no")"; GEN_VARS+=("NGINX=${nx}")
  gu="$(ask_yn "GUI tools (pgAdmin, RedisInsight)?" "no")"; GEN_VARS+=("GUIS=${gu}")
  ob="$(ask_yn "Observability (Jaeger, Prometheus, Grafana)?" "no")"; GEN_VARS+=("OBSERVABILITY=${ob}")
  sc="$(ask_int "Products to seed" 1000 100 100000)"; GEN_VARS+=("SEED_COUNT=${sc}")
fi

if [[ "${PROFILE}" == "full" ]]; then
  COMPOSE_FILE="docker-compose.yml"
  SUMMARY="full (63 containers, 10,000 products, everything enabled)"
else
  COMPOSE_FILE="${SETUP_DIR}/docker-compose.yml"
fi

# ----------------------------------------------------------------------------
# 5. Resolve + validate the compose file
# ----------------------------------------------------------------------------
section "Resolve compose config"

if [[ "${PROFILE}" != "full" ]]; then
  mkdir -p "${SETUP_DIR}"
  info "Generating ${PROFILE} stack..."
  GEN_OUT=""
  GEN_OUT="$(env "${GEN_VARS[@]}" ./scripts/compose-gen.sh)"
  printf '%s\n' "${GEN_OUT}" > "${COMPOSE_FILE}"
  ok "Wrote ${COMPOSE_FILE} ($(wc -l < "${COMPOSE_FILE}" | tr -d ' ') lines)"
fi

COMPOSE_BASE=(-p "${PROJECT_NAME}" --project-directory "${ROOT}" --env-file "${ROOT}/.env" -f "${COMPOSE_FILE}")
COMPOSE_CMD=("${DC[@]}" "${COMPOSE_BASE[@]}")

info "Validating compose config..."
if ! "${COMPOSE_CMD[@]}" config -q 2> .setup/compose.err; then
  err "Generated compose file failed validation:"
  sed 's/^/   /' .setup/compose.err 1>&2 || true
  exit 1
fi
rm -f .setup/compose.err
ok "Compose config is valid"

# ----------------------------------------------------------------------------
# 6. Tear down the previous stack, start the new one
# ----------------------------------------------------------------------------
section "Starting the stack"

if [[ "${DRY_RUN}" == true ]]; then
  ok "Dry run — not touching any running containers."
  info "Profile: ${PROFILE}"
  info "Compose file: ${COMPOSE_FILE}"
  if [[ "${PROFILE}" != "full" ]]; then
    info "Config:"; if [[ ${#GEN_VARS[@]} -gt 0 ]]; then printf '%s\n' "${GEN_VARS[@]}" | sed 's/^/     /'; fi
  fi
  echo
  ok "To start the stack:  ./setup.sh"
  exit 0
fi

PREV="docker-compose.yml"
if [[ -f "${ACTIVE_FILE}" ]]; then
  PREV="$(cat "${ACTIVE_FILE}")"
fi

if [[ "${CLEAN_VOLUMES}" == true ]]; then
  info "Removing previous stack volumes (-v)..."
  "${DC[@]}" -p "${PROJECT_NAME}" --project-directory "${ROOT}" --env-file "${ROOT}/.env" -f "${PREV}" down -v --remove-orphans 2>/dev/null || true
else
  info "Tearing down previous stack (${PREV})..."
  "${DC[@]}" -p "${PROJECT_NAME}" --project-directory "${ROOT}" --env-file "${ROOT}/.env" -f "${PREV}" down --remove-orphans 2>/dev/null || true
fi

printf '%s\n' "${COMPOSE_FILE}" > "${ACTIVE_FILE}"

info "Rebuilding app + bootstrap images (bakes in your latest code changes)..."
if ! "${COMPOSE_CMD[@]}" build 2>&1 | tail -15; then
  err "Image build failed. Check the build output above."
  exit 1
fi
ok "App images rebuilt (bootstrap, api-gateway, auth-service, product-service, inventory-service, cart-service, order-service, payment-service, web-shop)."

info "Starting ${PROFILE} stack (images already built — may take a while to boot)..."
"${COMPOSE_CMD[@]}" up -d &
UP_PID=$!
spin "${UP_PID}" "starting containers..."
wait "${UP_PID}" || { err "docker compose up failed"; "${COMPOSE_CMD[@]}" ps; exit 1; }
ok "Containers started."

# ----------------------------------------------------------------------------
# 7. Wait for readiness
# ----------------------------------------------------------------------------
section "Waiting for the stack to be ready"

wait_seconds=300
elapsed=0
while (( elapsed < wait_seconds )); do
  gw=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api/v1/health 2>/dev/null || echo 000)
  ws=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8080/ 2>/dev/null || echo 000)
  boot=$(docker inspect -f '{{.State.ExitCode}}' ecommerce_bootstrap 2>/dev/null || echo pending)
  if [[ "${gw}" == "200" && "${ws}" == "200" && "${boot}" == "0" ]]; then
    ok "Web shop + gateway healthy, bootstrap completed successfully."
    break
  fi
  if (( elapsed % 10 == 0 )); then
    printf '\r  %s waiting for services... gateway=%s web-shop=%s bootstrap=%s%s' "${CYAN}" "${gw}" "${ws}" "${boot}" "${RESET}"
  fi
  sleep 2
  elapsed=$((elapsed + 2))
done
printf '\r\033[K'

if [[ "${gw}" != "200" || "${ws}" != "200" || "${boot}" != "0" ]]; then
  warn "Timed out waiting for readiness. Current state:"
  "${COMPOSE_CMD[@]}" ps
  echo
  warn "Check logs with:  docker compose -f ${COMPOSE_FILE} logs -f bootstrap"
  exit 1
fi

# ----------------------------------------------------------------------------
# 8. Status box
# ----------------------------------------------------------------------------
section "Stack status"

"${COMPOSE_CMD[@]}" ps

echo
printf '%s' "${BOLD}"; printf '%s\n' "─────────────────────────────────────────────────────────"; printf '%s' "${RESET}"
printf '  %s%-22s%s %s\n' "${CYAN}" "Web shop (UI):" "${RESET}" "http://localhost:8080"
printf '  %s%-22s%s %s\n' "${CYAN}" "API gateway:" "${RESET}" "http://localhost:3000/api/v1/health"
printf '  %s%-22s%s %s\n' "${CYAN}" "Postgres (master):" "${RESET}" "localhost:5435 (root / ${POSTGRES_PASSWORD:-password})"
[[ "${PROFILE}" == "full" || "${PROFILE}" == "mid" ]] && printf '  %s%-22s%s %s\n' "${CYAN}" "Kibana:" "${RESET}" "http://localhost:5601"
[[ "${PROFILE}" == "full" || "${PROFILE}" == "mid" ]] && printf '  %s%-22s%s %s\n' "${CYAN}" "pgAdmin:" "${RESET}" "http://localhost:5050 (admin@skyline.dev)"
if [[ "${PROFILE}" == "full" ]]; then
  printf '  %s%-22s%s %s\n' "${CYAN}" "Jaeger:" "${RESET}" "http://localhost:16686"
  printf '  %s%-22s%s %s\n' "${CYAN}" "Prometheus:" "${RESET}" "http://localhost:9090"
  printf '  %s%-22s%s %s\n' "${CYAN}" "Grafana:" "${RESET}" "http://localhost:3100 (admin/admin)"
fi
printf '  %s%-22s%s %s\n' "${CYAN}" "NATS:" "${RESET}" "nats://localhost:4222"
printf '%s' "${BOLD}"; printf '%s\n' "─────────────────────────────────────────────────────────"; printf '%s' "${RESET}"

if confirm "Open the web shop now?" "yes"; then
  case "$(uname -s)" in
    Darwin) open "http://localhost:8080" ;;
    Linux)  xdg-open "http://localhost:8080" >/dev/null 2>&1 || true ;;
    *) info "Open http://localhost:8080 in your browser." ;;
  esac
fi

echo
ok "Setup complete."
info "Useful commands:"
echo "   Start/stop:   docker compose -f ${COMPOSE_FILE} up -d   |   docker compose -f ${COMPOSE_FILE} down"
echo "   Bootstrap log: docker compose -f ${COMPOSE_FILE} logs -f bootstrap"
echo "   Reseed:        docker compose -f ${COMPOSE_FILE} restart bootstrap"
echo "   Re-run setup:  ./setup.sh"
