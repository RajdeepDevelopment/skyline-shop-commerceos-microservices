# 📦 Availability Service

## Purpose

Handles **pincode-level delivery SLA** and **stock availability** for the storefront, answering "is this SKU deliverable to this pincode, in what quantity, and when?"

## Responsibilities

- **Check availability**: `GET /products/:sku/availability?pincode=&quantity=` — returns deliverable status + delivery ETA.
- **Reservations**: Reserve stock for an order at a pincode, then confirm on payment or release on failure/cancellation.
- **Delivery SLA**: Uses the `warehouses` and `pincode_serviceability` tables (seeded with delivery-day estimates) to compute ETA.
- **Event consumer**: Listens to inventory-updated events to keep availability + cache fresh.
- **Redis cache**: Caches availability lookups for hot SKUs to keep sub-ms p99.

## Tech Stack

- **Framework**: NestJS
- **Data Store**: PostgreSQL (Prisma) — `warehouses`, `pincode_serviceability`
- **Cache**: Redis
- **Messaging**: NATS (inventory events)

## Related Documentation

- [System Overview](../../docs/architecture/system-overview.md)
- [Catalog Browsing Flow](../../docs/flows/catalog-browsing-flow.md)
- [Checkout Flow](../../docs/flows/checkout-flow.md)
