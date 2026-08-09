# Multi-stage build for a NestJS monorepo service (webpack-bundled)
FROM node:24-alpine AS base
WORKDIR /app
RUN npm i -g pnpm

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY . .
RUN pnpm install --frozen-lockfile

FROM deps AS builder
RUN pnpm exec nest build api-gateway

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/api-gateway ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/proto ./proto
EXPOSE 3000
CMD ["node", "dist/main.js"]
