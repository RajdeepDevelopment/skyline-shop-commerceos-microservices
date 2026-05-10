# ðŸ“ˆ Observability & Monitoring Strategy

The E-Commerce Microservices Platform implements a comprehensive observability stack based on the **Three Pillars of Observability**: Metrics, Logging, and Tracing.

<div align="center">
  [![Stack: Prometheus](https://img.shields.io/badge/Stack-Prometheus-E6522C?style=flat-square&logo=prometheus)](#)
  [![Stack: Grafana](https://img.shields.io/badge/Stack-Grafana-F46800?style=flat-square&logo=grafana)](#)
  [![Stack: Winston](https://img.shields.io/badge/Stack-Winston-gray?style=flat-square)](#)
</div>

---

## ðŸ“Š 1. Metrics (Prometheus & Grafana)

We collect real-time telemetry from all microservices to monitor system health and performance.

### Key Performance Indicators (KPIs)

| Metric Type    | Example                         | Purpose                                              |
| :------------- | :------------------------------ | :--------------------------------------------------- |
| **Throughput** | `http_requests_total`           | Monitor traffic volume across the API Gateway.       |
| **Latency**    | `http_request_duration_seconds` | Track P95/P99 response times for critical endpoints. |
| **Errors**     | `http_request_errors_total`     | Alert on spikes in 5xx status codes.                 |
| **Resources**  | `process_cpu_seconds_total`     | Monitor container resource saturation.               |

### Metrics Collection Flow

```mermaid
graph LR
    subgraph "Microservices"
        S1[Auth]
        S2[Order]
        S3[Product]
    end

    S1 -- "/metrics" --> P[Prometheus]
    S2 -- "/metrics" --> P
    S3 -- "/metrics" --> P

    P --> G[Grafana Dashboards]
    G --> A[Alert Manager]
```

---

## ðŸ“ 2. Structured Logging

We use a unified logging strategy across all services to enable efficient debugging and log aggregation.

### Logging Standards

- **Format**: Structured JSON for machine readability.
- **Correlation IDs**: Every request is assigned a `x-correlation-id` at the API Gateway, which is propagated across all downstream services.
- **Context**: Every log entry includes `service_name`, `timestamp`, `level`, and `correlation_id`.

### Example Log Entry

```json
{
  "level": "info",
  "message": "Order created successfully",
  "service": "order-service",
  "correlation_id": "a1b2c3d4-e5f6-g7h8",
  "order_id": "ORD-12345",
  "timestamp": "2026-05-10T12:00:00Z"
}
```

---

## ðŸ” 3. Distributed Tracing (Roadmap)

To visualize request lifecycles across service boundaries, we are integrating **OpenTelemetry** with **Jaeger**.

### Target Tracing Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway
    participant O as Order Service
    participant I as Inventory Service
    participant N as NATS

    C->>G: POST /checkout (Start Span)
    G->>O: gRPC: CreateOrder (Child Span)
    O->>I: gRPC: ReserveStock (Child Span)
    I-->>O: Success
    O->>N: Publish order.created (Async Span)
    O-->>G: 201 Created
    G-->>C: Response (Finish Trace)
```

---

## ðŸ› ï¸ Dashboard Configuration

- **Grafana**: Accessible at `http://localhost:3001` (in dev).
- **Dashboards**: Pre-configured dashboards for NestJS internals, NATS throughput, and Database performance.

---

[â¬…ï¸ Back to Home](../../README.md)
