# Stage 1: Base
FROM node:22.19.0 AS base
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json pnpm-lock.yaml ./

# Stage 2: Dependencies
FROM base AS deps
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Stage 3: Builder
FROM deps AS builder
COPY . .
RUN pnpm build

# Stage 4: Production
FROM node:22.19.0 AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["pnpm", "start"]

# Stage 5: Development
FROM base AS development
WORKDIR /app
ENV NODE_ENV=development
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]
