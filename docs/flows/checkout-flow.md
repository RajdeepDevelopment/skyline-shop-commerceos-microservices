# 🌊 Checkout Flow

The checkout flow is a critical multi-service orchestration that transforms a shopping cart into a confirmed order.

## 🔄 Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant G as API Gateway
    participant C as Cart Service
    participant O as Order Service
    participant P as Payment Service
    participant I as Inventory Service
    participant N as Notification Service

    U->>G: POST /checkout
    G->>C: Validate & Fetch Cart
    C-->>G: Cart Items (Product IDs, Qty)

    G->>O: Create Initial Order (Status: PENDING)
    O->>I: Reserve Inventory (gRPC)

    alt Inventory Available
        I-->>O: Inventory Reserved
        O->>P: Initiate Payment

        alt Payment Success
            P-->>O: Payment Confirmed
            O->>O: Update Order (Status: CONFIRMED)
            O->>N: Emit Order.Created Event (NATS)
            N-->>U: Send Email Confirmation
        else Payment Failed
            P-->>O: Payment Declined
            O->>O: Update Order (Status: FAILED)
            O->>I: Release Inventory
        end

    else Inventory Unavailable
        I-->>O: Insufficient Stock
        O->>O: Update Order (Status: REJECTED)
        G-->>U: Error: Out of Stock
    end
```

## 🛠️ Services Involved

1.  **[API Gateway](../services/api-gateway.md)**: Entry point and orchestrator.
2.  **[Cart Service](../services/cart-service.md)**: Provides the source of truth for items being purchased.
3.  **[Order Service](../services/order-service.md)**: Manages the lifecycle and state transitions.
4.  **[Inventory Service](../services/inventory-service.md)**: Handles synchronous stock reservations.
5.  **[Payment Service](../services/payment-service.md)**: Processes financial transactions.
6.  **[Notification Service](../services/notification-service.md)**: Sends asynchronous confirmations.

---

[🔗 View Order Processing Flow](./order-processing-flow.md) | [⬅️ Back to Flows Index](./README.md)
