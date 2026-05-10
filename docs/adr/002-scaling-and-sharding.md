# ADR 002: Scaling and Deployment Strategy

## Status
Accepted

## Context
As an eCommerce platform (similar to Amazon/Uber), our system will face highly variable loads. We need a strategy for scaling individual services horizontally and handling database traffic without degradation.

## Deployment Strategy
We will use **Kubernetes** for container orchestration in production (though Docker Compose is provided for local dev). 
- **CI/CD:** GitHub Actions builds multi-stage Docker images and pushes them to a registry (e.g., ECR/GCR).
- **GitOps:** ArgoCD or Flux will monitor the repository and deploy changes to the cluster.
- **Rollouts:** We will use Canary Deployments or Blue-Green deployments to ensure zero-downtime updates and easy rollbacks if error rates spike.

## Scaling Strategy
- **Horizontal Pod Autoscaler (HPA):** We will scale stateless microservices (e.g., API Gateway, Product Service) based on CPU and memory utilization metrics gathered by Prometheus.
- **Event-Driven Scaling:** For queue workers (e.g., Order Processing, Notification Service), we will use KEDA (Kubernetes Event-driven Autoscaling) to scale based on the length of NATS or BullMQ queues.
- **Caching Layer:** Redis will be deployed in a cluster mode to scale read operations for Cart data, session info, and rate-limiting counters.

## Load Balancing
- **External Load Balancing:** Cloud provider LB (AWS ALB / GCP HTTP(S) LB) will terminate SSL and route traffic to the ingress controller (Nginx Ingress).
- **Internal Load Balancing:**
  - Kubernetes Services (ClusterIP) will handle internal HTTP load balancing.
  - For gRPC, we will use a service mesh (like Istio or Linkerd) or client-side load balancing to ensure long-lived connections are properly balanced across replicas.

## Database Sharding & Read/Write Separation
- **Read Replicas:** PostgreSQL will be set up with a Master-Slave architecture. Writes go to the Master, while Read Replicas handle SELECT queries (e.g., fetching product details). Prisma will be configured with read/write database URLs.
- **Sharding Strategy:** For the `Order` and `User` domains, once the data outgrows a single database node, we will shard the data. 
  - *Tenant-based/User-ID based sharding:* Orders will be sharded by `user_id` so that all orders for a specific user reside on the same database shard. A consistent hashing algorithm (or an orchestrator like Citus) will route queries to the correct shard.
  - *Hot Data vs Cold Data:* Historical orders will be archived to a data warehouse or cheaper storage, keeping the active PostgreSQL shards small and fast.

## Production Best Practices
1. **Graceful Shutdown:** All NestJS apps must handle SIGTERM to close DB connections and finish processing active queue jobs before exiting.
2. **Circuit Breaker:** Use `@nestjs/axios` with a circuit breaker pattern (e.g., `nestjs-brakes`) when calling third-party APIs (like payment gateways) to prevent cascading failures.
3. **Idempotency:** All event handlers (e.g., payment processed) must be idempotent. We will use a unique `eventId` and store processed IDs in Redis or Postgres to ensure we don't process an order twice.
4. **Structured Logging:** Use `pino` for JSON-formatted logs with correlation IDs to trace requests across microservices.
5. **Security:** Implement Helmet, rate limiting (Redis-backed), and JWT rotation. Enable strict TLS for all service-to-service gRPC communication.
