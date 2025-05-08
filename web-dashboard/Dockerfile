FROM node:lts-alpine AS builder
WORKDIR /code
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXTAUTH_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NODE_ENV=production
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY --from=builder /code/public public
COPY --from=builder /code/.next/standalone .
COPY --from=builder /code/.next/static .next/static
ENV HOSTNAME=0.0.0.0
ENV NODE_ENV=production
CMD ["node", "server.js"]
