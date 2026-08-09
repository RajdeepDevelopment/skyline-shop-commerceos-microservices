# 🌊 System Flows

Visualizing how data and events move through the system for core business processes — with real storefront screenshots.

## 🗺️ Flow Map

```mermaid
graph LR
    BROWSE[Catalog Browsing & Discovery] -->|add to cart| CART[Cart]
    CART --> CHECKOUT[Checkout Flow · Saga orchestration]
    CHECKOUT --> TRACK[Order Tracking Flow]
```

## 🖼️ UI Showcase

|                                                   |                                                   |
| :------------------------------------------------ | :------------------------------------------------ |
| **🏠 Home / Banner**                              | **🛍️ All Products**                               |
| ![Home](../images/home-banner.png)                | ![All Products](../images/all-products.png)       |
| **📦 Product Details**                            | **⭐ Product Reviews**                            |
| ![Product Details](../images/product-details.png) | ![Product Reviews](../images/product-reviews.png) |
| **🛒 Cart**                                       | **📦 Order Details**                              |
| ![Cart](../images/cart.png)                       | ![Order Details](../images/order-details.png)     |

## 🔄 Business Processes

- **[Catalog Browsing & Discovery](./catalog-browsing-flow.md)** - Home, search, filters, product details & reviews.
- **[Checkout Flow](./checkout-flow.md)** - From cart to confirmed order (Saga orchestration).
- **[Order Tracking Flow](./track-order-flow.md)** - Track an order, 404 handling, account order history.

---

[⬅️ Back to Home](../../README.md)
