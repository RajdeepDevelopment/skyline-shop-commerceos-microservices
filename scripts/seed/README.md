# Product Seeding & Verification (`scripts/seed/`)

Scripts for seeding and verifying the **sharded** product databases + Elasticsearch,
for both the floci k3s cluster (`k8s`) and the local docker-compose setup (`compose`).

| Script | Purpose |
| --- | --- |
| [`seed-db.ts`](seed-db.ts) | Bulk seed N products directly into the per-shard Postgres DBs **and** Elasticsearch (fast, `COPY` + ES bulk). |
| [`seed-api.ts`](seed-api.ts) | Seed products through the REST API (`POST /api/v1/products`, JWT auth). PG only — run `sync-es.ts` afterwards for search. |
| [`sync-es.ts`](sync-es.ts) | Rebuild the ES `products` index from the shard DBs (use after `seed-api` or manual DB changes). |
| [`verify.ts`](verify.ts) | Check per-shard row counts, ES doc count, SKU↔shard hash consistency, and (with `--api`) REST totals. |

Shared helpers live in [`lib/`](lib) — crucially [`lib/sku-hash.ts`](lib/sku-hash.ts) is
byte-for-byte the same hash as `DatabaseService` in `libs/database/src/database.service.ts`,
so seeded rows always land on the shard the application reads from.

`SEED_TARGET` selects the endpoint layout (both targets use the same scripts):

| Target | DB access | ES | API (seed-api / verify --api) |
| --- | --- | --- | --- |
| `k8s` (default) | `kubectl -n ecommerce port-forward svc/pgbouncer 6432:6432` → shard DBs `products_s0..s3` | `kubectl -n ecommerce port-forward svc/elasticsearch 9200:9200` | `kubectl -n ecommerce port-forward svc/api-gateway 3300:3000` |
| `compose` | `docker compose up -d` → per-shard pgbouncers `localhost:6461..6464` (DBs `product_s0..s3`) | `localhost:9200` (es1) | api-gateway on host at `localhost:3000` (or nginx `localhost:80`) |

---

## 1. Seed directly into the databases

```bash
# k8s cluster (floci) — 10,000 products across products_s0..s3 + ES
kubectl --kubeconfig .kube/config -n ecommerce port-forward svc/pgbouncer 6432:6432 &
kubectl --kubeconfig .kube/config -n ecommerce port-forward svc/elasticsearch 9200:9200 &
SEED_PRODUCT_COUNT=10000 npx ts-node scripts/seed/seed-db.ts

# docker-compose infra on the host
SEED_TARGET=compose SEED_PRODUCT_COUNT=10000 npx ts-node scripts/seed/seed-db.ts
```

Large volumes (10M/30M) use the same script — it streams in bounded-memory chunks:

```bash
NODE_OPTIONS="--max-old-space-size=8192" \
  SEED_PRODUCT_COUNT=10000000 \
  npx ts-node scripts/seed/seed-db.ts
```

### Env vars (all scripts)
| Var | Default | Meaning |
| --- | --- | --- |
| `SEED_TARGET` | `k8s` | `k8s` or `compose` endpoint layout |
| `SEED_PRODUCT_COUNT` | `10000` (db) / `200` (api) | number of products |
| `SEED_SHARD_COUNT` | `4` | number of product shards; `1` = single DB |
| `SEED_SHARD_URLS` | — | explicit comma-separated PG URLs (overrides target) |
| `PRODUCT_DATABASE_WRITE_URL` | k8s: `postgresql://root:password@localhost:6432/products` | base URL; k8s shards derived as `/products_s{n}` |
| `ELASTICSEARCH_URL` | `http://localhost:9200` | ES endpoint |
| `SEED_RESET` | `true` | `true` truncates PG + recreates the ES index |

## 2. Seed through the REST API

```bash
# k8s cluster (floci)
kubectl --kubeconfig .kube/config -n ecommerce port-forward svc/api-gateway 3300:3000 &
SEED_PRODUCT_COUNT=200 npx ts-node scripts/seed/seed-api.ts

# compose — api-gateway running on the host
SEED_TARGET=compose SEED_PRODUCT_COUNT=200 npx ts-node scripts/seed/seed-api.ts
```

The script auto-registers/logs in the seed user (`seed.admin@skyline.local`,
`SEED_API_EMAIL` / `SEED_API_PASSWORD` to override) and posts products with bounded
concurrency (`SEED_API_CONCURRENCY`). It writes Postgres only, so finish with:

```bash
npx ts-node scripts/seed/sync-es.ts     # k8s (with pgbouncer + es port-forwards)
SEED_TARGET=compose npx ts-node scripts/seed/sync-es.ts
```

## 3. Verify a seed run

```bash
npx ts-node scripts/seed/verify.ts           # PG + ES + hash consistency
npx ts-node scripts/seed/verify.ts --api     # + REST checks (needs api-gateway reachable)
```

It prints per-shard counts, the ES document count, and asserts for a random SKU
sample per shard that `hash(sku) % shardCount` matches the shard the row lives on.
Exit code is non-zero if any check fails.

Expected for a fresh 10,000-product run: ~2,500 products per shard × 4 shards
= 10,000 in PG and 10,000 docs in ES.

## Manual SQL / curl spot checks

```bash
# per-shard counts (k8s, via pgbouncer port-forward)
for i in 0 1 2 3; do
  echo -n "products_s$i: "
  kubectl --kubeconfig .kube/config -n ecommerce exec deploy/postgres -- \
    psql -U root -d products_s$i -Atc 'SELECT COUNT(*) FROM products' 2>/dev/null
done

# ES doc count
curl -s http://localhost:9200/products/_count

# REST (k8s: api-gateway on :3300, compose: :3000)
curl -s 'http://localhost:3300/api/v1/products?limit=1'
curl -s 'http://localhost:3300/api/v1/products/search?q=iphone'
curl -s 'http://localhost:3300/api/v1/products?limit=1&category=beauty'
```
