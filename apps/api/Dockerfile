# ---------- Build stage ----------
FROM node:24-bookworm-slim AS build
WORKDIR /app

# Install seluruh workspace (monorepo) untuk resolve @washcut/shared
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
RUN npm ci

COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build -w apps/api

# ---------- Runtime stage ----------
FROM node:24-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/api ./apps/api

WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/index.js"]
