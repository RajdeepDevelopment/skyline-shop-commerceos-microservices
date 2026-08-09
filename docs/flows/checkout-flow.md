# 🌊 Checkout Flow

The checkout flow is a critical multi-service orchestration that transforms a shopping cart into a confirmed order. It combines a **synchronous request path** (via the API Gateway) with an **asynchronous Saga orchestration** over NATS JetStream, protected by idempotency keys and the outbox pattern.

![Order Confirmation](./../images/order-details.png)

## 🧭 Flow at a Glance

```mermaid
graph LR
    subgraph Client
        FE[Web Shop / Checkout]
    end

    subgraph "Sync Request Path"
        LB[Nginx LB]
        GW[API Gateway]
        CART[Cart Service]
    end

    subgraph "Order Core"
        OS[Order Service]
        SAGA[Order Saga Orchestrator]
        OUT[Outbox Table]
    end

    subgraph "Async Step Plane (NATS JetStream)"
        INV[Inventory Service]
        PAY[Payment Service]
        NOTIF[Notification Service]
    end

    FE -->|"POST /api/v1/orders"| LB
    LB --> GW
    GW --> CART
    CART -->|"validate & fetch items"| GW
    GW -->|"gRPC CreateOrder (idempotency key)"| OS
    OS -->|"create PENDING order"| SAGA
    SAGA -->|"gRPC reserve stock"| INV
    INV -->|"inventory.reserved event"| SAGA
    SAGA -->|"payment.process event"| PAY
    PAY -->|"payment.success event"| SAGA
    SAGA -->|"confirm order + outbox"| OUT
    OUT -->|"NATS event"| NOTIF
    NOTIF -->|"email / push"| FE
```

## 🔄 Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant G as API Gateway
    participant C as Cart Service
    participant O as Order Service
    participant S as Saga Orchestrator
    participant I as Inventory Service
    participant P as Payment Service
    participant N as Notification Service
    participant ES as Elasticsearch

    U->>G: POST /api/v1/orders (checkout)
    G->>C: Validate & Fetch Cart
    C-->>G: Cart Items (Product IDs, Qty)
    G->>O: gRPC CreateOrder(idempotencyKey)

    Note over O,S: Synchronous acknowledgement
    O->>O: Persist order (PENDING) + outbox row
    O-->>G: 201 Created (orderId)
    G-->>U: Redirect to Order Tracking

    Note over S,N: Asynchronous Saga orchestration
    O->>S: Publish order.created
    S->>I: Reserve Inventory (gRPC)

    alt Inventory Available
        I-->>S: Inventory Reserved
        S->>P: Publish payment.process
        alt Payment Success
            P-->>S: Payment Confirmed (idempotency-safe)
            S->>O: Confirm order (CONFIRMED)
            O->>N: Publish order.confirmed
            N-->>U: Send confirmation (email/push)
            Note over ES: Order indexed for account/track queries
        else Payment Failed
            P-->>S: Payment Declined
            S->>O: Mark order FAILED
            S->>I: Release Inventory (compensation)
        end
    else Inventory Unavailable
        I-->>S: Insufficient Stock
        S->>O: Mark order REJECTED
        G-->>U: Out of Stock
    end
```

## 🛠️ Services Involved

1.  **[API Gateway](../services/api-gateway.md)**: Single entry point, JWT guard, gRPC client.
2.  **[Cart Service](../services/cart-service.md)**: Source of truth for items being purchased.
3.  **[Order Service](../services/order-service.md)**: Owns the order lifecycle and outbox.
4.  **[Inventory Service](../services/inventory-service.md)**: Synchronous stock reservations.
5.  **[Payment Service](../services/payment-service.md)**: Idempotent financial transactions.
6.  **[Notification Service](../services/notification-service.md)**: Asynchronous confirmations via NATS.

## 🛡️ Reliability Guarantees

- **Exactly-once payment**: Idempotency keys (Redis) deduplicate payment events.
- **At-least-once delivery**: NATS JetStream persists events; consumers are idempotent.
- **Outbox pattern**: Order events are committed with the order in the same DB transaction, so no event is lost between DB commit and NATS publish.

---

[🔗 View Order Tracking Flow](./track-order-flow.md) | [🔗 View Catalog Browsing Flow](./catalog-browsing-flow.md) | [⬅️ Back to Flows Index](./README.md)
