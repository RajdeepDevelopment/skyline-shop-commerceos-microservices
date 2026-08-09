# 🚪 API Gateway

The **API Gateway** is the single entry point for all external traffic (Web, Mobile, Third-party) into the Skyline Shop ecosystem. It serves as an intelligent proxy and orchestrator.

## 🗺️ Request Flow

```mermaid
graph LR
    subgraph External
        WEB[Web / Mobile / Third-party]
    end
    subgraph Edge Security
        JWT[JWT Validation]
        RL[Rate Limiting]
        PGP[PGP Signing]
    end
    GW[API Gateway]
    subgraph Internal
        AUTH[Auth Service]
        PRODUCT[Product Service]
        ORDER[Order Service]
    end

    WEB --> JWT --> RL --> PGP --> GW
    GW -- gRPC --> AUTH
    GW -- gRPC --> PRODUCT
    GW -- gRPC --> ORDER
```

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Communication**: REST (External) / gRPC (Internal)
- **Security**: JWT Validation, Rate Limiting, PGP Payload Signing

## 📋 Responsibilities

1. **Request Orchestration**: Aggregating data from multiple microservices into a single response.
2. **Edge Security**: Validating authentication tokens before forwarding requests.
3. **Load Balancing**: Distributing traffic to healthy service instances.
4. **API Versioning**: Managing lifecycle of public endpoints.

## 🔗 Internal Dependencies

- **[Auth Service](./auth-service.md)**: For session and identity validation.
- **[Order Service](./order-service.md)**: For checkout and history.
- **[Product Service](./product-service.md)**: For catalog browsing.

---

[⬅️ Back to Services Index](./README.md)
