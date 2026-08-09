# 📚 Shared Libraries

To ensure consistency and DRY (Don't Repeat Yourself) principles, common logic is abstracted into shared libraries.

## 🧩 Who Uses What

```mermaid
graph TB
    subgraph LIBS[Shared Libraries]
        COMMON[common]
        DATABASE[database]
        MESSAGING[messaging]
        GRPC[grpc]
        AUTH[auth]
    end

    subgraph SVCS[Services]
        API[API Gateway]
        AUTH_S[auth]
        CART[cart]
        PRODUCT[product]
        ORDER[order]
        INVENTORY[inventory]
        PAYMENT[payment]
        ANALYTICS[analytics]
        AVAILABILITY[availability]
        NOTIFICATION[notification]
    end

    COMMON -->|types, decorators, observability| API
    COMMON --> AUTH_S
    COMMON --> CART
    COMMON --> PRODUCT
    COMMON --> ORDER
    COMMON --> INVENTORY
    COMMON --> PAYMENT
    COMMON --> ANALYTICS
    COMMON --> AVAILABILITY
    COMMON --> NOTIFICATION

    DATABASE -->|Prisma + repositories| AUTH_S
    DATABASE --> CART
    DATABASE --> PRODUCT
    DATABASE --> ORDER
    DATABASE --> INVENTORY
    DATABASE --> PAYMENT
    DATABASE --> ANALYTICS
    DATABASE --> AVAILABILITY

    MESSAGING -->|NATS / gRPC event bus| API
    MESSAGING --> ORDER
    MESSAGING --> INVENTORY
    MESSAGING --> PAYMENT
    MESSAGING --> AVAILABILITY

    GRPC -->|proto clients| API
    GRPC --> AUTH_S
    GRPC --> PRODUCT
    GRPC --> ORDER

    AUTH --> API
```

## 🛠️ Library List

- **[Common Lib](./common-lib.md)** - Shared types, decorators, and utilities.
- **[Database Lib](./database-lib.md)** - Prisma abstractions and repository patterns.
- **[Messaging Lib](./messaging-lib.md)** - NATS and gRPC communication abstractions.

> The remaining libraries (`auth`, `cache`, `monitoring`, `security`, `testing`, ...) follow the same patterns and are documented within their `libs/<name>/README.md` and the service docs they support.

---

[⬅️ Back to Home](../../README.md)
