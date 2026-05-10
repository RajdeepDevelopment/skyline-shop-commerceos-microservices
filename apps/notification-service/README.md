# 🔔 Notification Service

## 📝 Overview

Event-driven service that handles all outgoing communication (Email, SMS, Push).

## 🗺️ System Design & Logic

- **Provider Agnostic**: Easily switch between SendGrid, Twilio, etc.
- **Template Engine**: Manages dynamic content for notifications.

## 🔗 Inner Documentation

- **[Architecture & Flow](./docs/architecture.md)** - Event consumers and templates.

## 🔄 Core Flow: Event-Driven Notification

```mermaid
graph LR
    E[External Event: order.created] --> N[NATS JetStream]
    N --> S[Notification Service]
    S --> T[Template Engine]
    T --> P[Email/SMS Provider]
    P --> U[User]
```

---

[⬅️ Back to Platform Services](../../docs/services/README.md)
