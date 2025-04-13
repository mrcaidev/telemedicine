# -------- 构建阶段 --------
FROM node:23-slim AS builder

# 设置构建参数（可通过 docker build --build-arg ENV=development 传入）
ARG ENV=production

WORKDIR /app

COPY package*.json ./

COPY .env.${ENV} .env

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --omit=dev

# -------- 运行阶段 --------
FROM node:23-slim AS runner

WORKDIR /app

COPY --from=builder /app ./

# 监听端口
EXPOSE 3000

CMD ["npm", "start"]
