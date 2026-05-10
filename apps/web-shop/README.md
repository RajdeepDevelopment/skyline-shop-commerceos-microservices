# E-Commerce Web Shop Frontend

A modern, modular e-commerce frontend built with React, TypeScript, and Zustand for state management.

## Architecture

This project follows a modular architecture with clear separation of concerns:

### Module Structure

Each module (auth, cart, products, orders, etc.) follows this structure:

```
modules/[module-name]/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ components/     # Module-specific React components
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ services/       # API service layer for backend communication
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ stores/         # Zustand state management
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ types/          # TypeScript type definitions
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ hooks/          # Custom React hooks
```

### Common Components

Reusable UI components are located in `common/ui/`:

- Button, Input, Card, Loading components
- Consistent design system with Tailwind CSS
- TypeScript support with proper prop interfaces

### State Management

- **Zustand** for global state management
- Each module has its own store with typed state
- Persistent storage for auth state
- Optimistic updates for better UX

## Modules

### Auth Module

- Login/Register functionality
- JWT token management
- User session persistence
- Protected routes

### Cart Module

- Add/remove/update cart items
- Real-time cart calculations
- Local storage persistence
- Integration with product inventory

### Products Module

- Product listing with filtering
- Product details view
- Category management
- Search functionality

### Orders Module

- Order creation and management
- Order history
- Status tracking
- Shipping information

## API Integration

Each service module connects to corresponding microservice:

- **Auth Service**: `/auth/*`
- **Cart Service**: `/cart/*`
- **Product Service**: `/products/*`
- **Order Service**: `/orders/*`
- **Payment Service**: `/payments/*`

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update API URLs in `.env` to match your microservice endpoints

4. Start development server:

```bash
pnpm dev
```

## Environment Variables

- `VITE_API_BASE_URL`: Base URL for API gateway
- `VITE_AUTH_SERVICE_URL`: Auth service endpoint
- `VITE_CART_SERVICE_URL`: Cart service endpoint
- `VITE_PRODUCT_SERVICE_URL`: Product service endpoint
- `VITE_ORDER_SERVICE_URL`: Order service endpoint

## Usage Examples

### Using Auth Store

```typescript
import { useAuthStore } from './modules';

const { login, logout, user, isAuthenticated } = useAuthStore();

// Login
await login('user@example.com', 'password');

// Logout
await logout();
```

### Using Cart Store

```typescript
import { useCartStore } from './modules';

const { addToCart, removeFromCart, items, totalAmount } = useCartStore();

// Add to cart
await addToCart('user123', 'product456', 2);

// Remove from cart
await removeFromCart('user123', 'item789');
```

### Using Common Components

```typescript
import { Button, Input, Card } from './common';

<Button variant="primary" onClick={handleClick}>
  Click me
</Button>

<Input label="Email" type="email" />

<Card>
  <CardHeader>
    <CardTitle>Product Title</CardTitle>
  </CardHeader>
  <CardContent>
    Product content here
  </CardContent>
</Card>
```

## Development

### Adding New Modules

1. Create module directory: `modules/new-module/`
2. Add subdirectories: `components/`, `services/`, `stores/`, `types/`
3. Define types in `types/`
4. Create service class in `services/`
5. Implement Zustand store in `stores/`
6. Export from `modules/index.ts`

### Adding New Components

1. Add to appropriate module or `common/components/`
2. Follow existing component patterns
3. Use TypeScript interfaces for props
4. Include proper accessibility attributes

## Build

```bash
pnpm build
```

## Lint

```bash
pnpm lint
```
