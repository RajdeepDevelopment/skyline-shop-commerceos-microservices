# 💳 Payment Service

The **Payment Service** handles financial transactions and integrates with third-party payment providers.

## 🗺️ Payment Flow

```mermaid
sequenceDiagram
    autonumber
    participant S as Saga Orchestrator
    participant P as Payment Service
    participant RD as Redis (Idempotency)
    participant G as Payment Gateway

    S->>P: ProcessPayment(orderId, amount, idempotencyKey)
    P->>RD: Check idempotencyKey
    alt New request
        RD-->>P: Not found
        P->>G: Charge (tokenized card)
        G-->>P: success
        P->>RD: Store idempotencyKey + result
        P-->>S: payment.success
    else Retry / duplicate
        RD-->>P: Cached result
        P-->>S: Cached result (no double charge)
    end
```

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Data Store**: Redis (for idempotency keys)
- **Messaging**: NATS JetStream

## 📋 Responsibilities

1. **Transaction Processing**: Securely handling payment gateways (Stripe, PayPal, etc.).
2. **Idempotency Guarantee**: Ensuring a user is never charged twice for the same order.
3. **Refund Logic**: Reversing transactions when orders are cancelled.

## 🛡️ Security

- **PCI Compliance Patterns**: Never storing raw card data; using secure tokens.
- **Idempotency Keys**: Tracking every request to prevent duplicate charges during network retries.

---

[⬅️ Back to Services Index](./README.md)
