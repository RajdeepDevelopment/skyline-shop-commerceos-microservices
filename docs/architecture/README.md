# 🏗️ Architecture & Strategy

This section covers the high-level system design, patterns, and strategies that govern the E-Commerce Microservices Platform — designed for **10M+ users** and a **1M+ SKU** catalog.

## 📖 Key Documentation

- **[System Overview](./system-overview.md)** - The high-level architectural map (services, data plane, storefront).
- **[Architecture Deep Dive](./ARCHITECTURE.md)** - Microservices architecture and service boundaries.
- **[System Design Deep Dive](./system-design-deep-dive.md)** - End-to-end design walkthrough.
- **[Algorithms & Data Structures](./algorithms.md)** - The algorithm behind every feature (hashing, ranking, sagas).
- **[Database Architecture](./database-architecture.md)** - Five stores, what each holds, and why that arrangement scales.
- **[Discovery & Ranking](./discovery-and-ranking.md)** - Behaviour events, Redis ranked lists, ClickHouse analytics.
- **[Resiliency Patterns](./resiliency-patterns.md)** - Circuit breakers, retries, and failure handling.
- **[Security Architecture](./security-architecture.md)** - Auth, PGP, and Zero-Trust principles.
- **[Testing Strategy](./testing-strategy.md)** - Multi-layered testing approach.

## 🔄 Core Flows

- **[Catalog Browsing & Discovery](../flows/catalog-browsing-flow.md)** - Search, filters, product details & reviews.
- **[Checkout Flow](../flows/checkout-flow.md)** - Cart → confirmed order via saga orchestration.
- **[Order Tracking Flow](../flows/track-order-flow.md)** - Track orders and 404 handling.

## 🖼️ Storefront Screenshots

| **Home / Banner** | **All Products** | **Product Details** |
| :--- | :--- | :--- |
| ![Home](../images/home-banner.png) | ![All Products](../images/all-products.png) | ![Product Details](../images/product-details.png) |
| **Product Reviews** | **Cart** | **Order Details** |
| ![Reviews](../images/product-reviews.png) | ![Cart](../images/cart.png) | ![Order Details](../images/order-details.png) |

---

[⬅️ Back to Home](../../README.md)
