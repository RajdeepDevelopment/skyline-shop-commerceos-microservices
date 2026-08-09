# Multi-stage build for the analytics/ranking service (webpack-bundled)
FROM node:24-alpine AS base
WORKDIR /app
RUN npm i -g pnpm

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY . .
RUN pnpm install --frozen-lockfile

FROM deps AS builder
RUN pnpm exec nest build analytics-service

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/analytics-service ./dist
COPY --from=builder /app/package.json ./
EXPOSE 3008
CMD ["node", "dist/main.js"]
