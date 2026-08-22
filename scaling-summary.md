# Project Structure & Scaling Overview

## 1. Repository Layout

| Directory / File                                                                               | Purpose                                                                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **apps/**                                                                                      | 12+ independent NestJS microservices (`auth-service`, `product-service`, `order-service`, `cart-service`, `payment-service`, `analytics-service`, etc.). Each service has its own Dockerfile, Prisma schema, and entry point. |
| **libs/**                                                                                      | Shared libraries (DTOs, validation schemas, auth utilities, Prisma clients, etc.) that are imported by multiple services, keeping the monorepo DRY.                                                                           |
| **docker/**                                                                                    | Docker‑Compose files, Dockerfiles, and helper scripts that spin up the full 63‑container stack (or lite/mid profiles).                                                                                                        |
| **docs/**                                                                                      | Full architectural reference: system‑design deep‑dive, scaling & sharding, security, deployment, ADRs, learning path, etc.                                                                                                    |
| **infrastructure/**                                                                            | Terraform IaC for AWS/Floci environments, plus scripts for DB migrations, seeding, AWS CLI helpers.                                                                                                                           |
| **scripts/**                                                                                   | Bootstrap (`setup.sh`), seeders (`seed:db.ts`, `seed:es.ts`), CI helpers, compose generators, deployment wrappers.                                                                                                            |
| **docker‑compose.yml** / **docker‑compose.floci.yml**                                          | Reference stacks for local dev (`lite`, `mid`, `full`) and for the Floci‑specific deployment.                                                                                                                                 |
| **README.md**                                                                                  | High‑level vision, tech‑matrix, scaling targets, end‑to‑end flow diagrams, and a link to the full Getting‑Started guide.                                                                                                      |
| **package.json**                                                                               | Monorepo scripts (`build`, `start:*`, `test`, `lint`, `concurrently` for “start:all”, release commands, Floci commands, etc.).                                                                                                |
| **pnpm-workspace.yaml**                                                                        | Declares the workspace that ties together `@app/*` and `@libs/*` packages.                                                                                                                                                    |
| **.env / .env.example**                                                                        | Centralised configuration (shard counts, DB URLs, Redis endpoints, NATS config, etc.).                                                                                                                                        |
| **test/**                                                                                      | End‑to‑end and unit‑test harnesses (Jest, supertest, testcontainers).                                                                                                                                                         |
| **CHANGELOG.md**, **CODE_OF_CONDUCT.md**, **CONTRIBUTING.md**, **SECURITY.md**, **CODEOWNERS** | Governance, contribution guidelines, and licensing.                                                                                                                                                                           |

---

## 2. Scaling Foundations

| Layer                     | Technology                                           | Scaling Mechanism                                                                                                                                                                                                                                       |
| ------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Edge / Load Balancing** | Nginx (TLS, WAF, rate‑limiting)                      | Distributes client traffic across all pods; supports active‑active scaling.                                                                                                                                                                             |
| **API Gateway**           | NestJS (stateless)                                   | Scales horizontally via K8s HPA (CPU > 70 %).                                                                                                                                                                                                           |
| **Microservices**         | NestJS (Node 24)                                     | Each service can be replica‑scaled independently; typical pod counts: Auth 10, Product 25, Order 25, Cart 25, others 10‑25.                                                                                                                             |
| **Database**              | PostgreSQL (sharded) + PgBouncer                     | **Application‑level sharding** (2‑4 shards per service, key‑based hashing). Each shard has dedicated **PgBouncer** pools (transaction mode, `default_pool_size=30`, `max_client_conn=2000`). Read traffic goes to replicas; writes go to primary pools. |
| **Caching**               | Redis (6 M+ masters + replicas)                      | Stores cart data, sessions, idempotency keys, distributed locks – sub‑ms latency.                                                                                                                                                                       |
| **Search**                | Elasticsearch (6‑node cluster, 6 shards, 2 replicas) | Offloads product search, filters, and ranking from the OLTP DB.                                                                                                                                                                                         |
| **Messaging**             | NATS JetStream (5‑node cluster)                      | Durable event bus for business events; enables Saga pattern and outbox for eventual consistency.                                                                                                                                                        |
| **Analytics**             | ClickHouse (columnar OLAP)                           | Stores high‑volume event data for fast aggregation without burdening PostgreSQL.                                                                                                                                                                        |
| **Observability**         | OpenTelemetry → Prometheus → Grafana + Jaeger        | Provides metrics, traces, and SLI/SLO monitoring to drive data‑driven scaling decisions.                                                                                                                                                                |
| **Infrastructure**        | Docker‑Compose (local) / Kubernetes (production)     | Stateless services enable horizontal pod autoscaling; rolling updates with PodDisruptionBudgets for zero‑downtime.                                                                                                                                      |

---

## 3. Quantitative Capacity (Full Profile)

| Metric                  | Target        | How It’s Achieved                                                       |
| ----------------------- | ------------- | ----------------------------------------------------------------------- |
| **Registered users**    | 10 M+         | Stateless JWT sessions, sharded identity stores, Redis caching.         |
| **Product catalog**     | 1 M+ SKUs     | 4‑way PostgreSQL sharding + Elasticsearch indexing.                     |
| **Concurrent sessions** | 10 k+         | HPA‑scaled pods + Redis‑backed session state.                           |
| **Order throughput**    | Thousands TPS | NATS buffering + Saga orchestration + idempotent processing.            |
| **Search latency**      | < 100 ms p99  | 6‑node Elasticsearch cluster + query caching.                           |
| **Overall p99 latency** | Sub‑second    | Combined effect of caching, sharding, connection pooling, async events. |

---

## 4. Scaling Levers

| What to Adjust                                                             | Effect                                                            |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Increase shard count** (e.g., product shards 4 → 8)                      | Distributes write pressure across more DB shards.                 |
| **Add Redis replicas**                                                     | Raises cache‑hit capacity for cart/session data.                  |
| **Scale Elasticsearch shards**                                             | Lifts search QPS beyond the current 6‑shard limit.                |
| **Tune HPA thresholds** or add **custom metrics** (e.g., NATS queue depth) | Spins up extra pods before CPU saturation.                        |
| **Upgrade PgBouncer pool sizes**                                           | Accommodates higher concurrent DB connections as pod count grows. |
| **Deploy additional NATS nodes**                                           | Adds bandwidth and fault tolerance to the event bus.              |
| **Enable read‑only replicas**                                              | Offloads reporting/analytics from the primary write path.         |

All adjustments are configuration‑driven (environment variables, Docker‑Compose overrides, Terraform parameters). The supplied scripts (`setup.sh`, `floci:start`, etc.) automatically generate the new stack and tear down the old one.

---

> **Result:** The repository is organized as a monorepo of independent NestJS services with shared libraries, comprehensive documentation, and infrastructure‑as‑code. Scaling is achieved through horizontal pod replication, application‑level database sharding, sophisticated connection pooling, multi‑tier caching, event‑driven saga orchestration, and full observability — providing a blueprint capable of supporting 10 M+ users, 1 M+ products, and tens of thousands of concurrent sessions with sub‑second latency.
