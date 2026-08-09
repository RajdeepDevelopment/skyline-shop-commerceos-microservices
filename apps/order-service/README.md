# Order Service

## Purpose

Handles order lifecycle management and coordination between inventory and payments, backed by **4 PostgreSQL shards** with read replicas.

## Responsibilities

- Create and manage orders (idempotent, with an **outbox table** for zero-loss events).
- Run the **Saga Orchestrator** (reserve inventory → payment → confirm/compensate).
- Coordinate inventory reservations via gRPC.
- Handle payment status updates via NATS.
- Emit domain events for downstream processing (notification, analytics).
- Serve **order tracking**: `GetOrder` throws gRPC `NOT_FOUND` (code 5) for missing ids → HTTP `404` at the gateway (no ghost orders).

## Architecture

This service implements the **CQRS (Command Query Responsibility Segregation)** pattern to separate order creation logic from order retrieval.

## Key Features

- **Saga Pattern**: Orchestrated checkout with compensation (release inventory on payment failure).
- **State Machine**: Robust order status transitions (PENDING → CONFIRMED / FAILED / REJECTED).
- **Resiliency**: Built-in retries for inventory and payment calls.
- **Idempotency**: Idempotency keys deduplicate duplicate create requests.
- **Currency**: Payments are created in **INR** end-to-end.
- **High Performance**: Optimized queries for order history.

## Related Documentation

- [Architecture Overview](../../docs/architecture/system-overview.md)
- [Order Service Detailed Doc](../../docs/services/order-service.md)
- [Checkout Flow](../../docs/flows/checkout-flow.md)
- [Order Tracking Flow](../../docs/flows/track-order-flow.md)
