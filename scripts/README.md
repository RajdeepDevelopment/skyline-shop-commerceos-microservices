# 🛠️ Scripts — what each one does

**One command to deploy the whole platform** (to Floci locally, or to real AWS):

```bash
./scripts/deploy.sh floci    # full deploy on the local Floci emulator (default)
./scripts/deploy.sh aws      # full deploy on real AWS (ECR + EKS / ArgoCD)
```

Everything else is a helper that `deploy.sh` uses internally — you rarely need to
call them by hand.

---

## 📋 Index

| Script | What it does | Run it when… |
|--------|--------------|--------------|
| `deploy.sh` | **The one entry point.** Starts/seeds the emulator (floci), resolves secrets from AWS Secrets Manager, builds & pushes images, renders the k8s manifests and applies them to the cluster. Targets: `floci` (default) or `aws`. | You want to deploy the whole stack. |
| `floci-seed.sh` | Seeds the Floci emulator with the real Skyline topology: S3 buckets, SQS/SNS, DynamoDB, **Secrets Manager entries (incl. `app-secrets` with random JWT/DB values)**, ECR repos, EKS cluster, RDS instances. Idempotent. | You recreated the Floci volumes and need resources/secrets back. |
| `floci-deploy.sh` | Renders `k8s/base` manifests (with `REGISTRY`/`TAG`/secrets injected) into `dist/k8s-rendered`, wraps them in a 1-replica local overlay, **wires the compose infra into the cluster** (attaches the k3s node to the host `ecommerce` Docker network and publishes headless Services + EndpointSlices so `redis-cluster`, `nats-headless`, `elasticsearch-*` and the 10 `pgbouncer-*` names resolve to the real compose containers), then `kubectl apply`s to the Floci k3s cluster (`.kube/config`). | You already have images pushed and just want to (re)apply manifests to Floci. |
| `use-env.sh` | Switches `.env` between **local** (Floci `localhost:4566`) and **aws** (real AWS). Also `status`. | Flipping which AWS surface the app talks to. |
| `use-aws.sh` / `use-local.sh` | Shorthand aliases for `use-env.sh aws` / `use-env.sh local`. | Quick env switch. |
| `floci-aws.sh` | Runs any `aws …` command **inside the Floci container** — no host AWS CLI, no account. `./scripts/floci-aws.sh s3 ls` | Poking at the emulated AWS from your host. |
| `floci-kube-token.sh` | kubectl exec credential plugin that mints a short-lived token from the Floci EKS emulator (used automatically by `.kube/config`). | Nothing — automatic. |
| `seed/` | TypeScript seeders: `seed-db.ts` (Postgres shards), `seed-api.ts` (via the API), `sync-es.ts` (Elasticsearch), `verify.ts`. Wired as `pnpm seed:*`. | Loading demo product/catalog data. |

## 🔑 Secrets flow

- `k8s/base/secrets.yml` is a **dev-only fallback** with placeholders — never the real values.
- `floci-seed.sh` stores **random** JWT / DB secrets in AWS Secrets Manager (`skyline-shop/staging/app-secrets`).
- `deploy.sh` reads that secret and renders `secrets.yml` from it (no secrets in git).
- In real AWS the same `deploy.sh aws` path reads from real Secrets Manager, and the
  IRSA roles in `infrastructure/aws/iam.tf` already grant `secretsmanager:GetSecretValue`.

## 🧹 Full reset (start from a blank slate)

```bash
docker compose -f docker-compose.floci.yml down -v   # wipe Floci state
docker volume rm -f $(docker volume ls -q)           # wipe ALL docker volumes
./scripts/deploy.sh floci                            # bring everything back
```
