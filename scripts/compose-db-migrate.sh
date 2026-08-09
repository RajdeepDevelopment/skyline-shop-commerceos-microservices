#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# compose-db-migrate.sh — sync every compose database to prisma/schema.prisma
#
# docker-compose.yml provisions main DBs, shards, and read replicas as fresh
# Postgres containers. Fresh containers have NO tables, so any service that
# queries them fails with "relation ... does not exist".
#
# NOTE: the committed prisma migrations are stale relative to schema.prisma, so
# this uses `prisma db push` (the same sync mechanism setup.sh uses) instead of
# `migrate deploy`. db push reconciles the live schema directly.
#
# This script discovers every `postgresql://` connection string in .env
# (DATABASE_URL, *_DATABASE_WRITE_URL / READ_URL, *_S<n>_DATABASE_WRITE_URL,
# etc.) and runs `prisma db push` against each one. It is idempotent.
#
# When run inside docker compose, MIGRATE_URLS (comma-separated) is injected by
# the `bootstrap` service so the URL list always matches the provisioned DBs.
#
# Usage:
#   ./scripts/compose-db-migrate.sh
#
# Env:
#   ENV_FILE        path to the env file to read (default: ./.env)
#   MIGRATE_URLS    comma-separated DB URLs (overrides the env file)
#   MIGRATE_PASSWORD postgres password to substitute into file URLs
#   RUN_PRISMA      0 disables the prisma step (default 1)
# ---------------------------------------------------------------------------
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT_DIR}"

ENV_FILE="${ENV_FILE:-${ROOT_DIR}/.env}"
if [[ -z "${MIGRATE_URLS:-}" && ! -f "${ENV_FILE}" ]]; then
  echo "❌ ${ENV_FILE} not found (and MIGRATE_URLS is unset)" >&2
  exit 1
fi

RUN_PRISMA="${RUN_PRISMA:-1}"

URLS=()

# Preferred: docker compose injects MIGRATE_URLS (comma/newline separated) so the
# URL list always matches the DBs actually provisioned in the running stack.
if [[ -n "${MIGRATE_URLS:-}" ]]; then
  IFS=',' read -r -a MIGRATE_LIST <<< "${MIGRATE_URLS}"
  for u in "${MIGRATE_LIST[@]}"; do
    u="$(printf '%s' "${u}" | tr -d '[:space:]')"
    [[ -n "${u}" ]] && URLS+=("${u}")
  done
else
  # Fallback: pull every postgres:// connection string out of the env file.
  # Keys may be double-quoted; strip quotes and trailing spaces.
  while IFS= read -r u; do
    URLS+=("${u}")
  done < <(grep -Eo 'postgresql://[^"[:space:]]+' "${ENV_FILE}" | tr -d '"' | sort -u)
fi

# docker compose injects MIGRATE_PASSWORD (defaults to POSTGRES_PASSWORD) so the
# URLs in migrate.env stay correct even if the operator overrides the password.
if [[ -n "${MIGRATE_PASSWORD:-}" && "${MIGRATE_PASSWORD}" != "password" ]]; then
  for i in "${!URLS[@]}"; do
    URLS[i]="${URLS[i]//@password@/@${MIGRATE_PASSWORD}@}"
  done
fi

if [[ ${#URLS[@]} -eq 0 ]]; then
  echo "❌ No postgresql:// connection strings found in ${ENV_FILE}" >&2
  exit 1
fi

echo "📋 Found ${#URLS[@]} database connection string(s) to migrate:"
for u in "${URLS[@]}"; do
  echo "   - ${u}"
done

if [[ "${RUN_PRISMA}" != "1" ]]; then
  echo "⏭️ RUN_PRISMA=0 — skipping migrations."
  exit 0
fi

FAILED=0
for url in "${URLS[@]}"; do
  echo ""
  echo "==> syncing ${url}"
  if DATABASE_URL="${url}" pnpm exec prisma db push --accept-data-loss; then
    echo "   ✅ synced"
  else
    echo "   ❌ sync failed for ${url}" >&2
    FAILED=1
  fi
done

echo ""
if [[ "${FAILED}" = "1" ]]; then
  echo "⚠ Some databases failed to sync (see above)." >&2
  exit 1
fi
echo "✅ All compose databases synced to schema.prisma."
