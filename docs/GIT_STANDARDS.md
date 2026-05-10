# 🚩 Git Engineering Standards

This document establishes the production-grade Git workflow and rules for the **Skyline Shop** microservices platform.

---

## 🏗️ 1. Branching Strategy

We follow a **Trunk-Based / GitFlow Hybrid** model optimized for high-velocity deployments.

| Branch | State | Protection |
| :--- | :--- | :--- |
| `main` | Production-ready (Stable) | 🔒 Locked. Requires PR + CI success. |
| `development` | Integration (Staging) | 🔒 Locked. Main target for feature PRs. |
| `feature/*` | In-progress features | — |
| `fix/*` | Hotfixes / Bug fixes | — |
| `release/*` | Version preparation | — |

### Workflow Example:
1. `development` ➔ `feature/order-api`
2. `feature/order-api` ➔ `development` (via Squash & Merge PR)
3. `development` ➔ `main` (via Release PR)

---

## 📝 2. Commit Convention

We enforce the **Conventional Commits** standard (`v1.0.0`).

### Format:
`<type>(<scope>): <description>`

### Types:
- `feat`: A new feature (Impacts MINOR version)
- `fix`: A bug fix (Impacts PATCH version)
- `docs`: Documentation only
- `refactor`: Logic update (no fix/feature)
- `chore`: Tooling/CI/Build updates

---

## 🏷️ 3. Versioning & Tagging

We use **Semantic Versioning (SemVer)** and `standard-version` to automate releases.

### Automated Release Command:
```bash
# Bumps version, updates CHANGELOG.md, creates git tag
pnpm run release
```

### Strategic Release:
- **Major (`vX.0.0`)**: Breaking API changes, protocol shifts.
- **Minor (`v0.X.0`)**: New feature added within a service.
- **Patch (`v0.0.X`)**: Bug fix, performance tweak.

---

## 🛡️ 4. Push & PR Rules

1. **No direct pushes to `main` or `development`**: All code must reside in feature branches first.
2. **Squash & Merge**: Preferred for feature branches to keep the `development` history clean.
3. **Atomic Commits**: A single commit should represent a single logical change.
4. **CI Enforcement**: PRs cannot be merged until all unit and E2E tests pass.

---

## 📖 5. Release Lifecycle

When code is ready for a production release:
1. Merge all `feature/*` into `development`.
2. Ensure `development` is passing all CI checks.
3. Run `npm run release` on `development`.
4. Merge `development` into `main`.
5. Push tags: `git push --follow-tags origin development`.

---

<div align="center">
  MIT License • 2026 Skyline Engineering
</div>
