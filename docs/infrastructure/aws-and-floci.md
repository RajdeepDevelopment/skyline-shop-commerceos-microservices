# ☁️ AWS Deployment & Local AWS Emulation (Floci)

This guide covers two things:

1. **Running AWS-shaped services locally with Floci** — a dev-only local AWS emulator, so you can develop and test with the **exact same AWS commands** you'll use in production, without an AWS account.
2. **Deploying to real AWS** — Terraform IaC in [`infrastructure/aws`](../../infrastructure/aws) that provisions EKS + managed services, designed so the app itself stays **cloud-portable** (plain Kubernetes, no AWS lock-in in the application layer).

---

## Why Floci?

| Capability | Floci (local) | Real AWS |
|---|---|---|
| AWS account required | No | Yes |
| Auth token required | No | No |
| AWS CLI on host required | No (bundled in compat image) | No (SDK/CLI optional) |
| Services available | 69 emulated at `localhost:4566` | Real |
| Cost | Free | Usage-based |
| Perfectly identical behavior | Compatible, not bit-identical | — |

Floci lets you run `aws s3 mb ...`, `aws dynamodb create-table ...`, etc., **locally** with no account, no auth token, and no feature gates.

---

## Part 1 — Local AWS Emulation with Floci (Dev Only)

Floci is a **dev dependency** of this repo. It runs as a Docker Compose service and is NOT part of the production infrastructure.

### 1. Start the emulator

**Everything in one command** — start the emulator + UI, seed real Skyline Shop resources, and open the console:

```bash
pnpm floci:up
```

Or step by step:

```bash
docker compose -f docker-compose.floci.yml up -d
```

This starts the `floci/floci:latest-compat` image — the compat variant bundles the **AWS CLI and boto3**, so you never need to install the real AWS CLI on your host.

### 2. Run AWS commands locally

Use the bundled wrapper (no host AWS CLI needed):

```bash
./scripts/floci-aws.sh s3 mb s3://my-bucket
./scripts/floci-aws.sh dynamodb list-tables
./scripts/floci-aws.sh sts get-caller-identity
./scripts/floci-aws.sh secretsmanager create-secret --name my-secret --secret-string "hello"
```

Or exec straight into the container:

```bash
docker exec -it ecommerce_floci aws --endpoint-url http://localhost:4566 s3 ls
```

### 3. Point the application at the emulator

```bash
./scripts/use-env.sh local        # writes the AWS_* switch vars into .env (localhost:4566)
# or, to also export into your current shell:
source ./scripts/use-env.sh local
```

This only flips the `AWS_*` block in `.env`. The application reads those vars through the shared `@app/aws` library (`AwsConfigService`) — **no code changes are needed when switching environments**.

| Env var | Floci (local) | Real AWS |
|---|---|---|
| `AWS_ENDPOINT_URL` | `http://localhost:4566` | *(empty / unset)* |
| `AWS_ACCESS_KEY_ID` | `test` | your real access key |
| `AWS_SECRET_ACCESS_KEY` | `test` | your real secret key |
| `AWS_DEFAULT_REGION` | `us-east-1` | any |
| `AWS_STORAGE_MODE` | `local` | `aws` |

### 4. Services commonly used

| AWS service | Local endpoint |
|---|---|
| S3 | `http://localhost:4566` |
| DynamoDB | `http://localhost:4566` |
| SQS / SNS | `http://localhost:4566` |
| Secrets Manager / SSM | `http://localhost:4566` |
| IAM / STS | `http://localhost:4566` |
| Lambda, RDS, ElastiCache, MSK, EC2, EKS | `http://localhost:4566` (real Docker-backed) |

Any credentials work — `test` / `test` is the default. Any region works.

> **Note:** Docker-backed services (Lambda, RDS, ElastiCache, MSK, EC2, EKS, OpenSearch, ECR) spin up **real containers**, so the Docker socket is mounted into the Floci container (`/var/run/docker.sock`).

### 5. Stop / clean up

```bash
docker compose -f docker-compose.floci.yml down          # stop
docker compose -f docker-compose.floci.yml down -v       # stop + wipe state
```

### 6. Logs & web console

**Logs** — the emulator logs to the `ecommerce_floci` container (not `floci`, so the CLI's `floci logs` won't find it):

```bash
pnpm floci:logs            # or: docker logs -f ecommerce_floci
```

Every emulated operation is logged there (`Created bucket: ...`, `Created table: ...`, ...).

**Web console** — the `floci/floci-ui` service (started automatically by `floci:start`) is an AWS-Console-style dashboard served at:

```bash
pnpm floci:ui              # opens http://localhost:4500
```

It proxies to the emulator over the compose network, so buckets, tables, queues, secrets, Lambda functions, etc. can be browsed/created/deleted from the browser — no extra setup.

> **Note:** the console's "Active services" count reflects the **UI adapters wired** (Storage, k8s Engine, Database, Secrets Manager), not the emulator's capabilities — the emulator itself runs all ~70 services (`_floci/health`). A service showing `0 resources` just means nothing has been created yet.

After a fresh start (`docker compose -f docker-compose.floci.yml up -d`), seed demo resources so the console has data to browse:

```bash
pnpm floci:seed            # idempotent: buckets, tables, queues, secrets, EKS cluster, RDS instance
```

| URL | What |
|---|---|
| `http://localhost:4500` | Floci UI web console |
| `http://localhost:4566` | AWS API endpoint (S3/DynamoDB/SQS/...) |
| `http://localhost:4566/_floci/health` | Emulator health + enabled services JSON |

---

## Part 2 — Deploying to Real AWS

Once local development works against Floci, deploying to AWS is a switch of environment, not a rewrite: the application is plain Kubernetes (`k8s/` overlays, delivered by ArgoCD), and the AWS-specific pieces are isolated in Terraform.

### Architecture on AWS

| Local (dev, Floci/Docker) | AWS (managed, Terraform) |
|---|---|
| Docker Compose Postgres containers | `aws_db_instance` RDS PostgreSQL (optional) |
| Docker Compose Redis | `aws_elasticache_cluster` Redis (optional) |
| Docker Compose Elasticsearch | `aws_opensearch_domain` (optional) |
| Nginx + API Gateway | EKS + ALB (K8s-native ingress) |
| K8s manifests (`k8s/`) | Same manifests on EKS via ArgoCD |

> Managed data services (RDS/ElastiCache/OpenSearch) are **off by default** in `infrastructure/aws`. The app's data-plane endpoints are supplied per environment — the in-cluster Postgres/Redis/Elasticsearch manifests were removed from `k8s/` in favor of AWS-managed equivalents. Enable the `enable_*` flags per environment, then fill the endpoints into the environment's overlay ConfigMap (`k8s/overlays/<env>/configmap-data.yml`) from `terraform output`.

### Step 1 — Prerequisites

```bash
# AWS CLI (or use the Floci compat image's bundled one)
# Terraform (already installed via brew in this repo's workflow)
terraform version

# Configure AWS credentials
aws configure          # or set AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
```

### Step 2 — Configure Terraform

```bash
cd infrastructure/aws
cp terraform.tfvars.example terraform.tfvars   # edit values
```

Review `variables.tf` and set at minimum `aws_region`, `project`, `environment`.

### Step 3 — Provision

```bash
terraform init
terraform plan
terraform apply -auto-approve
```

This provisions:

- **VPC + networking** — public/private subnets across AZs, NAT gateways, VPC endpoints.
- **EKS cluster** — managed node groups, add-ons (CoreDNS, kube-proxy, VPC CNI, S3).
- **IAM identities** — a CI/CD deploy role for GitHub Actions (OIDC), per-service IRSA roles, and a Cluster Autoscaler role.
- **ECR repositories** — one per microservice.
- **S3 buckets** — product images + build artifacts.
- **ArgoCD** — installed on the cluster and pointed at this repo's `k8s/overlays/<env>` path, so app changes flow through the existing GitOps flow.
- **Managed data services** — RDS / ElastiCache / OpenSearch when enabled.

### Step 4 — Build & push images (GitHub Actions)

`.github/workflows/release.yml` can be extended to assume `ci_deploy_role_arn` (printed by `terraform output`) and push images to the ECR repositories. ArgoCD then syncs the updated image tags into the cluster.

---

## Part 3 — Switching Between Local and AWS

The whole switch is **one command** — it only edits the `AWS_*` block in `.env`:

| Command | Effect |
|---|---|
| `./scripts/deploy.sh floci` / `pnpm deploy:floci` | **One command** — start emulator, seed AWS resources & secrets, build/push images, render & apply the k8s manifests to the Floci k3s cluster |
| `./scripts/deploy.sh aws` / `pnpm deploy:aws` | Same pipeline against real AWS: push to ECR, then ArgoCD syncs `k8s/overlays/production` |
| `./scripts/use-env.sh local` / `pnpm aws:local` | Points `.env` at Floci `localhost:4566` |
| `./scripts/use-env.sh aws` / `pnpm aws:prod` | Clears `AWS_ENDPOINT_URL` so SDKs use real AWS |
| `./scripts/use-env.sh status` / `pnpm aws:status` | Shows current mode |
| `./scripts/floci-aws.sh <cmd>` | Runs an AWS CLI command against Floci |
| `pnpm floci:start` / `pnpm floci:stop` | Start / stop Floci + UI compose stack |
| `pnpm floci:seed` | Create demo resources (buckets, tables, queues, secrets, EKS cluster, RDS) |
| `pnpm floci:logs` / `pnpm floci:ui` | Tail emulator logs / open web console |

> Every script is documented in [Scripts & Tooling](./scripts-and-tooling.md) — but you
> generally only need `./scripts/deploy.sh`.

```bash
# Local development (no AWS account):
./scripts/use-env.sh local
docker compose -f docker-compose.floci.yml up -d

# Ready to deploy / test against real AWS:
./scripts/use-env.sh aws
terraform -chdir infrastructure/aws apply
```

### In application code

Import the shared AWS config service — it auto-detects the mode from env:

```typescript
import { AwsConfigService } from '@app/aws';

// Injected into any provider
const s3 = this.aws.createS3Client();        // points at Floci or real AWS automatically
const sqs = this.aws.createSqsClient();
const secrets = this.aws.createSecretsManagerClient();
```

- **Floci mode** → clients use `http://localhost:4566` with `test`/`test` creds.
- **Real AWS** → endpoint is unset and credentials come from the default provider chain (env vars, `~/.aws/credentials`, or an EKS/EC2 role).

Only these five variables drive it — flip them and the entire platform switches: `AWS_ENDPOINT_URL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`, `AWS_STORAGE_MODE`.

---

## Part 4 — Multi-Cloud Portability

The platform is designed to avoid lock-in. Key principles:

1. **The application layer is plain Kubernetes.** `k8s/` manifests, ConfigMaps, Secrets, and ArgoCD work on EKS, GKE, AKS, or any CNCF cluster — zero application changes.
2. **Cloud-specific concerns live only in `infrastructure/`.** The AWS Terraform (`infrastructure/aws`) is the *only* place AWS appears. A future `infrastructure/gcp` or `infrastructure/azure` directory would provision the same Kubernetes manifests with provider-native managed services.
3. **Data-plane endpoints are environment configuration.** Per-environment overlay ConfigMaps (`k8s/overlays/<env>/configmap-data.yml`) supply the DB/Redis/ES endpoints from each cloud's Terraform outputs — the app layer stays identical. This is what makes migration safe: point the overlay at the new cloud's managed endpoints and redeploy.
4. **Configuration via environment.** All infra-specific values flow through ConfigMaps/Secrets, not hardcoded imports.

**Migration path if you ever switch clouds:**

1. Keep `k8s/` as-is (it's already portable).
2. Stand up the new cloud's Terraform (mirror `infrastructure/aws` structure).
3. Point ArgoCD at the same repo/path on the new cluster.
4. Switch data plane flags: migrate data via native tooling, then flip `enable_*` to `false`/`true` as appropriate.

---

## 📚 Related

- [Docker Setup](./docker-setup.md) — local container orchestration.
- [Scaling & Sharding](./scaling-and-sharding.md) — the data plane behind the managed-service flags.
- [Observability](./observability.md) — Prometheus/Grafana on the cluster.
- [Back to Infrastructure Home](./README.md)

[⬅️ Back to Home](../../README.md)
