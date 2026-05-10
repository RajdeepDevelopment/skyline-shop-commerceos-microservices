# ðŸ’³ Payment Service

## ðŸ“ Overview

Handles financial transactions and integrates with external payment gateways.

## ðŸ—ºï¸ System Design & Logic

- **Idempotency**: Ensures that the same transaction isn't processed twice.
- **Security**: Never stores full card details; uses tokenization.

## ðŸ”— Inner Documentation

- **[Architecture & Security](./docs/architecture.md)** - Idempotency and Gateway integration.
- **[Database Design](./docs/database-design.md)** - Transaction logs.

## ðŸ”„ Core Flow: Payment Processing

```mermaid
sequenceDiagram
    participant O as Order Service
    participant P as Payment Service
    participant EX as External Gateway

    O->>P: ProcessPayment(orderId, amount)
    P->>P: Check Idempotency Key
    P->>EX: Charge Request
    EX-->>P: Success/Fail
    P-->>O: Payment Result
```

---

[â¬…ï¸ Back to Platform Services](../../docs/services/README.md)
