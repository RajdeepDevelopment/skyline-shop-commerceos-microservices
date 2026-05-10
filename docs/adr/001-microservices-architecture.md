# ADR 001: Distributed Microservices Architecture

## Status

Accepted

## Context

We are building a highly scalable eCommerce platform. The system needs to handle massive spikes in traffic (e.g., during sales), support rapid independent deployments, and allow different teams to work on separate domains (Auth, Orders, Inventory, etc.) without stepping on each other's toes.

## Decision

We will adopt a Distributed Microservices Architecture using NestJS and TypeScript.

- **Monorepo Strategy:** We will use `pnpm` workspaces with NestJS monorepo capabilities to share libraries (common types, DTOs, gRPC protobufs, etc.) while keeping service deployments isolated.
- **Communication:**
  - **Synchronous:** gRPC will be used for internal high-throughput service-to-service communication where immediate response is required (e.g., Auth verification).
  - **Asynchronous:** NATS JetStream and BullMQ will be used for event-driven workflows (e.g., Order Created event triggering Inventory decrement and Payment processing) and background jobs.
- **API Gateway:** A central API Gateway pattern will expose external REST/GraphQL APIs and route them to internal gRPC/HTTP services. Nginx will sit in front of the API Gateway as a reverse proxy and load balancer.

## Consequences

**Positive:**

- Independent scaling of specific services (e.g., scale out Inventory during a sale).
- Technology flexibility (while mostly TS, specific services can be optimized).
- Clear domain boundaries (DDD).

**Negative:**

- Increased operational complexity (requires Docker, Kubernetes/Nomad, service mesh, robust CI/CD).
- Difficult distributed transactions (necessitates Saga patterns or 2PC, we will use Saga with NATS).
- Network overhead compared to a monolith.
