# One-shot bootstrap image: pushes the Prisma schema to every compose database
# and seeds the product shards + Elasticsearch so a fresh `docker compose up -d`
# produces a working stack. The container runs once and exits (0 on success).
#
# NOTE: must be a Debian-based image (not alpine) — the migrate script is bash.
FROM node:24-slim AS base
WORKDIR /app
RUN npm i -g pnpm

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY . .
RUN pnpm install --frozen-lockfile

FROM deps AS runner
ENV NODE_ENV=development
ENV ENV_FILE=/app/docker/migrate.env
# compose `bootstrap` service injects these at runtime:
#   ELASTICSEARCH_URL, SEED_TARGET, SEED_PRODUCT_COUNT, SEED_SHARD_URLS
CMD ["bash", "-lc", "\
  pnpm exec prisma generate && \
  bash scripts/compose-db-migrate.sh && \
  npx ts-node scripts/seed/seed-db.ts && \
  npx ts-node scripts/seed/seed-availability.ts"]
