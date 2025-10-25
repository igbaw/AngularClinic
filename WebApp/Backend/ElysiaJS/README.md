# Backend — ElysiaJS + Prisma

## Overview

The AngularClinic backend is a type-safe REST API built with ElysiaJS and Bun runtime. It provides all CRUD operations for clinic management including patients, doctors, appointments, and medical records.

## Tech Stack

- **Runtime**: Bun (fast JavaScript runtime)
- **Framework**: ElysiaJS (type-safe, high-performance web framework)
- **Authentication**: Cookie-based session with Argon2 password hashing
- **ORM**: Prisma (type-safe database access)
- **Database**: SQLite (development), PostgreSQL (production)
- **API Base Path**: `/api`

## Prerequisites

- Bun runtime (latest version) - Install from https://bun.sh
- Node.js (optional, for some Prisma CLI commands)

## Quick Start

### First Time Setup

1. **Install dependencies**:
   ```powershell
   bun install
   ```

2. **Generate Prisma client**:
   ```powershell
   bun run db:generate
   ```

3. **Run database migrations**:
   ```powershell
   bun run db:migrate
   ```

4. **Seed database** (optional but recommended):
   ```powershell
   bun run db:seed
   ```

5. **Start development server**:
   ```powershell
   bun run dev
   ```

### Using the Startup Script

To run both backend and frontend together, use the startup script from the project root:
```powershell
cd ..\..\..
.\start-dev.ps1
```

Environment variables (draft)
- PORT=8080
- DATABASE_URL="file:./dev.db" (SQLite dev) or postgres://user:pass@host:5432/db
- AUTH_SECRET=change_me
- COOKIE_NAME=clinic_sess
- COOKIE_SECURE=true in production
- CORS_ORIGIN=http://localhost:4200 (frontend URL)
- UPLOAD_MAX_MB=5

Planned project structure
- src/
  - app.ts (Elysia init, plugins)
  - config/
  - auth/ (better-auth setup, guards)
  - db/ (prisma client, seed)
  - routes/ (index.ts, per-domain routers)
  - modules/
    - patients/
    - doctors/
    - appointments/
    - medical-records/
    - inventory/
    - prescriptions/
    - files/
  - utils/
- uploads/ (dev-only local storage)
- prisma/
  - schema.prisma
  - migrations/

## Server Information

- **Development URL**: http://localhost:8080
- **API Base**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/api/health

## Frontend Integration

### Cookie-Based Authentication
- Backend uses **HttpOnly secure cookies** for session management
- Frontend must send credentials with every request (`withCredentials: true`)
- Session bootstrap via `/api/auth/me` on app initialization
- No access tokens stored in localStorage (more secure)

### Connecting Frontend
1. Set `useMockApi: false` in `Frontend/src/environments/environment.development.ts`
2. Ensure `apiBaseUrl: 'http://localhost:8080/api'`
3. HTTP interceptor already configured for credentials
4. Start both servers (see startup script above)

Users and roles
- Users are admin-provisioned only (no public signup). Roles: ADMIN, DOCTOR, RECEPTIONIST.
- Doctors can be linked to a user account (Doctor.userId) to bind permissions.
- Fields: email (unique, lowercased), passwordHash (argon2), fullName, role, active, mustChangePassword, lastLoginAt.

Validation & errors
- Validation: Elysia route schemas (t.*) enforce and document payloads; file uploads capped at 5MB and MIME‑type checked.
- Errors: normalized JSON { code, message, details?, fieldErrors? }; global handler maps domain/validation errors to HTTP codes.

Further docs
- STRUCTURE.md — modules/layers, conventions, sample tree
- TESTING.md — bun test, DB strategy, integration patterns
- ARCHITECTURE.md, API.md, AUTH.md, DB.md, MIGRATION.md
