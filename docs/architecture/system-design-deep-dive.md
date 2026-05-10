# 🏗️ System Design & Architecture

<div align="center">
  [![Architecture: Microservices](https://img.shields.io/badge/Architecture-Microservices-blue?style=flat-square)](#)
  [![Pattern: Event--Driven](https://img.shields.io/badge/Pattern-Event--Driven-green?style=flat-square)](#)
  [![Pattern: CQRS](https://img.shields.io/badge/Pattern-CQRS-orange?style=flat-square)](#)
  [![Security: Zero--Trust](https://img.shields.io/badge/Security-Zero--Trust-red?style=flat-square)](#)
</div>

This document provides a deep-dive into the core engineering principles and architectural patterns that define the E-Commerce Microservices Platform.

---

## 🏛️ Architectural Philosophy

| Principle               | Strategic Intent                                            | Implementation                                                       |
| :---------------------- | :---------------------------------------------------------- | :------------------------------------------------------------------- |
| **Decentralization**    | Eliminate single points of failure and domain coupling.     | Independent service runtimes and dedicated databases per domain.     |
| **Event-Driven**        | Maximize system availability and eventual consistency.      | Async choreography using NATS JetStream for all post-checkout flows. |
| **Clean Architecture**  | Ensure long-term maintainability and framework agnosticism. | Strict separation of Domain, Application, and Infrastructure layers. |
| **Observability First** | Guarantee system visibility in a distributed environment.   | Native Prometheus metrics and structured logging in every service.   |

---

## 🗺️ Core Patterns

### 🔄 Saga Pattern (Distributed Transactions)

Since we maintain dedicated databases for every service, we use the **Saga Choreography Pattern** to ensure eventual consistency across the platform.

```mermaid
sequenceDiagram
    participant O as Order Service
    participant I as Inventory Service
    participant P as Payment Service
    participant N as Notification Service

    O->>O: Create PENDING Order
    O->>I: Event: order.created
    I->>I: Reserve Stock
    alt Stock Available
        I->>O: Event: inventory.reserved
        O->>P: Event: payment.initiated
        alt Payment Success
            P->>O: Event: payment.success
            O->>O: Mark Order CONFIRMED
            O->>N: Event: order.confirmed
        else Payment Failed
            P->>O: Event: payment.failed
            O->>O: Mark Order CANCELLED
            O->>I: Event: inventory.release
        end
    else Out of Stock
        I->>O: Event: inventory.unavailable
        O->>O: Mark Order REJECTED
    end
```

### ⚡ CQRS (Command Query Responsibility Segregation)

We optimize for asymmetric read/write loads by separating the paths for data modification and data retrieval.

```mermaid
graph LR
    User[Client] --> C[Commands: POST/PUT/PATCH]
    User --> Q[Queries: GET]

    subgraph "Write Path"
        C --> OS[Order Service]
        OS --> PDB[(Primary DB)]
    end

    subgraph "Read Path"
        Q --> AS[Analytics Service]
        AS --> RDB[(Read Replica/Cache)]
    end

    PDB -- Async Sync --> RDB
```

---

## 🛡️ Security-in-Depth

| Security Layer        | Implementation Detail          | Risk Mitigated                            |
| :-------------------- | :----------------------------- | :---------------------------------------- |
| **Edge Security**     | Nginx Rate Limiting & TLS 1.3  | DDoS attacks & Man-in-the-Middle.         |
| **Identity**          | JWT with RSA-256 signatures    | Unauthorized API access.                  |
| **Payload Integrity** | **OpenPGP** Asymmetric Signing | Internal message spoofing & tampering.    |
| **Data at Rest**      | AES-256 DB Encryption          | Physical data theft or snapshot exposure. |

---

## ï¿½️ Resiliency & Reliability

```mermaid
stateDiagram-v2
    [*] --> Closed
    Closed --> Open: Failures > Threshold
    Open --> HalfOpen: Timeout Expired
    HalfOpen --> Closed: Success
    HalfOpen --> Open: Failure

    note right of Open: Service returns fallback/error immediately
```

---

## 📈 Observability Philosophy

We follow the **Three Pillars of Observability**:

1.  **Metrics**: Prometheus counters/gauges for system health.
2.  **Logging**: Structured JSON logs with `correlation_id` for tracing.
3.  **Tracing**: (In Roadmap) Distributed request tracing across service boundaries.

---

<div align="center">
  [⬅️ Back to README](../../README.md) • [Explore Service Catalog](../services/README.md)
</div>
