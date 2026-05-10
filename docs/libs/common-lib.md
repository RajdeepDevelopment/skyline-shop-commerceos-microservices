# ðŸ“š Common Library (`libs/common`)

The Common Library is the "Standard Library" of our platform, containing shared utilities, types, and NestJS decorators used by all microservices.

---

## ðŸ—ï¸ Core Responsibilities

- **Consistency**: Ensures standardized error handling, request logging, and health checks across the platform.
- **DRY (Don't Repeat Yourself)**: Centralizes cross-cutting concerns like JWT guards and correlation ID middleware.
- **Contract Definition**: Houses shared DTOs (Data Transfer Objects) and Event types.

---

## ðŸ—ºï¸ Library Composition

| Module         | Purpose                          | Example                                               |
| :------------- | :------------------------------- | :---------------------------------------------------- |
| **Decorators** | Custom NestJS metadata.          | `@CurrentUser()`, `@Public()`                         |
| **DTOs**       | Shared request/response schemas. | `PaginationQueryDto`, `BaseResponseDto`               |
| **Filters**    | Global exception handling.       | `HttpExceptionFilter`, `RpcExceptionFilter`           |
| **Guards**     | Centralized security logic.      | `JwtAuthGuard`, `RolesGuard`                          |
| **Middleware** | Request lifecycle hooks.         | `CorrelationIdMiddleware`, `RequestLoggingMiddleware` |
| **Health**     | Standardized health checks.      | `Terminus` configuration for Liveness/Readiness.      |

---

## ðŸ”„ Global Request Lifecycle

Every request entering the platform via the API Gateway passes through these common layers:

```mermaid
graph TD
    R[Incoming Request] --> C[CorrelationIdMiddleware]
    C --> L[RequestLoggingMiddleware]
    L --> G[JwtAuthGuard]
    G --> V[ValidationPipe]
    V --> S[Service Logic]
    S --> F[HttpExceptionFilter (if error)]
```

---

## ðŸ› ï¸ Usage Example

```typescript
// Applying a shared guard and correlation ID context
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  @Post()
  create(@Body() dto: CreateOrderDto, @CorrelationId() correlationId: string) {
    // Logic
  }
}
```

---

[â¬…ï¸ Back to Home](../../README.md)
