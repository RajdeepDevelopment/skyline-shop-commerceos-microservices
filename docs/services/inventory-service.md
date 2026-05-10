# 📦 Inventory Service

The **Inventory Service** is responsible for real-time stock management and ensuring product availability across the platform.

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Data Store**: PostgreSQL
- **Concurrency**: Optimistic locking to prevent over-selling.

## 📋 Responsibilities

1. **Stock Tracking**: Managing SKU levels across multiple warehouses.
2. **Synchronous Reservations**: Locking stock during the checkout saga.
3. **Restock Alerts**: Emitting events when products fall below safe thresholds.

## 🔄 Transactional Integrity

- **Distributed Locking**: Ensures that two users cannot buy the last item simultaneously.
- **Compensating Actions**: Releases stock automatically if the payment fails in the Saga flow.

---

[⬅️ Back to Services Index](./README.md)
