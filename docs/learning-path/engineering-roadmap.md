# ï¿½️ Engineering Roadmap

This roadmap guides you through the architectural layers of this repository, from modular logic to high-scale platform engineering.

---

## 🚀 The Project Trajectory

### 🌑 [Phase 1: The Core (Foundations)](./beginner.md)

- **Context**: Understanding the `apps/` and `libs/` monorepo structure.
- **Goal**: Mastering NestJS modules and domain isolation.

### 🚀 [Phase 2: Distributed Systems (Microservices)](./intermediate.md)

- **Context**: Implementing the `api-gateway`, gRPC communication, and NATS messaging.
- **Goal**: Moving from local function calls to distributed service orchestration.

### 🌌 [Phase 3: Resilient Architecture (Scale)](./advanced.md)

- **Context**: Using CQRS in the `order-service` and PGP security in the `auth-service`.
- **Goal**: Building a "Zero-Trust" system that handles massive read/write loads.

### 🔭 [Phase 4: Platform Engineering (Infrastructure)](../../README.md)

- **Context**: Dockerization, Prometheus monitoring, and automated `setup.sh` workflows.
- **Goal**: Managing the entire infrastructure as code.

### Diagram

```mermaid
graph TB
  P1["Phase 1: The Core (Foundations)"]
  P2["Phase 2: Distributed Systems (Microservices)"]
  P3["Phase 3: Resilient Architecture (Scale)"]
  P4["Phase 4: Platform Engineering (Infrastructure)"]

  P1 --> P2 --> P3 --> P4

  P1 --> B["beginner.md — modules & domain isolation"]
  P2 --> I["intermediate.md — gateway, gRPC, NATS"]
  P3 --> A["advanced.md — CQRS, security, sharding"]
  P4 --> H["README.md — Docker, monitoring, IaC"]
```

---

[⬅️ Back to Home](../../README.md)
