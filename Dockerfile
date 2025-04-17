# Step 1: Builder
FROM oven/bun:1.2.9-alpine AS builder

WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install

COPY . .
RUN bun run build

# Step 2: Runner (slim production image)
FROM oven/bun:1.2.9-alpine AS runner

WORKDIR /app

# Copy only the necessary built output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "server.js"]
