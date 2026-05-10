# ðŸ“Š Analytics Service

## ðŸ“ Overview

Consumes system-wide events to provide business intelligence and tracking.

## ðŸ—ºï¸ System Design & Logic

- **Event Sourcing**: Reconstructs state from historical events.
- **Big Data Ready**: Designed to pipe events into data warehouses.

## ðŸ”— Inner Documentation

- **[Architecture](./docs/architecture.md)** - Event aggregation and processing.

## ðŸ”„ Core Flow: Event Collection

```mermaid
graph TD
    S1[Auth] -- login --> N[NATS]
    S2[Order] -- created --> N
    S3[Product] -- viewed --> N
    N --> A[Analytics Service]
    A --> DB[(Time-Series DB)]
```

---

[â¬…ï¸ Back to Platform Services](../../docs/services/README.md)
