# 📖 Engineering Glossary

A comprehensive reference for the architectural terms, patterns, and technologies used throughout the E-Commerce Microservices Platform.

---

### A

- **API Gateway**: A server that acts as an API front-end, receives API requests, enforces throttling and security policies, passes requests to the back-end service, and then passes the response back to the requester.
- **bcrypt**: The password hashing algorithm used in this platform for identity protection — a slow, computationally expensive hash designed specifically to resist offline brute-force attacks.

### C

- **Choreography**: A type of service orchestration where services communicate asynchronously via events (NATS) without a central coordinator.
- **Circuit Breaker**: A design pattern used to detect failures and encapsulate the logic of preventing a failure from constantly recurring (stopping the "bleeding").
- **CQRS (Command Query Responsibility Segregation)**: A pattern that segregates the operations that read data (Queries) from the operations that update data (Commands).

### D

- **Dead Letter Queue (DLQ)**: A specialized queue where messages are sent if they cannot be successfully processed by a consumer after multiple retries.
- **Defense-in-Depth**: A security strategy that uses multiple layers of security controls throughout an IT system.

### E

- **Event-Driven Architecture (EDA)**: A software architecture paradigm promoting the production, detection, consumption of, and reaction to events.

### G

- **gRPC**: A high-performance, open-source universal RPC framework that uses Protocol Buffers (protobuf) as its interface definition language.

### I

- **Idempotency**: The property of certain operations in mathematics and computer science whereby they can be applied multiple times without changing the result beyond the initial application.

### N

- **NATS JetStream**: A cloud-native messaging system that provides persistent storage and "at-least-once" delivery guarantees.

### O

- **OpenPGP**: An open standard for encrypting and signing data, used in this platform for zero-trust service communication.

### S

- **Sharding**: A type of database partitioning that separates very large databases into smaller, faster, more easily managed parts called data shards.
- **SOLID**: An acronym for five design principles intended to make software designs more understandable, flexible, and maintainable.

### Z

- **Zero-Trust**: A security model based on the principle of "never trust, always verify," even for internal network traffic.

---

<div align="center">
  MIT License • 2026 Production-Grade Engineering Hub
</div>
