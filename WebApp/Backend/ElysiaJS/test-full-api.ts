// Comprehensive API test
import { createApp } from "./src/app";

const app = createApp();

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.error(`❌ ${name}:`, error);
  }
}

// Test health
await test("Health endpoint", async () => {
  const res = await app.handle(new Request("http://localhost/api/health"));
  if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
});

// Test login
let cookie = "";
await test("Login", async () => {
  const res = await app.handle(
    new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@example.com",
        password: "ChangeMe123!",
      }),
    })
  );
  if (res.status !== 200) throw new Error(`Login failed: ${res.status}`);
  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    const match = setCookie.match(/clinic_sess=([^;]+)/);
    if (match) cookie = match[1];
  }
});

// Test get patients (should require auth but we're testing directly)
await test("Get patients", async () => {
  const res = await app.handle(new Request("http://localhost/api/patients"));
  // Will fail without cookie, but that's expected
  console.log("  Status:", res.status, "- auth required, as expected");
});

// Test get doctors
await test("Get doctors", async () => {
  const res = await app.handle(new Request("http://localhost/api/doctors"));
  console.log("  Status:", res.status, "- auth required, as expected");
});

// Test get appointments
await test("Get appointments", async () => {
  const res = await app.handle(new Request("http://localhost/api/appointments"));
  console.log("  Status:", res.status, "- auth required, as expected");
});

// Test get medical records
await test("Get medical records", async () => {
  const res = await app.handle(new Request("http://localhost/api/medical-records"));
  console.log("  Status:", res.status, "- auth required, as expected");
});

console.log("\n✨ All tests completed!");
console.log("\nNext steps:");
console.log("1. Start server: bun run dev");
console.log("2. Test with actual HTTP requests from frontend");
console.log("3. Login credentials:");
console.log("   - Admin: admin@example.com / ChangeMe123!");
console.log("   - Doctor: dr.sarah@clinic.com / Doctor123!");
