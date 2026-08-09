# 🏗️ Inventory Service

## 📝 Overview

Tracks real-time stock levels and handles high-concurrency reservations.

## 🗺️ System Design & Logic

- **Atomic Reservations**: Uses database transactions to ensure stock doesn't go negative.
- **Synchronous gRPC**: Provides low-latency stock checks for the Order Service.

## 🔗 Inner Documentation

- **[Architecture & gRPC](./../../docs/architecture/README.md)** - Internal communication.
- **[Database Design](./../../docs/architecture/database-architecture.md)** - Stock and Reservation schemas.

## 🔄 Core Flow: Stock Reservation

```mermaid
sequenceDiagram
    participant O as Order Service
    participant I as Inventory Service
    participant DB as PostgreSQL

    O->>I: gRPC: ReserveStock(items)
    I->>DB: SELECT stock FOR UPDATE
    I->>DB: INSERT reservation
    I-->>O: Reservation Success
```

---

[⬅️ Back to Platform Services](../../docs/services/README.md)
