# ðŸ›°ï¸ NATS Messaging

## ðŸ“ Overview

NATS JetStream is the nervous system of our platform, enabling asynchronous, event-driven communication between decoupled services.

## ðŸ—ï¸ Why NATS?

1.  **High Throughput**: Capable of handling millions of messages per second.
2.  **JetStream Persistence**: Provides "at-least-once" delivery guarantees and message replay capabilities.
3.  **Loose Coupling**: Services don't need to know about each other; they only care about subjects/events.
4.  **Lightweight**: Extremely low resource footprint compared to Kafka or RabbitMQ.

## ðŸ”„ Event Flow (Pub/Sub)

```mermaid
graph TD
    O[Order Service] -->|Publish: order.created| N((NATS JetStream))
    N -->|Push/Pull| P[Payment Service]
    N -->|Push/Pull| I[Inventory Service]
    N -->|Push/Pull| Notif[Notification Service]
```

---

[â¬…ï¸ Back to Infrastructure Index](./README.md)
