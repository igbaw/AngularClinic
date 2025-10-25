# syntax=docker/dockerfile:1
FROM oven/bun:1-debian

WORKDIR /app

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
