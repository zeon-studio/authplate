FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.1.2 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile


# Build stage
FROM base AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.1.2 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# DATABASE_URL is required by prisma.config.ts during `prisma generate`
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN pnpm prisma generate
RUN pnpm build


# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
