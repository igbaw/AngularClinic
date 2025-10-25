# Architecture — Backend (ElysiaJS)

Overview
- Monolithic modular service on ElysiaJS (Bun).
- Auth via better-auth cookie sessions; RBAC roles: ADMIN, DOCTOR, RECEPTIONIST.
- Prisma as data layer; SQLite dev, PostgreSQL prod.
- OpenAPI spec to be generated (for FE sync) using an Elysia plugin.

Request lifecycle (high level)
1) Elysia bootstraps with config, CORS (credentials), body limits (5MB), and static uploads serving (dev).
2) better-auth registers login/logout/session; sets HttpOnly cookie on successful login.
3) Auth guard reads session from cookie, injects user in context; RBAC checks per route.
4) Routes call services (modules/*) which use Prisma.
5) Errors normalized to { code, message, details } with proper status codes.

CORS & cookies
- CORS: allow origin from env CORS_ORIGIN; credentials: true; expose no sensitive headers.
- Cookies: HttpOnly, SameSite=Lax (dev) / None (if cross-site), Secure in production.

Validation
- Define request/response schemas using Elysia's built-in t.* (in route handlers) to validate at runtime and power OpenAPI.
- Common constraints: string trimming, email normalization (lowercase), UUID format, ISO dates, pagination bounds, 5MB body limit.
- File uploads: enforce size and MIME whitelist (image/*, application/pdf, text/plain).

Error handling
- Standard envelope: { code, message, details?, fieldErrors? }.
- Global error handler maps:
  - Validation → 400 (code: VALIDATION_ERROR, fieldErrors for per-field issues)
  - Auth → 401 (UNAUTHENTICATED); Forbidden → 403 (FORBIDDEN)
  - Not found → 404 (NOT_FOUND); Conflict/uniqueness → 409 (CONFLICT)
  - Unprocessable domain rules → 422 (UNPROCESSABLE); Unexpected → 500 (INTERNAL)
- Log correlation id per request (planned) to trace errors.

RBAC policy
- ADMIN: full access.
- DOCTOR: own appointments/medical records; read patients; restricted writes outside scope.
- RECEPTIONIST: patients, appointments, inventory; no medical record edits.

User lifecycle
- Provisioned by ADMIN only; fields: email (unique), fullName, role, active, mustChangePassword.
- Login updates lastLoginAt; if mustChangePassword=true, restrict to change-password endpoint.
- Doctor account linking via Doctor.userId (unique) binds permissions to a practitioner.

Modules (domains)
- patients, doctors, appointments, medical-records, inventory, prescriptions, files

OpenAPI
- Generate spec from route schemas; publish at /api/docs (dev only).

Security
- Password hashing (argon2 preferred).
- Rate limiting on auth endpoints (planned).
- Input validation with Elysia t.* schemas and type-safe handlers.
