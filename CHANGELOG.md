# 📋 Changelog

All notable changes to this project will be documented in this file.

## 1.0.0 (2026-05-10)

### 🚀 Features

- initial microservices architecture setup & ci maintenance ([bf7bad7](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/bf7bad7462bff354a7b5c73799c7c834186c14c9))

### 🐛 Bug Fixes

- resolve terminal UTF-8 encoding issue for emoji and special characters ([00f20e8](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/00f20e82aff502ab66ececfe5ab29f3947255877))
- resolve terminal UTF-8 encoding issue for emoji and special characters ([9798585](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/979858592c12571717901ec26ae72424cce18e6f))

### 📚 Documentation

- fix documentation file extensions and encoding for github ([5082ef6](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/5082ef66d58a4131fb503b54eb3383149f409c06))
- restore adr files and fix markdown encoding ([78c80e4](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/78c80e4dac2416765d814d7398cbf6e35de4a45e))
- restore markdown files from backup and convert to utf-8 ([2647b7c](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/2647b7c1239071aee3148d57300467873506fe60))
- **wiki:** add microservices architecture wiki and visuals ([2330960](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/2330960fb48cd3788a663c604ae9a54ad95e6d17))

### ⚙️ Miscellaneous

- **release:** v0.0.1 ([bbcf27b](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/bbcf27b9a7dcc4008bf24a1744a1094863deb31e))

### 0.0.1 (2026-05-10)

### 🚀 Features

- initial microservices architecture setup & ci maintenance ([bf7bad7](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/bf7bad7462bff354a7b5c73799c7c834186c14c9))

### 🐛 Bug Fixes

- resolve terminal UTF-8 encoding issue for emoji and special characters ([00f20e8](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/00f20e82aff502ab66ececfe5ab29f3947255877))
- resolve terminal UTF-8 encoding issue for emoji and special characters ([9798585](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/979858592c12571717901ec26ae72424cce18e6f))

### 📚 Documentation

- fix documentation file extensions and encoding for github ([5082ef6](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/5082ef66d58a4131fb503b54eb3383149f409c06))
- restore adr files and fix markdown encoding ([78c80e4](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/78c80e4dac2416765d814d7398cbf6e35de4a45e))
- restore markdown files from backup and convert to utf-8 ([2647b7c](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/2647b7c1239071aee3148d57300467873506fe60))
- **wiki:** add microservices architecture wiki and visuals ([2330960](https://github.com/RajdeepDevelopment/skyline-shop-commerceos-microservices/commit/2330960fb48cd3788a663c604ae9a54ad95e6d17))

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project scaffolding for eCommerce Microservices Platform.
- Configured NestJS Monorepo.
- Integrated PostgreSQL, Redis, and NATS JetStream via Docker Compose.
- Auth Module, Message Module, Cache Module setup.
- Testing infrastructure with Jest, Supertest, and Testcontainers.
- CI/CD pipeline using GitHub Actions.

### Added (Storefront)

- **Account page** (`/account`): profile, order history, addresses, saved payment cards, recently-viewed products.
- **Order tracking**: clean 404 "Order not found" empty state for missing order ids.

### Fixed

- **Ghost orders**: `GetOrder` now throws gRPC `NOT_FOUND` (code 5) → HTTP 404 instead of returning a phantom empty order.
- **Currency**: seeded catalog prices and order/payment records converted from USD to **INR**, fixing price-range filters (e.g. `category=smartphones&minPrice=15000&maxPrice=50000`).
- **Price-range search**: `minPrice`/`maxPrice` filters now match the displayed INR prices in Elasticsearch.

### Documentation

- Added UI screenshots to the README, wiki, and flow docs (`docs/images/`).
- New flow docs: [catalog-browsing-flow](docs/flows/catalog-browsing-flow.md), [track-order-flow](docs/flows/track-order-flow.md), improved [checkout-flow](docs/flows/checkout-flow.md).
- Documented **10M+ user / 1M+ SKU** scale targets and the full technology matrix in the README.
- Fixed broken doc links across architecture, ADR, and infrastructure indexes.
- New **[algorithms](docs/architecture/algorithms.md)** doc — the algorithm behind every feature (djb2 shard routing, weighted ranking, saga orchestration, idempotency, circuit breakers).
- New **[database-architecture](docs/architecture/database-architecture.md)** doc — the five stores (Postgres shards, Redis, Elasticsearch, ClickHouse, NATS JetStream), what each holds and why.
- New **[getting-started](docs/infrastructure/getting-started.md)** guide — prerequisites, `./setup.sh`, running/stopping, seeding, URLs, hot-reload dev, and AWS/Floci deployment paths.
- Added a hero product screenshot to the README and documented **bcrypt** (matching the auth-service implementation) in place of the previous Argon2 references.
