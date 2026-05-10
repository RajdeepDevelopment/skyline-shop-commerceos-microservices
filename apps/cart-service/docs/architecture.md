# Cart Service: Architecture & Flows

## ðŸ—ï¸ Internal Logic

The service follows a modular NestJS structure. The `CartService` acts as the domain orchestrator, communicating with a `RedisRepository` for persistence.

### Use Cases

1. **Sync Cart**: Merging guest carts with authenticated user carts.
2. **Persistence**: Managing TTL for cart expiry (default 7 days).
3. **Price Calculation**: Real-time totaling of items (logic resides in service to avoid stale prices).

## ðŸŒŠ Detailed Item Addition Flow

```mermaid
graph TD
    A[Request: Add Item] --> B{User Auth?}
    B -- Yes --> C[Get User ID]
    B -- No --> D[Get Session ID]
    C --> E[Check Product via gRPC]
    D --> E
    E --> F{Valid?}
    F -- No --> G[Return Error]
    F -- Yes --> H[Atomic Update in Redis]
    H --> I[Return New Cart State]
```

## ðŸ›¡ï¸ Resiliency

- **Circuit Breaker**: If Product Service is down, cart allows adding items but marks them as "Price Unverified".
- **Retry Logic**: Exponential backoff for Redis connection issues.
