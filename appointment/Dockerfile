FROM oven/bun AS builder
WORKDIR /code
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:alpine
WORKDIR /app
COPY --from=builder /code/dist .
ENV NODE_ENV=production
ENV TZ=Asia/Singapore
CMD ["bun", "run", "index.js"]
