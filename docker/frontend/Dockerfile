FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# ── Development ──────────────────────────────────────────────────────────────
FROM base AS development
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ── Build ─────────────────────────────────────────────────────────────────────
FROM base AS builder
RUN npm run build

# ── Production ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD ["node", "server.js"]
