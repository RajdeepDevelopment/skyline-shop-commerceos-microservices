# 🐋 Docker Setup

## 📝 Overview

We use Docker and Docker Compose to ensure environment parity from development to production.

## 🏗️ Why Docker?

1.  **Isolation**: Each service runs in its own container with specific dependencies.
2.  **Parity**: "It works on my machine" becomes "It works in the container."
3.  **Scalability**: Easily spin up multiple instances of a service using `docker-compose scale`.
4.  **Orchestration Ready**: The setup is designed to be easily migrated to Kubernetes.

## 🔄 Deployment Flow

```mermaid
graph LR
    Code[Source Code] --> Build[Docker Build]
    Build --> Image[Docker Image]
    Image --> Registry[Container Registry]
    Registry --> Deploy[Production/Staging]
```

## 🛠️ Infrastructure Stack (docker-compose.yml)

- **postgres**: Relational database (sharded per service).
- **redis**: Caching layer + discovery ranking storage.
- **nats**: Messaging broker (JetStream event bus).
- **clickhouse**: Columnar store for behaviour events / ranking history (port 8123 HTTP, 9000 native).
- **prometheus/grafana**: Monitoring.
- **nginx**: Reverse proxy.

> **ClickHouse auth note**: the stock `24.8` image restricts the `default` user to
> loopback, which blocks container-to-container connections. The compose file mounts
> `infrastructure/clickhouse/users.d/zzz-allow-network.xml`, which allows the `default`
> user from any network (development only).

---

[⬅️ Back to Infrastructure Index](./README.md)
