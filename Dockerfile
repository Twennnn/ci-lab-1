# Стадия сборки
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY src/ ./src/

# Рабочая стадия
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/src ./src
EXPOSE 3000
ARG CHAOS_MODE=false
ENV CHAOS_MODE=$CHAOS_MODE
CMD ["node", "src/server.js"]