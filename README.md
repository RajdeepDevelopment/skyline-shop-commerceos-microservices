<div align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="NestJS Logo" />
  <h1>ðŸš€ E-Commerce Microservices Platform</h1>
  <p><b>A production-grade, high-scale distributed systems reference architecture.</b></p>

[![NestJS](https://img.shields.io/badge/Framework-NestJS-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![NATS](https://img.shields.io/badge/Messaging-NATS-27AAE1?style=for-the-badge&logo=nats.io)](https://nats.io/)
[![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Infrastructure-Docker-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

</div>

---

## ðŸ”­ Project Vision

This platform is an elite-level implementation of a modern e-commerce backend, designed for **high availability**, **massive scalability**, and **zero-trust security**. It serves as a blueprint for Staff+ engineers to demonstrate distributed systems patterns used at companies like Stripe, Uber, and Netflix.

### ðŸŽ¯ What You'll Learn

- **Distributed Systems**: Service discovery, load balancing, and gRPC orchestration.
- **Data Scaling**: Multi-node database sharding and read-replica strategies.
- **Event-Driven Design**: Asynchronous choreography using NATS JetStream.
- **Resiliency Engineering**: Circuit breakers, exponential backoff, and dead-letter queues.
- **Security Architecture**: PGP payload signing, Argon2 hashing, and RBAC.

---

## ðŸ—ºï¸ Documentation Portal

| Layer                     | Focus                      | Links                                                                                                                                                                                            |
| :------------------------ | :------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ðŸ—ï¸ Architecture**    | System design & principles | [Deep Dive](./docs/architecture/system-design-deep-dive.md) â€¢ [Overview](./docs/architecture/system-overview.md) â€¢ [CQRS](./docs/architecture/cqrs-pattern.md)                               |
| **ðŸ›¡ï¸ Reliability**    | Scaling & Resiliency       | [Scaling & Sharding](./docs/infrastructure/scaling-and-sharding.md) â€¢ [Resiliency Patterns](./docs/architecture/resiliency-patterns.md) â€¢ [Testing](./docs/architecture/testing-strategy.md) |
| **ðŸ” Security**          | Protection & Identity      | [Security Architecture](./docs/architecture/security-architecture.md) â€¢ [Auth Flow](./docs/flows/authentication-flow.md) â€¢ [Security Policy](./SECURITY.md)                                  |
| **ðŸ§© Services**         | Domain Implementation      | [API Gateway](./apps/api-gateway/README.md) â€¢ [Order Service](./apps/order-service/README.md) â€¢ [Full Catalog](./docs/services/README.md)                                                    |
| **ðŸ“ˆ Observability**    | Metrics & Monitoring       | [Monitoring Strategy](./docs/infrastructure/observability.md) â€¢ [Glossary](./GLOSSARY.md)                                                                                                      |
| **ðŸ› ï¸ Infrastructure** | Tooling & DevOps           | [Docker Setup](./docs/infrastructure/docker-setup.md) â€¢ [Nginx Proxy](./docs/infrastructure/nginx.md) â€¢ [Roadmap](./ROADMAP.md)                                                              |

---

## ðŸ—ï¸ System Reference Architecture

```mermaid
graph TD
    subgraph "Edge Layer"
        LB[Nginx Load Balancer]
        GW[API Gateway]
    end

    subgraph "Core Domain Services"
        Auth[Auth Service]
        Products[Product Service]
        Orders[Order Service]
        Users[User Service]
    end

    subgraph "Support & Fulfillment"
        Inv[Inventory Service]
        Pay[Payment Service]
        Notif[Notification Service]
        Analytics[Analytics Service]
    end

    subgraph "Data & Event Plane"
        NATS((NATS JetStream))
        Redis[(Redis Cache)]
        PG[(PostgreSQL Shards)]
    end

    Client[Web/Mobile] --> LB
    LB --> GW
    GW --> Auth
    GW --> Core

    Core --> NATS
    NATS --> Support

    Products --> Redis
    Orders --> PG
    Products --> PG
```

---

## ðŸ›¸ Engineering Roadmap

Propel your skills through our context-driven learning trajectory:

1.  **[ðŸŒ‘ Phase 1: Foundations](./docs/learning-path/beginner.md)**: Monorepo patterns, Domain Isolation, and NestJS Modules.
2.  **[ðŸš€ Phase 2: Distributed Systems](./docs/learning-path/intermediate.md)**: gRPC, NATS Pub/Sub, and API Gateway orchestration.
3.  **[ðŸŒŒ Phase 3: High Scale & Resilience](./docs/learning-path/advanced.md)**: CQRS, Database Sharding, and Circuit Breakers.
4.  **[ðŸ”­ Phase 4: Platform Engineering](./docs/learning-path/engineering-roadmap.md)**: Infrastructure as Code, Monitoring, and Zero-Trust Security.

---

## ðŸ› ï¸ Technology Matrix

| Category          | Technology           | Decision Rationale                                                  |
| :---------------- | :------------------- | :------------------------------------------------------------------ |
| **Runtime**       | NestJS (Node.js)     | Enterprise-grade modularity and dependency injection.               |
| **Database**      | PostgreSQL + Prisma  | Strong consistency with type-safe, performance-optimized queries.   |
| **Messaging**     | NATS JetStream       | Ultra-low latency, persistent event-store for asynchronous flows.   |
| **In-Memory**     | Redis                | sub-millisecond data access for carts, sessions, and rate-limiting. |
| **RPC**           | gRPC                 | High-speed binary protocol for synchronous internal communication.  |
| **Observability** | Prometheus / Grafana | Real-time telemetry and health visualization.                       |

---

## âš¡ Production-Grade Features

- âœ… **Database Sharding**: Key-based horizontal partitioning for massive product catalogs.
- âœ… **Idempotency**: Guaranteed single execution for sensitive operations (Payments/Orders).
- âœ… **Distributed Caching**: Multi-level caching strategy (Redis + In-memory).
- âœ… **Event Sourcing (Lite)**: Persistent event streams in NATS for analytics and auditing.
- âœ… **Zero-Trust Security**: PGP signed payloads for internal service-to-service communication.

---

## ðŸš€ Rapid Onboarding

### 1. Prerequisites

- **Node.js** v24+ â€¢ **pnpm** v9+
- **Docker** & **Docker Compose**

### 2. Automated Bootstrap

```bash
chmod +x setup.sh
./setup.sh
```

---

## ðŸ“œ Architectural Decisions (ADR)

We document the **WHY** behind every major architectural choice to maintain engineering context.

- [001: Microservices vs Monolith](./docs/adr/001-microservices-architecture.md)
- [002: Scaling and Sharding](./docs/adr/002-scaling-and-sharding.md)
- [Explore All ADRs](./docs/adr/README.md)

---

## ðŸ“„ Repository Standards

- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Engineering standards and PR workflow.
- **[SECURITY.md](./SECURITY.md)**: Security policy and vulnerability reporting.
- **[CODEOWNERS](./CODEOWNERS)**: Service ownership and review hierarchy.

---

<div align="center">
  MIT License â€¢ 2026 Production-Grade Engineering Hub
</div>
