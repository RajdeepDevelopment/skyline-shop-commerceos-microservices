# ðŸ—ï¸ Infrastructure Architecture

This section documents the foundational components that power the E-Commerce Microservices Platform.

## ðŸ“– Key Components

- **[Docker Setup](./docker-setup.md)** - Containerization and orchestration strategy.
- **[Nginx Reverse Proxy](./nginx.md)** - Ingress management and load balancing.
- **[NATS Messaging](./nats.md)** - High-performance event-driven communication.
- **[PostgreSQL](./postgres.md)** - Relational data persistence with Prisma.
- **[Redis](./redis.md)** - Distributed caching and session management.
- **[Scaling & Sharding](./scaling-and-sharding.md)** - Horizontal database partitioning and read/write splitting.
- **[Scripts & Tooling](./scripts-and-tooling.md)** - PGP key generation, database seeding, and setup automation.
- **[Observability](./observability.md)** - Prometheus, Grafana, and structured logging.

---

## ðŸŒŠ Infrastructure Flow

The following diagram illustrates how infrastructure components interact to handle a client request:

```mermaid
graph TD
    Client[Web/Mobile Client] --> Nginx[Nginx Reverse Proxy]
    Nginx --> Gateway[API Gateway]

    subgraph "Service Mesh"
        Gateway --> Auth[Auth Service]
        Gateway --> Services[Domain Services]
    end

    subgraph "Data & Event Plane"
        Services --> Redis[(Redis Cache)]
        Services --> DB[(PostgreSQL DB)]
        Services --> NATS((NATS JetStream))
    end

    subgraph "Monitoring"
        Prom[Prometheus] --> Nginx
        Prom --> Services
        Prom --> DB
    end
```

---

[â¬…ï¸ Back to Home](../../README.md)
