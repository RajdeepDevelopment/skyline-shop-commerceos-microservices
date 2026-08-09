# Multi-stage build for the web-shop Vite SPA served by nginx
FROM node:24-alpine AS builder
WORKDIR /app
RUN npm i -g pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter web-shop run build

FROM nginx:1.27-alpine AS runner
COPY --from=builder /app/apps/web-shop/dist /usr/share/nginx/html
COPY apps/web-shop/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
