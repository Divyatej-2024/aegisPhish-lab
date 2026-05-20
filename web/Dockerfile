# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY web/package.json ./web/
COPY web/tsconfig.json ./web/

# Install pnpm
RUN npm install -g pnpm@10.0.0

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY web ./web

# Build
RUN pnpm -F web build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.0.0

# Copy from builder
COPY --from=builder /app/web/.next ./web/.next
COPY --from=builder /app/web/node_modules ./web/node_modules
COPY --from=builder /app/web/package.json ./web/

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

CMD ["pnpm", "-F", "web", "start"]
