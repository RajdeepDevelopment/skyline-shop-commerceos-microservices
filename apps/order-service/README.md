# Order Service

## Purpose

Handles order lifecycle management and coordination between inventory and payments.

## Responsibilities

- Create and manage orders.
- Coordinate inventory reservations via gRPC.
- Handle payment status updates via NATS.
- Emit domain events for downstream processing.

## Architecture

This service implements the **CQRS (Command Query Responsibility Segregation)** pattern to separate order creation logic from order retrieval.

## Key Features

- **State Machine**: Robust order status transitions.
- **Resiliency**: Built-in retries for inventory and payment calls.
- **High Performance**: Optimized queries for order history.

## Related Documentation

- [Architecture Overview](../../docs/architecture/system-overview.md)
- [Order Service Detailed Doc](../../docs/services/order-service.md)
- [Checkout Flow](../../docs/flows/checkout-flow.md)
