# ðŸŸ¢ Nginx Reverse Proxy

## ðŸ“ Overview

Nginx acts as the primary entry point (Ingress) for the platform, providing a secure and scalable way to expose our microservices.

## ðŸ—ï¸ Why Nginx?

1.  **SSL Termination**: Centralized management of TLS certificates.
2.  **Load Balancing**: Distributing traffic across multiple instances of the API Gateway.
3.  **Static Content**: Serving the frontend assets efficiently.
4.  **Security**: Shielding internal service ports from the public internet.

## ðŸ”„ Request Flow

```mermaid
graph LR
    U[User] -->|HTTPS:443| N[Nginx]
    N -->|HTTP:3000| G1[Gateway Instance 1]
    N -->|HTTP:3001| G2[Gateway Instance 2]
    N -->|HTTP:80| F[Static Frontend]
```

---

[â¬…ï¸ Back to Infrastructure Index](./README.md)
