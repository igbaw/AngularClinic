# Deployment (Option A: Cloudflare Pages + Render + Neon)

This guide deploys:
- Frontend (Angular) on Cloudflare Pages, with a Pages Function proxy at `/api/*`.
- Backend (Bun + Elysia) on Render (Free plan) via Dockerfile.
- Database on Neon (Free Postgres).

## 1) Database (Neon)
- Create a Neon project (PostgreSQL). Copy the connection string.
- Ensure it ends with `?sslmode=require` (or add it).

## 2) Backend (Render)
We provide `render.yaml` and a Dockerfile at `WebApp/Backend/ElysiaJS/Dockerfile`.

Steps:
- Push this repo to GitHub/GitLab.
- In Render: New + Blueprint, point to this repo. Render will read `render.yaml`.
- In the service created (clinic-backend), set env vars:
  - PRISMA_PROVIDER=postgresql
  - DATABASE_URL=postgres connection string from Neon
  - AUTH_SECRET=generate a random string
  - COOKIE_NAME=clinic_sess
  - COOKIE_SECURE=true
  - CORS_ORIGIN=https://<your-pages>.pages.dev,https://<your-domain>
- First deploy will:
  - `bun install && prisma generate` during build
  - run `prisma migrate deploy || prisma db push` on start
- Health check: GET /api/health

Notes:
- The app listens on `0.0.0.0:8080` and sets CORS based on `CORS_ORIGIN`.
- Prisma schema is configured for PostgreSQL in `prisma/schema.prisma`.

## 3) Frontend (Cloudflare Pages)
- Create a new Pages project from this repo.
- Set Project root directory to `WebApp/Frontend`.
- Build command: `npm ci && npm run build`
- Output directory: `dist/coreui-free-angular-admin-template`
- Environment variable (Production & Preview):
  - BACKEND_URL=https://<your-render-service>.onrender.com
- The included Pages Function at `functions/api/[[path]].ts` proxies `/api/*` to `BACKEND_URL`. No frontend code changes needed (production `environment.ts` points to `/api`).
- After deploy, you’ll get a `*.pages.dev` URL. Add your custom domain if desired.

## 4) End-to-end check
- Open the Pages URL. The app should load and call `/api/*` via the proxy.
- Login and CRUD flows should work if DB is reachable.

## 5) Local development tips
- Frontend: `npm start` in `WebApp/Frontend` (serves at 4200).
- Backend: `bun run dev` in `WebApp/Backend/ElysiaJS` (default 8080). Use a local Postgres or Neon DB; update `.env` accordingly.

## 6) Environment variables (summary)
Backend on Render:
- PORT, PRISMA_PROVIDER, DATABASE_URL, AUTH_SECRET, COOKIE_NAME, COOKIE_SECURE, CORS_ORIGIN

Cloudflare Pages:
- BACKEND_URL (Render backend origin, no trailing slash)

## 7) Scripts in this repo
- `scripts/build-frontend.ps1` — builds Angular locally (optional).
- `scripts/print-deploy-checklist.ps1` — prints the env var checklist.

If you want me to wire a Render or Cloudflare API automation later, provide tokens and I can add scripts safely.