# 📦 Order Tracking Flow

After checkout, users track their order on the **Track Order** page. The page queries the **Order Service** through the API Gateway using the user's JWT session — and correctly surfaces a **404 "Order not found"** when an id is missing or belongs to another user.

![Order Details / Tracking](./../images/order-details.png)

## 🧭 Tracking Path

```mermaid
graph LR
    FE[Web Shop - Track Order]
    GW[API Gateway]
    OS[Order Service]
    SH[(Order Shards ×4)]
    RD[(Redis - idempotency)]
    AG[Account / Orders page]

    FE -->|"GET /api/v1/orders/:id (JWT cookie)"| GW
    GW -->|"gRPC GetOrder(orderId)"| OS
    OS -->|"resolve shard + findUnique"| SH
    OS -->|"404 if not found"| GW
    GW -->|"HTTP 404 / order payload"| FE
    FE -->|"recent orders"| AG
```

## 🔄 Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Track Order Page
    participant GW as API Gateway
    participant OS as Order Service
    participant SH as Order Shard (Postgres)

    U->>FE: Opens /track/:orderId (or Account → Orders)
    FE->>GW: GET /api/v1/orders/:id
    Note over GW: JwtAuthGuard validates httpOnly access_token
    GW->>OS: gRPC GetOrder(orderId)
    OS->>SH: findUnique(id) + include items

    alt Order Exists
        SH-->>OS: Order row + items
        OS-->>GW: gRPC response (status, total, address, items)
        GW-->>FE: 200 Order payload
        FE->>U: Render status timeline + shipping info
    else Order Missing
        SH-->>OS: No row
        OS-->>GW: gRPC NOT_FOUND (code 5)
        GW-->>FE: HTTP 404 "Order not found"
        FE->>U: Friendly empty state (no ghost order)
    end
```

## 🐛 Why No "Ghost Orders"?

The `GetOrder` gRPC handler **throws** `RpcException({ code: 5, message: 'Order <id> not found' })` when the id does not exist. The API Gateway maps gRPC code `5` (NOT_FOUND) to **HTTP 404**, and the storefront renders a clean "Order not found" empty state instead of a fabricated blank order.

| Old behavior (bug)        | New behavior (fixed)                                  |
| :------------------------ | :---------------------------------------------------- |
| Returned empty order object → misleading UI | Throws gRPC `NOT_FOUND` → HTTP 404 → clear empty state |

## 🔗 Related

- **[Account page](../../apps/web-shop/README.md)**: order history, addresses, saved cards, recently viewed.
- **[Checkout Flow](./checkout-flow.md)**: how orders are created.

---

[🔗 View Checkout Flow](./checkout-flow.md) | [🔗 View Catalog Browsing Flow](./catalog-browsing-flow.md) | [⬅️ Back to Flows Index](./README.md)
