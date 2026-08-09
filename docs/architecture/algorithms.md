# 🧮 Algorithms & Data Structures

Every feature in Skyline Shop is backed by a specific algorithm or data structure. This document catalogues **what is used, where, and why** — the engineering "why" behind each choice, verified against the codebase.

---

## 📑 Index by Feature

| Feature | Algorithm / Data Structure | Where |
| :--- | :--- | :--- |
| Data routing | **djb2 string hash + modulo sharding** | `libs/database/src/database.service.ts` |
| Product search | **Elasticsearch multi-match + fuzzy (BM25)** | `libs/common/src/search/elasticsearch.service.ts` |
| Search suggestions | **Keyword prefix matching** | same |
| Trending / ranking | **Weighted profile scoring + log-normalized signals** | `apps/analytics-service/src/ranking-engine.service.ts` |
| Deals ranking | **Discount × blended trending score** | same |
| Best sellers | **Weighted purchase/revenue/rating/conversion** | same |
| Frequently bought | **Pair co-occurrence counting (market-basket)** | same |
| Similar products | **Category/brand term matching (ES)** | `apps/product-service/src/product-service.service.ts` |
| Recommendations | **Behaviour-event lists in Redis zsets** | `libs/common/src/behaviour/redis-discovery.service.ts` |
| Checkout | **Saga orchestration + compensation** | `apps/order-service/src/saga/order-saga.orchestrator.ts` |
| Exactly-once | **Idempotency keys + unique constraints** | Prisma `IdempotencyKey`, `Order.idempotencyKey` |
| Reliable events | **Transactional outbox + relay** | `libs/common/src/outbox/outbox.service.ts` |
| Retries | **Exponential backoff (RxJS)** | `libs/common/src/utils/resiliency.ts` |
| Failure isolation | **Circuit breaker** | `libs/common/src/resilience/circuit-breaker.service.ts` |
| Auth | **bcrypt (password) + JWT (HS256) + refresh rotation** | `apps/auth-service/src/auth-service.service.ts` |
| Service-to-service | **PGP payload signing** | `libs/common/src/interceptors/secure-message.interceptor.ts` |
| Delivery SLA | **Pincode → warehouse priority matching** | Availability service, `pincode_serviceability` |
| Reviews | **Aggregated rating + helpful-vote counting** | Product service / Prisma `Review` |

---

## 🔑 Data Routing — djb2 Hash + Modulo Sharding

**Why it scales:** product and order data is partitioned across N physical PostgreSQL shards so no single node holds the full dataset.

```ts
// libs/database/src/database.service.ts
private hashKey(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i); // djb2-style
    hash |= 0;
  }
  return Math.abs(hash);
}
// shardIndex = hash % shardCount
```

| Key type | Shard key | Shards |
| :--- | :--- | :--- |
| Product | `sku` (unique per item) | 4 |
| Order | `orderId` / `userId` | 4 |
| Auth | `userId` | 2 |

**Properties:** deterministic (same key → same shard), O(len) time, uniform-ish distribution for UUID/SKU keys, zero dependencies. Writes are single-node per key; cross-shard queries (e.g. "all orders") fan out via `getAllShards()`.

---

## 🔍 Search & Suggestions

### Multi-match + fuzzy search (Elasticsearch / BM25)

`multi_match` with `prefix_length: 2` gives typo-tolerant matching over title/description/brand/tags while staying cheap on term expansion. Results are ranked by **BM25 relevance** by default.

```
multi_match (fields: title, description, brand, tags, category)
  fuzziness with prefix_length: 2
  + bool filter on category (keyword)
  + range filters: price (INR), rating ≥ x, stock > 0
```

### Price-range filtering

`minPrice` / `maxPrice` are applied as an ES `range` query on the indexed **INR price** — so filters always match the price shown to shoppers.

### Autocomplete

`prefix` match on `title.keyword` (case-insensitive), deduplicated with `Set`, capped by `limit`. Redis `search:*` keys cache popular query results.

---

## 📈 Discovery Ranking Engine

Runs every `RANKING_INTERVAL_MS` (default 15 min). Each product gets a **composite score** per profile.

### Signal normalization — `log1p`

Raw counts (views, searches, carts, purchases, wishlists, returns) are scaled to [0,1] to tame power-law distributions:

```ts
out[id] = Math.log1p(count) / max;   // max = max over log1p(counts)
```

### Profile weights

| Profile | Weights |
| :--- | :--- |
| `default` | sales 0.30 · conversion 0.20 · search 0.15 · views 0.10 · rating 0.10 · freshness 0.05 · inventory 0.05 · business 0.05 |
| `trending` | views 0.25 · search 0.20 · cart 0.20 · wishlist 0.10 · purchase 0.15 · rating 0.10 |
| `bestsellers` | purchase 0.50 · revenue 0.20 · rating 0.15 · conversion 0.15 |

Admin boosts (`0–100`, Redis `discovery:boosts`) are blended in so merchandising can override organic rank.

### Deals

`dealScore = discountPercentage × (0.6 + 0.4 × trendingScore)` — a deep discount wins, but a trending item with the same discount ranks above.

### Frequently-bought-together

**Pair co-occurrence counting** from ClickHouse purchase sessions (last 30 days): for every product in a session, increment a counter for every other product in that session; rank by count, keep top 8. This is a simplified **market-basket / association** analysis (like Apriori's confidence step, without the expensive candidate generation).

### Similar products

Elasticsearch `term` queries on the **same category + brand** — the cheapest proxy for "similar" that stays index-backed.

---

## 🛒 Checkout — Saga Orchestration

The order flow is an **orchestrated saga** (`order-saga.orchestrator.ts`): a coordinator state machine drives inventory → payment → confirmation, with explicit compensation:

```mermaid
graph LR
    Create[Create PENDING] --> Reserve[Reserve Inventory]
    Reserve -->|ok| Pay[Process Payment]
    Reserve -->|no stock| Reject[REJECTED]
    Pay -->|ok| Confirm[CONFIRMED + outbox]
    Pay -->|fail| Release[RELEASE inventory (compensation)]
    Pay -->|fail| Fail[FAILED]
```

Guarantees:
- **Exactly-once payments**: `IdempotencyKey.key` is a PK with a unique request hash; concurrent duplicate submissions are rejected.
- **Order uniqueness**: `Order.idempotencyKey` is `@unique` — retrying a request never double-creates.
- **Reservation cleanup**: `inventory_reservations` rows carry `expiry_time`; a scheduler releases expired/abandoned reservations.

---

## 📮 Reliable Event Delivery

- **Transactional outbox**: order events are written to `outbox_messages` in the **same DB transaction** as the order, then a relay polls `published=false` and publishes to NATS (with retry/backoff). No "DB committed but event lost" window.
- **Exponential backoff** (`libs/common/src/utils/resiliency.ts`): `retryAttempt × scalingDuration` via RxJS `retryWhen`.
- **Circuit breaker** (`libs/common/src/resilience/circuit-breaker.service.ts`): trips on consecutive failures so a slow upstream can't cascade.
- **At-least-once**: NATS JetStream persists events; every consumer is idempotent.

---

## 🔐 Security Algorithms

| Concern | Algorithm | Notes |
| :--- | :--- | :--- |
| Password hashing | **bcrypt** (configurable salt rounds) | Slow-hash designed for passwords |
| Session tokens | **JWT (HS256)** | Short-lived access token + rotating refresh token |
| Service-to-service | **PGP / OpenPGP signing** | `secure-message.interceptor.ts` signs gRPC payloads |

---

## 📦 Key Data Structures

| Structure | Used for | Where |
| :--- | :--- | :--- |
| Redis **sorted sets (zset)** | real-time counts, ranked lists, recently-viewed | `redis-discovery.service.ts` |
| Redis **hashes** | hot product meta for recommendations | `discovery:products:meta` |
| PostgreSQL **unique indexes** | idempotency, cart item uniqueness, votes | Prisma schema |
| ES **inverted index** | full-text search & filters | `products` index |
| ClickHouse **MergeTree (partitioned by day)** | behaviour event analytics | `analytics.behaviour_events` |

---

## 📚 Related

- [Database Architecture](./database-architecture.md) — the stores behind these algorithms.
- [Discovery & Ranking](./discovery-and-ranking.md) — end-to-end event pipeline.
- [Scaling & Sharding](../infrastructure/scaling-and-sharding.md) — the data plane at scale.

[⬅️ Back to Architecture Index](./README.md)
