# 🤝 Contributing to E-Commerce Microservices Platform

Thank you for your interest in contributing! As a production-grade engineering reference, we maintain high standards for code quality, architectural consistency, and documentation.

---

## 🏗️ Engineering Standards

### 1. Architectural Integrity

- **Domain Isolation**: Every service must own its data. No cross-service database access.
- **Communication**: Use **gRPC** for synchronous internal calls and **NATS JetStream** for asynchronous choreography.
- **Statelessness**: All services must remain stateless to support horizontal scaling.
- **CQRS**: Separate read and write concerns in high-traffic domains.

### 2. Code Quality

- **Type Safety**: TypeScript is mandatory. Avoid `any` at all costs.
- **Error Handling**: Use structured error responses and proper HTTP/gRPC status codes.
- **Observability**: Every new feature must include Prometheus metrics and structured logging.

---

## 🚀 Development Workflow

### 1. Branching Strategy

- `main`: Production-ready code.
- `feature/*`: New features or enhancements.
- `fix/*`: Bug fixes.
- `docs/*`: Documentation updates.

### 2. Pull Request Process

1.  **Fork and Branch**: Create your branch from `main`.
2.  **Conventional Commits**: We use [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat(order): add idempotency`).
3.  **Testing**: Ensure all unit and E2E tests pass (`pnpm run test`).
4.  **Documentation**: Update relevant READMEs and architecture docs for any logic change.
5.  **Review**: Every PR requires at least one approval from a service owner.

---

## 🛠️ Local Development

### Automated Setup

```bash
chmod +x setup.sh
./setup.sh
```

### Manual Service Execution

```bash
# Start infrastructure
docker-compose up -d

# Start a specific service
pnpm run start:dev order-service
```

---

## 📜 Coding Style

- **SOLID**: We strictly adhere to SOLID principles and Clean Architecture.
- **Linting**: Standard NestJS/TypeScript rules enforced by ESLint.
- **Formatting**: Automated via Prettier.

---

## 💬 Communication

For major architectural changes, please open an **RFC (Request for Comments)** issue first to discuss the design before implementation.

---

<div align="center">
  MIT License • 2026 Production-Grade Engineering Hub
</div>
