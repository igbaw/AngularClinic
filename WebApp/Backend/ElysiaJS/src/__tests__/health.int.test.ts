import { describe, it, expect } from "bun:test";
import { createApp } from "../app";

describe("health", () => {
  it("returns ok", async () => {
    const app = createApp();
    const res = await app.handle(new Request("http://localhost/api/health"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: "ok" });
  });
});
