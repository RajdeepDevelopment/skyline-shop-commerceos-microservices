# Base stage
FROM node:24-alpine AS base
WORKDIR /app
RUN npm i -g pnpm

# Dependencies stage
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY libs/ ./libs/
RUN pnpm install --frozen-lockfile

# Builder stage
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm run build api-gateway

# Runner stage
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm i -g pnpm

COPY --from=builder /app/dist/apps/api-gateway ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

USER node

EXPOSE 3000

CMD ["node", "dist/main"]
