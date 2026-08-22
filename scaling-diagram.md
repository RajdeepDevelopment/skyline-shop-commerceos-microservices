# Scaling Architecture Diagram (Mermaid)

```mermaid
graph TB
    %% Layers
    subgraph Edge["Edge Layer"]
        LB[Nginx Load Balancer]
        GW[API Gateway]
    end

    subgraph Services["Microservices Layer"]
        AUTH[Auth Service]
        USER[User Service]
        PROD[Product Service]
        CART[Cart Service]
        ORDER[Order Service]
        INV[Inventory Service]
        PAY[Payment Service]
        NOTIF[Notification Service]
        ANALYTICS[Analytics Service]
    end

    subgraph Data["Data & Event Plane"]
        PG["PostgreSQL (Sharded)"]
        ES["Elasticsearch"]
        REDIS[Redis]
        NATS[NATS JetStream]
        CH[ClickHouse]
    end

    subgraph Observability["Observability Layer"]
        OTel[OpenTelemetry Collector]
        PROM[Prometheus]
        GRAF[Grafana]
        JAEG[Jaeger]
    end

    %% Connections
    CLI[Web / Mobile / Admin] -->|HTTPS| LB
    LB -->|gRPC| GW
    GW -->|gRPC| AUTH
    GW -->|gRPC| PROD
    GW -->|gRPC| CART
    GW -->|gRPC| ORDER
    AUTH -->|DB| PG
    PROD -->|DB| PG
    ORDER -->|DB| PG
    CART -->|Redis| REDIS
    ORDER -->|NATS| NATS
    INV -->|NATS| NATS
    PAY -->|NATS| NATS
    NOTIF -->|NATS| NATS
    ANALYTICS -->|NATS| NATS
    PROD -->|Index| ES
    ANALYTICS -->|Write| CH
    AUTH -->|Metrics| OTel
    PROD -->|Metrics| OTel
    ORDER -->|Metrics| OTel
    NATS -->|Metrics| OTel
    OTel -->|Metrics| PROM
    PROM -->|Dashboards| GRAF
    OTel -->|Traces| JAEG

    %% Sharding & Replication
    PG -->|Primary| PG_PRI
    PG -->|Replica| PG_REP
    subgraph PG["PostgreSQL Shards"]
        PGB1[Shard 1]
        PGB2[Shard 2]
        PGB3[Shard 3]
        PGB4[Shard 4]
    end
    PG_PRI -.-> PGB1
    PG_PRI -.-> PGB2
    PG_PRI -.-> PGB3
    PG_PRI -.-> PGB4
    PG_REP -.-> PGB1
    PG_REP -.-> PGB2
    PG_REP -.-> PGB3
    PG_REP -.-> PGB4

    %% Scaling Indicators
    classDef scalable fill:#e6fffa,stroke:#333,stroke-width:2px;
    AUTH,PROD,CART,ORDER,INV,PAY,ANALYTICS:::scalable
    REDIS:::scalable
    ES:::scalable
    NATS:::scalable
```

**Key Takeaways from the Diagram**

- **Edge → Load Balancer → API Gateway**: Single entry point that distributes traffic across all service replicas.
- **Microservices**: Each service (Auth, Product, Order, etc.) is **stateless** and can be independently scaled via Kubernetes HPA or Docker‑Compose replica scaling.
- **Data & Event Plane**:
  - **PostgreSQL** is sharded (4 shards for Orders, 4 for Products) with **PgBouncer** pools for read/write separation.
  - **Redis** provides ultra‑fast cache for carts, sessions, and locks.
  - **NATS JetStream** acts as the durable event bus for the Saga pattern.
  - **Elasticsearch** handles search and recommendation workloads.
  - **ClickHouse** stores analytics events.
- **Observability**: OpenTelemetry collects metrics/traces, feeding Prometheus (metrics) and Grafana (dashboards) and Jaeger (traces) for proactive scaling decisions.

This diagram captures the core components and data flow that enable the platform to target **10 M+ users**, **1 M+ products**, and **tens of thousands of concurrent sessions** while maintaining sub‑second latency.
