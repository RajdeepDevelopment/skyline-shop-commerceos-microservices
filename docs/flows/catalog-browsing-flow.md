# 🛍️ Catalog Browsing & Discovery Flow

How a visitor discovers products — from the home banner through search, filtering, product details, and reviews — all served by the Product Service backed by **Elasticsearch** and **PostgreSQL shards**.

## 🖼️ Screens

| | |
| :--- | :--- |
| **🏠 Home / Banner & Navbar** | **🛍️ All Products (with filters)** |
| ![Home & Navbar](../images/home-banner.png) | ![All Products](../images/all-products.png) |
| **📦 Product Details** | **⭐ Product Reviews** |
| ![Product Details](../images/product-details.png) | ![Product Reviews](../images/product-reviews.png) |
| **🛒 Cart** | |
| ![Cart](../images/cart.png) | |

## 🧭 Discovery Path

```mermaid
graph LR
    FE[Web Shop]
    GW[API Gateway]
    PS[Product Service]
    ES[(Elasticsearch ×3)]
    PG[(Postgres Shards ×4)]
    RD[(Redis Cache)]
    AN[Analytics Service / ClickHouse]
    RV[Recently Viewed Store]

    FE -->|"GET /api/v1/products?category=&minPrice=&maxPrice="| GW
    GW -->|"gRPC SearchProducts"| PS
    PS -->|"ranked query"| ES
    PS -->|"enrichment"| PG
    PS -->|"hot results"| RD
    PS -->|"behavior events"| AN
    PS --> RV
```

## 🔄 Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant FE as Web Shop (React)
    participant GW as API Gateway
    participant PS as Product Service
    participant ES as Elasticsearch
    participant RD as Redis Cache
    participant PG as Postgres Shards
    participant AN as Analytics / ClickHouse

    U->>FE: Opens home page
    FE->>GW: GET /api/v1/discovery/home
    GW->>PS: gRPC discovery / trending
    PS->>ES: Ranked search queries
    PS-->>FE: Banner, categories, deals, bestsellers

    U->>FE: Applies category + price filters
    FE->>GW: GET /api/v1/products?category=smartphones&minPrice=15000&maxPrice=50000
    GW->>PS: gRPC SearchProducts
    PS->>ES: Filtered range query (INR prices)
    PS->>RD: Cache hot result sets
    PS-->>FE: Paginated product grid

    U->>FE: Opens a product
    FE->>GW: GET /api/v1/products/:id (+ reviews)
    GW->>PS: gRPC GetProduct + GetReviews
    PS->>PG: Hydrate details / stock from shards
    PS->>ES: Track view → recommendations
    PS-->>FE: Product details + similar items

    U->>FE: Reviews a product
    FE->>GW: POST /api/v1/products/:id/reviews
    GW->>PS: gRPC CreateReview
    PS->>PG: Persist to shard
    PS-->>FE: Updated rating summary

    Note over FE: Recently viewed stored for logged-in users
    FE->>AN: POST behavior events (x-anonymous-id / session)
```

## 🔍 Search & Filtering Details

- **Range filters** operate on **INR prices** stored in Elasticsearch (`price`, `currency` fields), so `minPrice`/`maxPrice` match the displayed catalog values.
- **Faceted categories** are aggregated at query time from the ES index.
- **Recommendations & "frequently bought"** are driven by behavior events (anonymous id / session id) streamed into the analytics service.
- **Reviews** are written to the owning product shard and aggregated into an ES-routed rating summary for instant display.

---

[🔗 View Checkout Flow](./checkout-flow.md) | [🔗 View Order Tracking Flow](./track-order-flow.md) | [⬅️ Back to Flows Index](./README.md)
