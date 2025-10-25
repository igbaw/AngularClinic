Write-Host "=== Deploy checklist (Option A) ===" -ForegroundColor Cyan

Write-Host "Render (Backend) env vars:" -ForegroundColor Yellow
"  PORT=8080"
"  PRISMA_PROVIDER=postgresql"
"  DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
"  AUTH_SECRET=<generate-random>"
"  COOKIE_NAME=clinic_sess"
"  COOKIE_SECURE=true"
"  CORS_ORIGIN=https://<your-pages>.pages.dev,https://<your-domain>"

Write-Host "Cloudflare Pages env vars:" -ForegroundColor Yellow
"  BACKEND_URL=https://<your-render-service>.onrender.com"

Write-Host "Cloudflare Pages settings:" -ForegroundColor Yellow
"  Project root: WebApp/Frontend"
"  Build command: npm ci && npm run build"
"  Output dir:   dist/coreui-free-angular-admin-template"

Write-Host "After deploy: test https://<pages-url>/api/health via the proxy." -ForegroundColor Cyan