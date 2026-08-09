# 🧩 Service Catalog

Each service in this platform is a self-contained domain with its own responsibilities, data, and logic — designed to scale to **10M+ users**.

## 🗺️ System Overview

```mermaid
graph TB
    subgraph Clients
        WEB[Web Shop React]
        MOBILE[Mobile App]
        THIRD[Third-party Apps]
    end
    GW[API Gateway]
    subgraph Microservices
        AUTH[Auth Service]
        USER[User Service]
        PRODUCT[Product Service]
        INVENTORY[Inventory Service]
        CART[Cart Service]
        ORDER[Order Service]
        PAYMENT[Payment Service]
        AVAIL[Availability Service]
        NOTIFY[Notification Service]
        ANALYTICS[Analytics Service]
    end
    subgraph Data & Events
        PG[(PostgreSQL Shards)]
        RD[(Redis)]
        ES[(Elasticsearch)]
        CH[(ClickHouse)]
        NATS[(NATS JetStream)]
    end

    WEB --> GW
    MOBILE --> GW
    THIRD --> GW
    GW --> AUTH
    GW --> USER
    GW --> PRODUCT
    GW --> INVENTORY
    GW --> CART
    GW --> ORDER
    GW --> PAYMENT
    GW --> AVAIL
    GW --> NOTIFY
    GW --> ANALYTICS
    PRODUCT --> ES
    CART --> RD
    PAYMENT --> RD
    ORDER --> PG
    ANALYTICS --> CH
    ORDER -. events .-> NATS
    NOTIFY -. consumes .-> NATS
```

## 🚀 Core Services

- **[Web Shop (React Storefront)](../../apps/web-shop/README.md)** - The React 19 storefront: catalog, cart, checkout, account.
- **[API Gateway](../../apps/api-gateway/README.md)** - The central entry point and reverse proxy (`/api/v1/*`).
- **[Auth Service](../../apps/auth-service/README.md)** - Identity management and authentication.
- **[User Service](../../apps/user-service/README.md)** - User profile and preferences management.
- **[Product Service](../../apps/product-service/README.md)** - Product catalog, Elasticsearch search & recommendations.
- **[Inventory Service](../../apps/inventory-service/README.md)** - Real-time stock tracking and reservations.
- **[Cart Service](../../apps/cart-service/README.md)** - Shopping cart management (Redis-backed).
- **[Order Service](../../apps/order-service/README.md)** - Order lifecycle, saga orchestration, and tracking.
- **[Payment Service](../../apps/payment-service/README.md)** - Financial transactions and gateway integration.
- **[Availability Service](../../apps/availability-service/README.md)** - Pincode-level delivery SLA checks.
- **[Analytics Service](../../apps/analytics-service/README.md)** - Event tracking and business intelligence (ClickHouse).
- **[Notification Service](../../apps/notification-service/README.md)** - Multi-channel alerts (Email, SMS, Push).

## 🖼️ Storefront

| **Home / Banner**                  | **Product Details**                               | **Cart**                    | **Order Tracking**                            |
| :--------------------------------- | :------------------------------------------------ | :-------------------------- | :-------------------------------------------- |
| ![Home](../images/home-banner.png) | ![Product Details](../images/product-details.png) | ![Cart](../images/cart.png) | ![Order Details](../images/order-details.png) |

---

[⬅️ Back to Home](../../README.md)
