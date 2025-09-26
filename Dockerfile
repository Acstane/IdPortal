FROM node:22.19.0 AS base
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json pnpm-lock.yaml ./

FROM base AS deps
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

FROM deps AS builder
COPY . .
RUN pnpm build

FROM node:22.19.0 AS production
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y gettext-base && \
    rm -rf /var/lib/apt/lists/*

RUN curl -sLf https://cli.doppler.com/install.sh | sh

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=deps /app/node_modules ./node_modules

COPY .env.tpl ./

EXPOSE 3000

CMD ["sh", "-c", "\
  doppler run -- sh -c 'envsubst < .env.tpl > .env && pnpm start'"]

FROM base AS development
WORKDIR /app
ENV NODE_ENV=development

RUN apt-get update && apt-get install -y gettext-base && \
    rm -rf /var/lib/apt/lists/*

RUN curl -sLf https://cli.doppler.com/install.sh | sh
RUN npm install -g pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["sh", "-c", "\
  doppler run -- sh -c 'envsubst < .env.tpl > .env && pnpm dev'"]