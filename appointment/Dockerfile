FROM oven/bun AS build
WORKDIR /code
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:alpine
WORKDIR /app
COPY --from=build /code/dist .
ENV NODE_ENV=production
CMD ["bun", "run", "index.js"]
