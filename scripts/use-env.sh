#!/bin/bash
# ---------------------------------------------------------------------------
# use-env.sh — switch the platform between local Floci emulation and real AWS
#
#   ./scripts/use-env.sh local     # -> Floci emulator at localhost:4566
#   ./scripts/use-env.sh aws       # -> real AWS (uses your credentials)
#   ./scripts/use-env.sh status    # -> print the current AWS mode
#
# Only the AWS_* block in .env changes. All app code reads those vars through
# @app/aws, so no code changes are needed when you flip environments.
# ---------------------------------------------------------------------------
set -euo pipefail

ENV_FILE=".env"

if [ ! -f "${ENV_FILE}" ]; then
    echo "❌ ${ENV_FILE} not found. Run ./setup.sh first." >&2
    exit 1
fi

set_var() {
    local key="$1"
    local value="$2"
    if grep -q "^${key}=" "${ENV_FILE}"; then
        sed -i.bak "s|^${key}=.*|${key}=\"${value}\"|" "${ENV_FILE}"
    else
        printf '%s="%s"\n' "${key}" "${value}" >> "${ENV_FILE}"
    fi
}

unset_var() {
    local key="$1"
    if grep -q "^${key}=" "${ENV_FILE}"; then
        sed -i.bak "s|^${key}=.*|${key}=\"\"|" "${ENV_FILE}"
    else
        printf '%s=""\n' "${key}" >> "${ENV_FILE}"
    fi
}

get_var() {
    local key="$1"
    grep "^${key}=" "${ENV_FILE}" 2>/dev/null | head -1 | sed "s|^${key}=\"||; s|\"$||"
}

show_status() {
    local endpoint
    endpoint="$(get_var AWS_ENDPOINT_URL)"
    if [[ -z "${endpoint}" ]] || [[ "${endpoint}" == '""' ]]; then
        echo "AWS mode : REAL AWS"
        echo "Region   : $(get_var AWS_DEFAULT_REGION)"
    else
        echo "AWS mode : FLOCI (local emulation)"
        echo "Endpoint : ${endpoint}"
        echo "Region   : $(get_var AWS_DEFAULT_REGION)"
    fi
}

case "${1:-status}" in
    local)
        echo "⏳ Starting Floci emulator if needed..."
        if ! docker ps --format '{{.Names}}' | grep -q '^ecommerce_floci$'; then
            docker compose -f docker-compose.floci.yml up -d
        fi
        set_var AWS_ENDPOINT_URL "http://localhost:4566"
        set_var AWS_ACCESS_KEY_ID "test"
        set_var AWS_SECRET_ACCESS_KEY "test"
        set_var AWS_DEFAULT_REGION "us-east-1"
        set_var AWS_STORAGE_MODE "local"
        rm -f "${ENV_FILE}.bak"
        echo "✅ Switched to FLOCI (local). AWS commands hit http://localhost:4566"
        echo "   Try: ./scripts/floci-aws.sh s3 ls"
        ;;
    aws)
        # Real AWS: clear the emulator endpoint so the SDK resolves real endpoints
        unset_var AWS_ENDPOINT_URL
        set_var AWS_DEFAULT_REGION "$(get_var AWS_DEFAULT_REGION)"
        set_var AWS_STORAGE_MODE "aws"
        rm -f "${ENV_FILE}.bak"
        echo "✅ Switched to REAL AWS. AWS_ENDPOINT_URL cleared."
        echo "   Ensure your credentials are set (env vars, ~/.aws/credentials, or a role)."
        ;;
    status)
        show_status
        ;;
    *)
        echo "Usage: ./scripts/use-env.sh {local|aws|status}" >&2
        exit 1
        ;;
esac
