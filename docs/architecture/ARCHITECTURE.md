# Skyline Commerce — Production Architecture

## Overview

Distributed e-commerce microservices platform designed for 10M+ users with
horizontal scaling, zero-downtime deployments, fault tolerance, and multi-region readiness.

---

## Architecture Diagram

```mermaid
graph TB
    subgraph "Client Layer"
        WebApp["Web App<br/>(React + Vite)"]
        MobileApp["Mobile App"]
    end

    subgraph "Edge Layer"
        CloudLB["Cloud Load Balancer<br/>(TLS Termination, WAF)"]
        NginxGW["Nginx / Envoy<br/>(Rate Limiting, Request Validation)"]
    end

    subgraph "API Gateway Cluster"
        GW1["API Gateway Pod 1"]
        GW2["API Gateway Pod 2"]
        GW3["API Gateway Pod 3"]
    end

    subgraph "Service Mesh (Istio / Linkerd)"
        subgraph "Auth Service"
            A1["Auth Pod 1"]
            A2["Auth Pod 2"]
        end

        subgraph "Product Service"
            P1["Product Pod 1<br/>Write"]
            P2["Product Pod 2<br/>Write"]
            P3["Product Pod 3<br/>Read"]
        end

        subgraph "Cart Service"
            C1["Cart Pod 1"]
            C2["Cart Pod 2"]
        end

        subgraph "Order Service"
            O1["Order Pod 1<br/>Command"]
            O2["Order Pod 2<br/>Command"]
            O3["Order Pod 3<br/>Read"]
        end

        subgraph "Inventory Service"
            I1["Inventory Pod 1"]
            I2["Inventory Pod 2"]
        end

        subgraph "Payment Service"
            PY1["Payment Pod 1"]
            PY2["Payment Pod 2"]
        end

        subgraph "Notification Service"
            N1["Notification Pod 1"]
        end
    end

    subgraph "Event Streaming Layer"
        NATS["NATS JetStream<br/>(3-node cluster)<br/>Business Events Only"]
        BullMQ["BullMQ<br/>(Redis-backed)<br/>Background Jobs Only"]
    end

    subgraph "Data Layer"
        subgraph "PostgreSQL Cluster"
            PGW1["PG Auth Primary<br/>(Write)"]
            PGW2["PG Order Primary<br/>(Write)"]
            PGW3["PG Product Primary<br/>(Write)"]
            PGR1["PG Auth Replica<br/>(Read)"]
            PGR2["PG Order Replica<br/>(Read)"]
            PGR3["PG Product Replica<br/>(Read)"]
            PgBouncer["PgBouncer<br/>(Connection Pool)"]
        end

        subgraph "Redis Cluster"
            R1["Redis Shard 1<br/>(Cache + Sessions)"]
            R2["Redis Shard 2<br/>(BullMQ Backend)"]
            R3["Redis Shard 3<br/>(Distributed Locks)"]
        end
    end

    subgraph "Saga Orchestrator"
        SagaOrch["Order Saga<br/>Orchestrator"]
    end

    subgraph "Outbox Publisher"
        OutboxPub["Outbox Background<br/>Publisher"]
    end

    subgraph "Observability Stack"
        OTel["OpenTelemetry<br/>Collector"]
        Jaeger["Jaeger<br/>(Distributed Tracing)"]
        Prometheus["Prometheus<br/>(Metrics)"]
        Grafana["Grafana<br/>(Dashboards)"]
        AlertMgr["AlertManager<br/>(PagerDuty/Slack)"]
        ELK["ELK Stack<br/>(Structured Logs)"]
    end

    subgraph "CI/CD Pipeline"
        GHActions["GitHub Actions<br/>(Build + Test)"]
        ArgoCD["ArgoCD<br/>(GitOps Deploy)"]
        Harbor["Harbor<br/>(Container Registry)"]
    end

    subgraph "Kubernetes Cluster"
        HPA["HPA<br/>(Auto-scaling)"]
        PDB["PDB<br/>(Disruption Budget)"]
        SecretMgr["External Secrets<br/>(Vault/AWS SM)"]
    end

    WebApp --> CloudLB
    MobileApp --> CloudLB
    CloudLB --> NginxGW
    NginxGW --> GW1 & GW2 & GW3

    GW1 & GW2 & GW3 -->|"gRPC + HTTP"| A1 & A2
    GW1 & GW2 & GW3 -->|"gRPC + HTTP"| P1 & P2 & P3
    GW1 & GW2 & GW3 -->|"gRPC + HTTP"| C1 & C2
    GW1 & GW2 & GW3 -->|"gRPC + HTTP"| O1 & O2 & O3

    O1 & O2 -->|"gRPC"| I1 & I2
    O1 & O2 -->|"gRPC"| PY1 & PY2

    O1 & O2 -->|"Publish events"| NATS
    NATS -->|"order.created"| SagaOrch
    SagaOrch -->|"reserve inventory"| I1 & I2
    SagaOrch -->|"process payment"| PY1 & PY2
    SagaOrch -->|"send notification"| BullMQ

    I1 & I2 -->|"Publish"| NATS
    PY1 & PY2 -->|"Publish"| NATS

    P1 & P2 & P3 -->|"Cache-Aside"| R1
    O1 & O2 & O3 -->|"Read/Write"| PgBouncer
    A1 & A2 -->|"Read/Write"| PgBouncer
    I1 & I2 -->|"SELECT FOR UPDATE"| PgBouncer
    PgBouncer --> PGW1 & PGW2 & PGW3
    PGW1 --> PGR1
    PGW2 --> PGR2
    PGW3 --> PGR3

    P1 & P2 & P3 & O1 & O2 & O3 & A1 & A2 & I1 & I2 & PY1 & PY2 --> OTel
    OTel --> Jaeger
    OTel --> Prometheus
    Prometheus --> Grafana
    Prometheus --> AlertMgr
    P1 & P2 & P3 & O1 & O2 & O3 --> ELK

    GHActions --> Harbor
    ArgoCD --> K8s
```

---

## Data Flow — Order Saga

```mermaid
sequenceDiagram
    participant Client
    participant Gateway as API Gateway
    participant Order as Order Service
    participant Outbox as Outbox Table
    participant NATS as NATS JetStream
    participant Saga as Saga Orchestrator
    participant Inventory as Inventory Service
    participant Payment as Payment Service
    participant Notification as Notification Service
    participant BullMQ as BullMQ Workers

    Client->>Gateway: POST /api/v1/orders (Idempotency-Key)
    Gateway->>Order: CreateOrder (gRPC)
    Order->>Order: Validate + Persist Order (PENDING)
    Order->>Outbox: Write outbox record (same transaction)
    Order-->>Gateway: Order Created (orderId)

    Outbox->>NATS: Publish order.created (background)
    NATS->>Saga: Subscribe order.created

    Saga->>Inventory: Reserve Stock (gRPC)
    alt Stock Available
        Inventory-->>Saga: Reserved OK
        Saga->>Payment: Process Payment (gRPC)
        alt Payment Success
            Payment-->>Saga: Payment Confirmed
            Saga->>Order: Update Status → CONFIRMED
            Saga->>NATS: Publish order.confirmed
            NATS->>BullMQ: Send notification job
            BullMQ->>Notification: Send confirmation email
        else Payment Failed
            Payment-->>Saga: Payment Failed
            Saga->>Inventory: Release Stock (compensate)
            Saga->>Order: Update Status → CANCELLED
            Saga->>NATS: Publish order.cancelled
        end
    else Out of Stock
        Inventory-->>Saga: Stock Unavailable
        Saga->>Order: Update Status → CANCELLED
        Saga->>NATS: Publish order.cancelled
    end
```

---

## CQRS Pattern

```mermaid
graph LR
    subgraph "Write Side (Commands)"
        CMD["Command Bus"]
        CMD -->|"CreateOrder"| WriteDB[(PostgreSQL Primary)]
        CMD -->|"ReserveInventory"| WriteDB
        CMD -->|"ProcessPayment"| WriteDB
    end

    subgraph "Event Store"
        OutboxTBL[(Outbox Table)]
        WriteDB -->|"Same Tx"| OutboxTBL
        OutboxTBL -->|"CDC / Polling"| EventBus[NATS JetStream]
    end

    subgraph "Read Side (Queries)"
        EventBus -->|"Project"| ReadDB[(PostgreSQL Read Replica)]
        EventBus -->|"Cache Invalidation"| RedisCache[(Redis Cache)]
        QueryAPI["Query API"]
        QueryAPI -->|"Read"| ReadDB
        QueryAPI -->|"Read"| RedisCache
    end
```

---

## Service Mesh Topology

```mermaid
graph LR
    subgraph "Istio / Linkerd Sidecar"
        direction TB
        Client --> EnvoyGW["Envoy Sidecar<br/>(Gateway)"]
        EnvoyGW -->|"mTLS"| EnvoyAuth["Envoy Sidecar<br/>(Auth Service)"]
        EnvoyGW -->|"mTLS"| EnvoyProduct["Envoy Sidecar<br/>(Product Service)"]
        EnvoyGW -->|"mTLS"| EnvoyOrder["Envoy Sidecar<br/>(Order Service)"]
    end

    subgraph "Mesh Policies"
        Retry["Retry Policy<br/>(3x, exponential)"]
        Timeout["Timeout<br/>(5s default)"]
        CB["Circuit Breaker<br/>(5 errors → open)"]
        RateLimit["Rate Limiting<br/>(1000 req/s per pod)"]
        TrafficSplit["Traffic Split<br/>(Canary 10% → 100%)"]
    end
```

---

## Kubernetes Deployment

```mermaid
graph TB
    subgraph "Namespace: ecommerce"
        subgraph "Deployments"
            APIGW["api-gateway<br/>replicas: 3<br/>HPA: 3-10"]
            AuthSvc["auth-service<br/>replicas: 2<br/>HPA: 2-6"]
            ProductSvc["product-service<br/>replicas: 3<br/>HPA: 3-12"]
            CartSvc["cart-service<br/>replicas: 2<br/>HPA: 2-8"]
            OrderSvc["order-service<br/>replicas: 3<br/>HPA: 3-10"]
            InvSvc["inventory-service<br/>replicas: 2<br/>HPA: 2-6"]
            PaySvc["payment-service<br/>replicas: 2<br/>HPA: 2-6"]
            NotifSvc["notification-service<br/>replicas: 2<br/>HPA: 2-4"]
        end

        subgraph "StatefulSets"
            PGAuth["auth-db<br/>Primary + Replica"]
            PGOrder["order-db<br/>Primary + Replica"]
            PGProduct["product-db<br/>Primary + 2 Replicas"]
            RedisCluster["Redis Cluster<br/>6 nodes (3M + 3R)"]
            NATSCluster["NATS Cluster<br/>3 nodes"]
        end

        subgraph "Jobs"
            Migration["db-migration<br/>(pre-deploy hook)"]
            Seeder["db-seeder<br/>(on-demand)"]
        end
    end
```

---

## Component Legend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Edge | Cloud LB + Nginx/Envoy | TLS, WAF, rate limiting, request validation |
| Gateway | NestJS API Gateway | Auth, routing, API versioning, Swagger |
| Mesh | Istio/Linkerd | mTLS, retries, timeouts, circuit breakers, traffic splitting |
| Sync | gRPC | Inter-service synchronous communication |
| Async | NATS JetStream | Business event streaming (order.created, payment.success) |
| Jobs | BullMQ | Background tasks (emails, invoices, analytics) |
| Cache | Redis Cluster | Sessions, read cache, distributed locks |
| DB | PostgreSQL + PgBouncer | ACID transactions, read replicas, connection pooling |
| Tracing | OpenTelemetry + Jaeger | Distributed tracing across all services |
| Metrics | Prometheus + Grafana + AlertManager | SLIs, SLOs, error budgets, alerting |
| Logs | ELK Stack | Centralized structured logging |
| CI/CD | GitHub Actions + ArgoCD | Build, test, GitOps deploy, canary releases |
| Secrets | External Secrets Operator | Vault / AWS Secrets Manager integration |
