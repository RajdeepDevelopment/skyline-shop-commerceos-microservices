#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# floci-pgadmin.sh — generate pgAdmin server connections for the Floci RDS shards
#
# Reads dist/floci-endpoints.env (written by floci-infra.sh) and writes:
#   dist/pgadmin/servers.json   pre-registered shards for the pgAdmin web UI
#   dist/pgadmin/.pgpass        per-shard credentials (pgpass format)
#
# docker-compose.tools.yml bind-mounts both into the pgadmin container so
# http://localhost:5050 (login admin@skyline.dev / admin) can browse every
# emulated RDS shard. Re-run after any floci-infra.sh reset.
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
PGPASS_PATH="/var/lib/pgadmin/.pgpass"

OUT_DIR="${ROOT_DIR}/dist/pgadmin"
mkdir -p "${OUT_DIR}"

SHARDS="auth:s0 auth:s1 order:s0 order:s1 order:s2 order:s3 product:s0 product:s1 product:s2 product:s3"

# --- servers.json ------------------------------------------------------------
servers="[]"
for pair in ${SHARDS}; do
  svc="${pair%%:*}"; shard="${pair##*:}"
  ep_var="DB_${svc}_${shard}"
  ep="${!ep_var:-}"
  [[ -n "${ep}" ]] || continue
  host="${ep%:*}"; port="${ep##*:}"
  db="${svc}_${shard}"
  servers="$(jq -n --argjson prev "${servers}" \
    --arg name "${db} (port ${port})" --arg group "Skyline - ${svc}" \
    --arg host "${host}" --argjson port "${port}" --arg db "${db}" \
    --arg user "${DB_USER}" --arg pass "${PGPASS_PATH}" \
    '$prev + [{name:$name, group:$group, host:$host, port:$port, db:$db, user:$user, pass:$pass}]')"
done

jq -n --argjson servers "${servers}" \
  '{"Servers": ([$servers | to_entries[] | {key: ((.key | tonumber) + 1 | tostring), value: {Name: .value.name, Group: .value.group, Host: .value.host, Port: .value.port, MaintenanceDB: .value.db, Username: .value.user, PassFile: .value.pass}}] | from_entries)}' \
  > "${OUT_DIR}/servers.json"

# --- .pgpass ------------------------------------------------------------------
: > "${OUT_DIR}/.pgpass"
for pair in ${SHARDS}; do
  svc="${pair%%:*}"; shard="${pair##*:}"
  ep_var="DB_${svc}_${shard}"
  ep="${!ep_var:-}"
  [[ -n "${ep}" ]] || continue
  host="${ep%:*}"; port="${ep##*:}"
  printf '%s:%s:*:%s:%s\n' "${host}" "${port}" "${DB_USER}" "${DB_PASSWORD}" >> "${OUT_DIR}/.pgpass"
done
chmod 600 "${OUT_DIR}/.pgpass"

echo "✅ pgAdmin config written: ${OUT_DIR}/servers.json, ${OUT_DIR}/.pgpass"
