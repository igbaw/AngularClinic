// Quick API test script
import { createApp } from "./src/app";

const app = createApp();

// Test health endpoint
const healthRes = await app.handle(new Request("http://localhost/api/health"));
console.log("Health:", await healthRes.text());

// Test login
const loginRes = await app.handle(
  new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@example.com",
      password: "ChangeMe123!",
    }),
  })
);

console.log("Login status:", loginRes.status);
const loginData = await loginRes.text();
console.log("Login response:", loginData);

if (loginRes.status === 200) {
  console.log("\n✅ Login successful!");
  const cookies = loginRes.headers.get("set-cookie");
  console.log("Cookie:", cookies);
} else {
  console.error("\n❌ Login failed");
}
