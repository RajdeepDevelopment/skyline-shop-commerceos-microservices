# Cart Service: Database Design (Redis)

## 🗄️ Schema Strategy

Since carts are transient, we use **Redis Hashes** for optimal performance and memory efficiency.

### Key Structure

`cart:{userId}` (Hash)

### Fields

| Field              | Value         | Description                                  |
| :----------------- | :------------ | :------------------------------------------- |
| `item:{productId}` | `JSON String` | Contains qty, addedAt, and priceAtAddition.  |
| `metadata`         | `JSON String` | Contains currency, coupons, and lastUpdated. |

### TTL Policy

- All cart keys are set with an `EXPIRE` of 604800 seconds (7 days).
- Every update to the cart resets the TTL.

## 🛠️ Rationale

- **Why Redis?**: Sub-millisecond latency for frequent updates.
- **Why Hashes?**: Allows updating specific items without rewriting the entire cart object.
