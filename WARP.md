# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AngularClinic is a full-stack clinic management system for ENT (Ear, Nose, Throat) clinics. The monorepo contains:
- **Frontend**: Angular 20 application with CoreUI 5 (WebApp/Frontend)
- **Backend**: ElysiaJS + Bun API server (WebApp/Backend/ElysiaJS)
- **Documentation**: Domain models and best practices (WebApp/Docs)

## Repository Structure

```
AngularClinic/
├── WebApp/
│   ├── Frontend/          # Angular 20 standalone app
│   ├── Backend/
│   │   └── ElysiaJS/      # Bun + ElysiaJS REST API
│   └── Docs/              # Data models and best practices
└── README.md
```

## Frontend (Angular 20)

### Location
`WebApp/Frontend/`

### Common Commands
- **Install dependencies**: `npm install`
- **Start dev server**: `npm start` (opens at http://localhost:4200)
- **Build for production**: `npm run build` → `dist/coreui-free-angular-admin-template`
- **Build dev (watch mode)**: `npm run watch`
- **Run all tests**: `npm test`
- **Run single test file**: `ng test --include=src/app/<path>/<file>.spec.ts`
- **Test with coverage (CI)**: `ng test --watch=false --code-coverage`
- **Generate component**: `ng generate component <name>`

### Requirements
- Node.js: `^20.19.0 || ^22.12.0 || ^24.0.0`
- npm: `>= 9`

### Architecture

#### Application Bootstrap
- Entry: `src/main.ts` → `src/app/app.config.ts`
- Configuration wires: router, HTTP client with interceptors, CoreUI modules, ngx-translate, animations
- Routing uses `HashLocationStrategy` (withHashLocation)

#### Routing & Layout
- Top-level routes: `src/app/app.routes.ts`
- Default route loads CoreUI `DefaultLayout` shell, protected by `authGuard`
- Feature areas are lazy-loaded: patients, doctors, appointments, medical-records, dashboard
- Navigation config: `src/app/layout/default-layout/_nav.ts`

#### Domain Structure
Features under `src/app/features/`:
- `patients/` - Patient management (CRUD, search, medical history)
- `doctors/` - Doctor profiles, schedules, availability
- `appointments/` - Appointment booking, calendar view, status management
- `medical-records/` - SOAP notes (Subjective, Objective, Assessment, Plan)

#### Core Services
Located in `src/app/core/`:
- **Guards**: `auth.guard.ts`, `role.guard.ts` - route protection
- **Interceptors**: 
  - `auth.interceptor.ts` - adds auth headers
  - `error.interceptor.ts` - global error handling
  - `mock-api.interceptor.ts` - development mock API (when `useMockApi: true`)
- **ApiService**: Typed HTTP wrapper using `environment.apiBaseUrl`
- **Models**: `core/models/` - TypeScript interfaces for patient, doctor, appointment, medical-record, auth, common

#### Mock API (Development)
- Controlled by `src/environments/environment.development.ts` (`useMockApi: true` by default)
- When enabled, `mock-api.interceptor.ts` intercepts requests to `environment.apiBaseUrl`
- Serves data from localStorage with optional seeding and artificial latency
- Production environment disables mock API

#### Internationalization
- ngx-translate configured in `app.config.ts`
- Translation files expected under `assets/i18n/*.json`
- Default/supported languages from environment config
- Language preference stored in localStorage

#### UI & Styling
- CoreUI components provide admin template shell (sidebar, header, navigation)
- Global styles: `src/scss/styles.scss`
- Static assets: `src/assets/`

#### TypeScript
- Strict compiler options enabled
- Path alias: `@docs-components/*` → `src/components/*`

#### Testing
- Unit tests: Karma + Jasmine + Chrome launcher
- Config: `karma.conf.js`
- Specs colocated with components (`*.spec.ts`)

### Angular Best Practices (from WebApp/Docs)

**Components**:
- Always use standalone components (default, don't set `standalone: true`)
- Use signals for state management
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush`
- Prefer inline templates for small components
- Prefer Reactive forms over Template-driven
- Use class bindings instead of `ngClass`, style bindings instead of `ngStyle`

**Templates**:
- Use native control flow (`@if`, `@for`, `@switch`) instead of structural directives
- Use async pipe to handle observables

**Services**:
- Single responsibility design
- Use `providedIn: 'root'` for singletons
- Use `inject()` function instead of constructor injection

**State**:
- Use signals for local component state
- Use `update` or `set` on signals, NOT `mutate`

**TypeScript**:
- Use strict type checking
- Avoid `any`, use `unknown` for uncertain types

**Other**:
- Implement lazy loading for feature routes
- Do NOT use `@HostBinding`/`@HostListener`, use `host` object in decorator
- Use `NgOptimizedImage` for static images (not for inline base64)

## Backend (ElysiaJS)

### Location
`WebApp/Backend/ElysiaJS/`

### Common Commands
- **Install dependencies**: `bun install`
- **Start dev server**: `bun run dev`
- **Start production**: `bun run start`
- **Run tests**: `bun test`
- **Generate Prisma client**: `bun run db:generate` (or `bunx prisma generate`)
- **Run migrations**: `bun run db:migrate`
- **Push schema to DB**: `bun run db:push`
- **Seed database**: `bun run db:seed`

### Requirements
- Bun runtime (latest)

### Architecture

#### Stack
- Runtime: Bun
- Framework: ElysiaJS (fast, type-safe)
- Auth: better-auth with HttpOnly secure cookie sessions (no localStorage tokens)
- ORM: Prisma
- Database: SQLite (dev), PostgreSQL (production)
- API base path: `/api`

#### Project Structure (Planned)
```
src/
├── app.ts              # Elysia init, plugins
├── routes.ts           # Route registration
├── config/
│   └── env.ts          # Environment config
├── auth/               # better-auth setup, guards
├── db/
│   ├── prisma.ts       # Prisma client
│   └── seed.ts         # Database seeding
├── modules/
│   ├── patients/
│   ├── doctors/
│   ├── appointments/
│   ├── medical-records/
│   ├── inventory/
│   ├── prescriptions/
│   └── files/
└── utils/
    └── errors.ts       # Error normalization
```

#### Authentication & Authorization
- Cookie-based session (no JWT in localStorage)
- Frontend must send credentials (`withCredentials: true`)
- Session bootstrap via `/api/auth/me`
- Users are admin-provisioned only (no public signup)
- Roles: ADMIN, DOCTOR, RECEPTIONIST
- Doctors can be linked to user accounts via `Doctor.userId`

#### Users Table Fields
- `email` (unique, lowercased)
- `passwordHash` (argon2)
- `fullName`
- `role` (ADMIN | DOCTOR | RECEPTIONIST)
- `active`
- `mustChangePassword`
- `lastLoginAt`

#### Validation & Errors
- Validation via Elysia route schemas (`t.*`)
- File uploads: max 5MB, MIME-type checked
- Normalized error responses: `{ code, message, details?, fieldErrors? }`
- Global error handler maps domain/validation errors to HTTP codes

#### Environment Variables (Draft)
- `PORT=8080`
- `DATABASE_URL` - SQLite: `file:./dev.db`, PostgreSQL: `postgres://user:pass@host:5432/db`
- `AUTH_SECRET` - change in production
- `COOKIE_NAME=clinic_sess`
- `COOKIE_SECURE=true` (production)
- `CORS_ORIGIN=http://localhost:4200` (frontend URL)
- `UPLOAD_MAX_MB=5`

#### Frontend Integration
- Cookie-based auth requires `withCredentials` on HTTP requests
- Bootstrap session via `/api/auth/me` on app init
- No access tokens to manage in frontend

## Domain Model

The system manages four core entities (see `WebApp/Docs/clinic_management_data_model.md`):

### Patient
- Full name, DOB, gender (Male/Female/Other)
- Contact: phone, email, address
- Insurance/BPJS ID
- UUID primary key

### Doctor
- Full name, specialization
- License number, SIP (practice permit)
- Contact info, availability (JSON schedule)
- UUID primary key

### Appointment
- Patient-Doctor relationship (foreign keys)
- Date/time, status (Pending/Confirmed/Cancelled)
- Optional notes
- UUID primary key

### Medical Record
- SOAP format:
  - Subjective (patient symptoms)
  - Objective (clinical observations)
  - Assessment (diagnosis/impressions)
  - Plan (treatment, next steps)
- Record number (unique)
- Attachments (imaging, files)
- UUID primary key

## Development Workflow

### Starting the Full Stack
1. **Backend**:
   ```powershell
   cd WebApp\Backend\ElysiaJS
   bun install
   bunx prisma generate
   bunx prisma migrate dev --name init
   bun run seed  # optional
   bun run dev
   ```

2. **Frontend**:
   ```powershell
   cd WebApp\Frontend
   npm install
   npm start
   ```

3. Access app at http://localhost:4200

### Development Mode
- Frontend: Mock API enabled by default (`environment.development.ts`)
- Backend: Can run independently or integrate with frontend by disabling mock API
- Hot reload enabled on both frontend and backend

### Production Build
- Frontend: `npm run build` → deploys `dist/` folder
- Backend: `bun run start` with production env vars
- Ensure `useMockApi: false` in frontend production environment
- Use PostgreSQL for backend database

## Testing Strategy

### Frontend
- Unit tests: Karma + Jasmine
- Colocated spec files (`*.spec.ts`)
- Run all: `npm test`
- Run single: `ng test --include=path/to/file.spec.ts`
- Coverage: `ng test --watch=false --code-coverage`

### Backend
- Test framework: Bun test
- Integration tests in `src/__tests__/`
- Run: `bun test`

## Key Files

- `WebApp/Frontend/WARP.md` - Detailed frontend-specific guidance
- `WebApp/Frontend/angular.json` - Angular CLI config
- `WebApp/Frontend/src/app/app.config.ts` - App bootstrap config
- `WebApp/Frontend/src/app/app.routes.ts` - Top-level routing
- `WebApp/Frontend/src/environments/` - Environment configs
- `WebApp/Backend/ElysiaJS/README.md` - Backend architecture notes
- `WebApp/Backend/ElysiaJS/package.json` - Backend scripts
- `WebApp/Docs/clinic_management_data_model.md` - Domain model spec
- `WebApp/Docs/angular-best-practices.md` - Angular coding standards

## Notes

- No linting configuration present in frontend (consider adding ESLint)
- Backend is in active development; refer to README for current implementation status
- Frontend uses hash-based routing (`/#/`) for compatibility
- All IDs use UUID format across the system
- Date handling: use date-fns library (already installed in frontend)
