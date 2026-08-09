# 🔐 Auth Service

The **Auth Service** is the security backbone of the platform, managing identity, authentication, and internal service-to-service trust.

## 🗺️ Authentication Flow

```mermaid
graph LR
    subgraph Clients
        USER[Users]
        GW[API Gateway]
        SVC[Internal Services]
    end
    AUTH[Auth Service]
    PG[(PostgreSQL Users & Roles)]

    USER -- register / login --> AUTH
    GW -- validate session gRPC --> AUTH
    SVC -- PGP verify gRPC --> AUTH
    AUTH --> PG
    AUTH -- JWT --> USER
    AUTH -- public PGP keys --> SVC
```

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Data Store**: PostgreSQL (Users & Roles)
- **Encryption**: bcrypt (Passwords), PGP (Service Signatures)

## 📋 Responsibilities

1. **Identity Management**: User registration, login, and profile management.
2. **Token Dispensation**: Issuing JWTs and managing refresh tokens.
3. **RBAC**: Enforcing Role-Based Access Control across the platform.
4. **PGP Key Management**: Distributing public keys for service-to-service verification.

---

[⬅️ Back to Services Index](./README.md)
