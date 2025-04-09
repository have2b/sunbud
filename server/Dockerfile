FROM oven/bun:1.2.9-alpine AS builder
WORKDIR /app
COPY bun.lock package.json ./
RUN bun i --frozen-lockfile
COPY . .
RUN bun build ./src/index.ts --target=bun --outdir ./ --minify && ls | grep -v "index.js" | xargs rm -rf

FROM oven/bun:1.2.9-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/index.js /app
ARG DATABASE_URL
ARG AUTH_SECRET
ARG CLIENT_URL
ENV DATABASE_URL=$DATABASE_URL
ENV AUTH_SECRET=$AUTH_SECRET
ENV CLIENT_URL=$CLIENT_URL
EXPOSE 5000
CMD ["bun", "run", "index.js"]