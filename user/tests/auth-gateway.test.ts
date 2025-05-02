import { describe, expect, it } from "bun:test";
import { sign } from "hono/jwt";
import { GET } from "./utils/request";

describe("GET /auth-gateway", () => {
  it("sets auth headers if ok", async () => {
    const account = {
      id: crypto.randomUUID(),
      role: "patient",
      email: "me@example.com",
    };
    const token = await sign(account, Bun.env.JWT_SECRET);
    const res = await GET("/auth-gateway", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(account.id);
    expect(res.headers.get("X-User-Role")).toEqual(account.role);
    expect(res.headers.get("X-User-Email")).toEqual(account.email);
  });

  it("returns 204 if no Authorization header", async () => {
    const res = await GET("/auth-gateway");
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(null);
    expect(res.headers.get("X-User-Role")).toEqual(null);
    expect(res.headers.get("X-User-Email")).toEqual(null);
  });

  it("returns 204 if Authorization header is empty", async () => {
    const res = await GET("/auth-gateway", {
      headers: { Authorization: "" },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(null);
    expect(res.headers.get("X-User-Role")).toEqual(null);
    expect(res.headers.get("X-User-Email")).toEqual(null);
  });

  it("returns 204 if token is empty", async () => {
    const res = await GET("/auth-gateway", {
      headers: { Authorization: "Bearer " },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(null);
    expect(res.headers.get("X-User-Role")).toEqual(null);
    expect(res.headers.get("X-User-Email")).toEqual(null);
  });

  it("returns 204 if token is invalid", async () => {
    const res = await GET("/auth-gateway", {
      headers: { Authorization: "Bearer invalid-token" },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(null);
    expect(res.headers.get("X-User-Role")).toEqual(null);
    expect(res.headers.get("X-User-Email")).toEqual(null);
  });
});
