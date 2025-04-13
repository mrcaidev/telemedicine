FROM node:lts-alpine AS build
WORKDIR /code
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:lts-alpine
WORKDIR /app
COPY --from=build /code/public public
COPY --from=build /code/.next/standalone .
COPY --from=build /code/.next/static .next/static
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
