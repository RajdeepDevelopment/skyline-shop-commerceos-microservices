# 🛒 Cart Service

The **Cart Service** manages the highly volatile state of user shopping carts and active checkout sessions.

## 🗺️ Checkout Flow

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant GW as API Gateway
    participant C as Cart Service
    participant RD as Redis
    participant O as Order Service

    U->>GW: Browse / add to cart
    GW->>C: AddItem (gRPC)
    C->>RD: Set cart (TTL expiry)
    C-->>U: Cart updated
    U->>GW: Checkout (Buy Now)
    GW->>C: GetCartSnapshot (gRPC)
    C->>RD: Read cart + locked prices
    C->>O: Provide snapshot for order
    O-->>C: Order created (PENDING)
```

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Data Store**: Redis (for sub-millisecond persistence)
- **Protocol**: gRPC

## 📋 Responsibilities

1. **Cart Persistence**: Managing items, quantities, and expiration.
2. **Pricing Snapshots**: Locking in prices during the checkout window.
3. **Checkout Initiation**: Serving as the data source for the `Order Service` when a user clicks 'Buy'.

## ⚡ Performance Strategy

- **In-Memory Storage**: Uses Redis to handle high-frequency read/write operations without hitting the primary database.
- **Auto-Cleanup**: TTL-based expiration for abandoned carts.

---

[⬅️ Back to Services Index](./README.md)
