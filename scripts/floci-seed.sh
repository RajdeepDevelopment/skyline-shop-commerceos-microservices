#!/usr/bin/env bash
set -euo pipefail

# Seeds the Floci local AWS emulator with REAL Skyline Shop resources so the
# Floci UI console (http://localhost:4500) reflects the actual production
# topology (naming mirrors infrastructure/aws/*.tf + libs/messaging queues).
# Idempotent — safe to run any number of times.

# Match infrastructure/aws defaults
PROJECT="${SKYLINE_PROJECT:-skyline-shop}"
ENV="${SKYLINE_ENV:-staging}"

AWS() {
  docker exec ecommerce_floci aws --endpoint-url http://localhost:4566 "$@"
}

# Wait for the emulator container to be up and healthy
echo "==> Waiting for Floci emulator..."
for i in $(seq 1 30); do
  if docker exec ecommerce_floci aws --endpoint-url http://localhost:4566 sts get-caller-identity >/dev/null 2>&1; then
    echo "emulator ready"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "error: emulator not reachable. Start it with: pnpm floci:start" >&2
    exit 1
  fi
  sleep 2
done

echo "==> S3 buckets (mirrors terraform storage.tf)"
for b in "${PROJECT}-${ENV}-product-images" "${PROJECT}-${ENV}-build-artifacts"; do
  if AWS s3api head-bucket --bucket "$b" >/dev/null 2>&1; then
    echo "exists: $b"
  else
    AWS s3 mb "s3://$b" >/dev/null
    echo "created: $b"
  fi
done

echo "==> SQS queues (mirrors libs/messaging queue.service.ts)"
for q in order-events notifications payment-events inventory-events; do
  if AWS sqs list-queues --output json | grep -q "$q"; then
    echo "exists: $q"
  else
    AWS sqs create-queue --queue-name "$q" >/dev/null
    echo "created: $q"
  fi
done

echo "==> SNS topics"
for t in "${PROJECT}-order-events" "${PROJECT}-notifications" "${PROJECT}-payment-events"; do
  if AWS sns list-topics --output json | grep -q "$t"; then
    echo "exists: $t"
  else
    AWS sns create-topic --name "$t" >/dev/null
    echo "created: $t"
  fi
done

echo "==> DynamoDB tables"
create_table() {
  local name=$1
  if AWS dynamodb list-tables --output json | grep -q "$name"; then
    echo "exists: $name"
  else
    AWS dynamodb create-table \
      --table-name "$name" \
      --attribute-definitions AttributeName=id,AttributeType=S \
      --key-schema AttributeName=id,KeyType=HASH \
      --billing-mode PAY_PER_REQUEST >/dev/null
    echo "created: $name"
  fi
}
create_table "${PROJECT}-carts"
create_table "${PROJECT}-sessions"

echo "==> Secrets Manager"
create_secret() {
  local name=$1 value=$2
  if AWS secretsmanager list-secrets --output json | grep -q "$name"; then
    echo "exists: $name"
  else
    AWS secretsmanager create-secret --name "$name" --secret-string "$value" >/dev/null
    echo "created: $name"
  fi
}
create_secret "${PROJECT}/${ENV}/db-credentials" '{"username":"skyline","password":"change-me","host":"skyline-shop-db","port":5432}'
create_secret "${PROJECT}/${ENV}/jwt-secret" "$(python3 -c 'import json;print(json.dumps({"secret":"super_secret_enterprise_key_change_me_in_prod"}))')"
create_secret "${PROJECT}/${ENV}/payment-gateway" '{"provider":"stripe","publishableKey":"pk_test_local","secretKey":"sk_test_local"}'

echo "==> Secrets Manager: app secrets (feed the k8s ecommerce-secrets Secret)"
# The k8s deployments consume a Secret named `ecommerce-secrets` with JWT_SECRET,
# JWT_REFRESH_SECRET and POSTGRES_PASSWORD. Instead of committing real values,
# deploy.sh materializes that Secret from this AWS Secrets Manager entry at
# deploy time (IRSA grants the same read path in real AWS).
create_app_secret() {
  local name=$1
  if AWS secretsmanager describe-secret --secret-id "$name" >/dev/null 2>&1; then
    echo "exists: $name"
    return
  fi
  local jwt jwt_refresh db_pass value
  jwt="$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 48)"
  jwt_refresh="$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9' | head -c 48)"
  db_pass="$(openssl rand -base64 36 | tr -dc 'A-Za-z0-9' | head -c 32)"
  value="$(python3 -c 'import json,sys;print(json.dumps({"JWT_SECRET":sys.argv[1],"JWT_REFRESH_SECRET":sys.argv[2],"POSTGRES_PASSWORD":sys.argv[3]}))' "$jwt" "$jwt_refresh" "$db_pass")"
  AWS secretsmanager create-secret --name "$name" --secret-string "$value" >/dev/null
  echo "created: $name"
}
create_app_secret "${PROJECT}/${ENV}/app-secrets"

echo "==> SSM parameters"
AWS ssm put-parameter \
  --name "/${PROJECT}/${ENV}/config" \
  --value '{"region":"us-east-1","natsServers":["nats://localhost:4222"],"elasticsearch":"http://localhost:9200"}' \
  --type String --overwrite >/dev/null
echo "set: /${PROJECT}/${ENV}/config"

echo "==> ECR repositories (mirrors terraform storage.tf)"
for repo in api-gateway auth user product inventory cart order payment notification analytics; do
  if AWS ecr describe-repositories --output json 2>/dev/null | grep -q "${PROJECT}/${repo}"; then
    echo "exists: ${PROJECT}/${repo}"
  else
    AWS ecr create-repository --repository-name "${PROJECT}/${repo}" >/dev/null
    echo "created: ${PROJECT}/${repo}"
  fi
done

echo "==> EKS cluster"
if AWS eks list-clusters --output json | grep -q "${PROJECT}-${ENV}-cluster"; then
  echo "exists: ${PROJECT}-${ENV}-cluster"
else
  AWS eks create-cluster \
    --name "${PROJECT}-${ENV}-cluster" \
    --role-arn arn:aws:iam::000000000000:role/eks-cluster \
    --resources-vpc-config "{}" >/dev/null
  echo "created: ${PROJECT}-${ENV}-cluster"
fi

echo "==> RDS instances"
for db in auth order product cart inventory; do
  id="${PROJECT}-${ENV}-${db}"
  if AWS rds describe-db-instances --db-instance-identifier "${id}" --output json 2>/dev/null | grep -q "${id}"; then
    echo "exists: ${id}"
  else
    if AWS rds create-db-instance \
      --db-instance-identifier "${id}" \
      --db-instance-class db.t3.micro \
      --engine postgres \
      --allocated-storage 20 \
      --master-username skyline \
      --master-user-password change-me >/dev/null 2>&1; then
      echo "created: ${id}"
    else
      echo "exists: ${id}"
    fi
  fi
done

echo
echo "Done. Refresh http://localhost:4500 to see the Skyline Shop resources."
