# ðŸš€ Intermediate: Distributed Systems

This phase moves from single-process logic into a distributed system.

## ðŸŽ¯ Learning Objectives

1.  **API Gateway Pattern**: Using `api-gateway` as the entry point for all services.
2.  **Service-to-Service gRPC**: Low-latency synchronous communication (e.g., `Order` â†” `Inventory`).
3.  **Event-Driven Pub/Sub**: Asynchronous messaging via NATS (e.g., `Order.created` â†’ `Notification`).
4.  **Distributed Caching**: Using Redis in the `cart-service` for ephemeral session data.

## ðŸŒ‰ Bridging the Gap

At this stage, you are no longer calling functions; you are calling **endpoints** and **services**.

### Key Concept: Synchronous vs Asynchronous

- **Sync (gRPC)**: "I need to know if we have stock _right now_."
- **Async (NATS)**: "The order is placed, someone needs to send an email _whenever possible_."

---

[âž¡ï¸ Next: Advanced Path](./advanced.md) | [â¬…ï¸ Back to Roadmap](./engineering-roadmap.md)
