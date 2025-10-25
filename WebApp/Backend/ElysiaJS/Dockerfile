# syntax=docker/dockerfile:1
FROM oven/bun:1-debian

WORKDIR /app

# System build tools for native modules (argon2, better-sqlite3 if pulled transitively)
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

# Avoid installing optional deps (some packages include optional sqlite bindings)
ENV npm_config_optional=false

# Install deps & app
COPY package.json bunfig.toml tsconfig.json ./
COPY prisma ./prisma
COPY src ./src

RUN bun install \
 && bunx prisma generate

ENV NODE_ENV=production

EXPOSE 8080

# Apply migrations (or push on first deploy) then start the app
CMD ["bash","-lc","bunx prisma migrate deploy || bunx prisma db push; bun src/app.ts"]
