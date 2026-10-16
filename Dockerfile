FROM node:22 AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

ARG VITE_API_BASE_URL
ARG VITE_DOCS_URL
ARG VITE_BACKEND_REPO_URL
ARG VITE_WEB_REPO_URL
ARG VITE_MOBILE_REPO_URL
ARG VITE_APK_URL

COPY . .
RUN npm run build

FROM caddy:alpine

COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 8080