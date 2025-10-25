# Testing Strategy

Tooling
- Runner: bun test (TypeScript supported)
- Structure: colocate tests under module in __tests__/; use .test.ts suffix
- Env: .env.test (DATABASE_URL=file:./test.db; PRISMA_PROVIDER=sqlite)

Types of tests
- Unit tests (fast): services, utils; mock repos (interfaces) or inject a stub Prisma client
- Integration tests: Elysia app via app.handle(new Request(url, {method, body})) — no network port needed
- Auth/RBAC tests: cover route guards and role restrictions

DB strategy for tests
- Use a dedicated SQLite database file per run (e.g., ./tmp/test-<timestamp>.db)
- Before suite: prisma db push (fast) then seed minimal data
- After suite: remove tmp DB file

Fixtures & helpers
- test/factories.ts for creating users, patients, doctors, etc.
- test/app.ts returns a fresh Elysia instance bound to a fresh Prisma client for isolation

Commands (examples)
```bash path=null start=null
bun test
bun test --coverage
```

Example integration test sketch
```ts path=null start=null
import { createApp } from "../../app";
import { createTestPrisma } from "../../db/test";

const prisma = await createTestPrisma();
const app = createApp({ prisma });

const res = await app.handle(new Request("http://localhost/api/patients", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ fullName: "John Doe", dateOfBirth: "1990-01-01", gender: "Male" })
}));

expect(res.status).toBe(200);
const body = await res.json();
expect(body.fullName).toBe("John Doe");
```

Coverage goals
- Unit: ≥80% for services and utils
- Integration: happy paths + key error paths for each module
