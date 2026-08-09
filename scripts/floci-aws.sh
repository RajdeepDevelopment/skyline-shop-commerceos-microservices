#!/bin/bash
# ---------------------------------------------------------------------------
# floci-aws.sh — run AWS CLI commands against the local Floci emulator
#
# Wraps the AWS CLI bundled inside the ecommerce_floci container so you can
# run real AWS commands locally WITHOUT an AWS account, auth token, or the
# AWS CLI installed on your host machine.
#
# Usage:
#   ./scripts/floci-aws.sh s3 mb s3://my-bucket
#   ./scripts/floci-aws.sh dynamodb list-tables
#   ./scripts/floci-aws.sh sts get-caller-identity
#
# It also works as a drop-in replacement for `aws ...` once you switch to
# real AWS later — just point the same commands at real credentials.
# ---------------------------------------------------------------------------
set -euo pipefail

CONTAINER="${FLOCI_CONTAINER:-ecommerce_floci}"
ENDPOINT="${AWS_ENDPOINT_URL:-http://localhost:4566}"

if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
    echo "❌ Floci container '${CONTAINER}' is not running." >&2
    echo "   Start it with: docker compose -f docker-compose.floci.yml up -d" >&2
    exit 1
fi

docker exec -e AWS_ENDPOINT_URL="${ENDPOINT}" \
    -e AWS_ACCESS_KEY_ID=test \
    -e AWS_SECRET_ACCESS_KEY=test \
    -e AWS_DEFAULT_REGION=us-east-1 \
    "${CONTAINER}" aws --endpoint-url "${ENDPOINT}" "$@"
