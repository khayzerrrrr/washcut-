# ---------- Build stage ----------
FROM node:24-bookworm-slim AS build
WORKDIR /app

# Build tools untuk kompilasi native module (better-sqlite3) — npm ci root menginstal semua workspace
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/web/package.json apps/web/
RUN npm ci

COPY packages/shared packages/shared
COPY apps/web apps/web
RUN npm run build -w apps/web

# ---------- Runtime stage ----------
FROM nginx:alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
