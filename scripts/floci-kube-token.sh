#!/bin/bash
# ---------------------------------------------------------------------------
# floci-kube-token.sh — exec credential plugin for kubectl against Floci EKS.
#
# kubectl runs the exec credential plugin to mint a short-lived bearer token
# via the AWS CLI bundled inside the ecommerce_floci container (no host AWS
# CLI required). Output matches the ExecCredential JSON contract.
#
# Usage (wired automatically by kubeconfig.floci.yml):
#   CLUSTER_NAME=skyline-shop-staging-cluster ./scripts/floci-kube-token.sh
# ---------------------------------------------------------------------------
set -euo pipefail

CONTAINER="${FLOCI_CONTAINER:-ecommerce_floci}"
ENDPOINT="${AWS_ENDPOINT_URL:-http://localhost:4566}"
CLUSTER_NAME="${CLUSTER_NAME:?CLUSTER_NAME is required}"

docker exec -e AWS_ENDPOINT_URL="${ENDPOINT}" \
    -e AWS_ACCESS_KEY_ID=test \
    -e AWS_SECRET_ACCESS_KEY=test \
    -e AWS_DEFAULT_REGION=us-east-1 \
    "${CONTAINER}" aws --endpoint-url "${ENDPOINT}" eks get-token --cluster-name "${CLUSTER_NAME}"
