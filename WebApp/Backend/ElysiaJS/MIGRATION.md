# Migration Plan — SQLite → PostgreSQL

Goals
- Use SQLite for rapid local dev; switch to Postgres before production.

Compatibility
- Prefer UUID for IDs; JSON for Doctor.availability; Decimal for prices.
- Avoid SQLite-only features; keep schema Postgres-friendly.

Steps to run locally (SQLite)
1) Set PRISMA_PROVIDER=sqlite and DATABASE_URL="file:./dev.db"
2) bunx prisma migrate dev --name init
3) bunx prisma generate

Switching to Postgres
1) Provision a Postgres instance (managed or self-hosted).
2) Set PRISMA_PROVIDER=postgresql and DATABASE_URL=postgres://...
3) Create a new migration: bunx prisma migrate deploy (if migrations are already generated) or bunx prisma migrate diff to verify.
4) Run prisma migrate deploy on the server.
5) Seed essential data (admin user).

Data migration (if needed)
- For existing dev data, use prisma migrate reset and re-seed; for real data, export/import via scripts.

Env & Ops
- Ensure COOKIE_SECURE=true, SameSite=None if cross-site; set CORS_ORIGIN appropriately.
- Backups: enable scheduled backups on Postgres.
