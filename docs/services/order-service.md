# ðŸ›ï¸ Order Service

## Purpose

The Order Service is the primary orchestrator of the commerce lifecycle, managing everything from order creation to final fulfillment.

## Responsibilities

- **Order Creation**: Processing checkout requests.
- **State Management**: Managing the lifecycle (Pending -> Paid -> Shipped -> Delivered).
- **Inventory Coordination**: Communicating with Inventory Service for reservations.
- **Payment Integration**: Orchestrating with Payment Service for transactions.
- **Event Emission**: Emitting domain events for other services (e.g., `order.created`).

## Architecture

- **Pattern**: CQRS + Event-Driven.
- **Database**: PostgreSQL (Prisma).
- **Communication**: gRPC (Internal Sync) & NATS (External Async).

## ðŸ—ºï¸ Request Flow

```mermaid
sequenceDiagram
    participant GW as Gateway
    participant O as Order Service
    participant I as Inventory Service
    participant P as Payment Service

    GW->>O: Create Order
    O->>I: Reserve Stock (gRPC)
    I-->>O: Success
    O->>P: Process Payment
    P-->>O: Success
    O->>O: Transition to PAID
```

## ðŸ“¦ Folder Structure

- `src/application`: Use cases and command handlers.
- `src/domain`: Entities, value objects, and repository interfaces.
- `src/infrastructure`: DB entities, NATS providers, and gRPC clients.

---

[ðŸ”— View Checkout Flow](../flows/checkout-flow.md) | [ðŸ—ï¸ View CQRS Pattern](../architecture/cqrs-pattern.md) | [â¬…ï¸ Back to Service Catalog](./README.md)
