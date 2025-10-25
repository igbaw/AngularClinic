# Project Structure & Patterns

Pattern: modular by domain with clear layering.

- src/
  - app.ts — bootstrap Elysia, plugins (CORS, cookies, body limits, static in dev)
  - routes.ts — mounts all module routers under /api
  - config/ — env loader, constants (upload limits, CORS)
  - auth/ — better-auth init, guards, rbac helpers
  - db/ — prisma client, seed helpers
  - modules/
    - patients/
      - index.ts (router)
      - controller.ts (thin HTTP handlers)
      - service.ts (business logic)
      - repo.ts (Prisma queries)
      - schema.ts (request/response validation with t.*)
      - dto.ts (shared types)
      - permissions.ts (module-level RBAC checks)
      - __tests__/ (unit + integration)
    - doctors/ …
    - appointments/ …
    - medical-records/ …
    - inventory/ …
    - prescriptions/ …
    - files/ …
  - utils/ — errors, pagination, date helpers
  - middlewares/ — common middlewares (error handler, request id)
- uploads/ — dev-only local storage
- prisma/ — schema & migrations

Key conventions
- Handlers call services only; services call repos only.
- Validation in schema.ts used by routes and services (reuse types).
- RBAC checks in permissions.ts; services receive current user.
- Errors via typed helpers (createError(code, message, details)).
- DTOs are the contract to FE; avoid leaking internal fields.

Sample tree
```text path=null start=null
src/
  app.ts
  routes.ts
  auth/
    session.ts
    guard.ts
    rbac.ts
  config/
    env.ts
    constants.ts
  db/
    prisma.ts
    seed.ts
  modules/
    patients/
      index.ts
      controller.ts
      service.ts
      repo.ts
      schema.ts
      dto.ts
      permissions.ts
      __tests__/
        patients.service.test.ts
        patients.routes.int.test.ts
  utils/
    errors.ts
    pagination.ts
```
