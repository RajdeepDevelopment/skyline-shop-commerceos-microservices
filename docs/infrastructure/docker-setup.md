# ðŸ‹ Docker Setup

## ðŸ“ Overview

We use Docker and Docker Compose to ensure environment parity from development to production.

## ðŸ—ï¸ Why Docker?

1.  **Isolation**: Each service runs in its own container with specific dependencies.
2.  **Parity**: "It works on my machine" becomes "It works in the container."
3.  **Scalability**: Easily spin up multiple instances of a service using `docker-compose scale`.
4.  **Orchestration Ready**: The setup is designed to be easily migrated to Kubernetes.

## ðŸ”„ Deployment Flow

```mermaid
graph LR
    Code[Source Code] --> Build[Docker Build]
    Build --> Image[Docker Image]
    Image --> Registry[Container Registry]
    Registry --> Deploy[Production/Staging]
```

## ðŸ› ï¸ Infrastructure Stack (docker-compose.yml)

- **postgres**: Relational database.
- **redis**: Caching layer.
- **nats**: Messaging broker.
- **prometheus/grafana**: Monitoring.
- **nginx**: Reverse proxy.

---

[â¬…ï¸ Back to Infrastructure Index](./README.md)
