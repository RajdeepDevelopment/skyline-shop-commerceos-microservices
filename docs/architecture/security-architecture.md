# ðŸ” Security Architecture

The platform follows a **Zero-Trust** and **Defense-in-Depth** strategy.

## ðŸ›¡ï¸ Security Layers

### 1. Identity & Access (IAM)

- **JWT**: Stateless authentication with short-lived tokens.
- **RBAC**: Role-Based Access Control (Admin, Vendor, Customer).

### 2. Data Protection

- **Encryption at Rest**: PostgreSQL TDE.
- **Encryption in Transit**: TLS for all gRPC and HTTP traffic.
- **Sensitive Payloads**: We use **OpenPGP** to sign/encrypt high-value messages between services.

## ðŸ”„ Signature Flow (PGP)

```mermaid
sequenceDiagram
    participant S as Source Service
    participant A as Auth Service (Key Provider)
    participant T as Target Service

    S->>A: Fetch Target Public Key
    A-->>S: Public Key
    S->>S: Sign & Encrypt Payload
    S->>T: Send Secure Message
    T->>T: Verify Signature & Decrypt
```

---

[â¬…ï¸ Back to Architecture Index](./README.md)
