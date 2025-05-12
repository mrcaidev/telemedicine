import { describe, expect, it } from "bun:test";
import app from "@/index";
import { sign } from "hono/jwt";

const user = {
  id: crypto.randomUUID(),
  role: "patient",
  email: "patient@telemedicine.ink",
} as const;

describe("GET /auth", () => {
  it("sets X-User-* headers if ok", async () => {
    const token = await sign(user, Bun.env.JWT_SECRET);
    const res = await app.request("/auth", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(user.id);
    expect(res.headers.get("X-User-Role")).toEqual(user.role);
    expect(res.headers.get("X-User-Email")).toEqual(user.email);
  });

  it("returns 204 if no Authorization header", async () => {
    const res = await app.request("/auth");
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(null);
    expect(res.headers.get("X-User-Role")).toEqual(null);
    expect(res.headers.get("X-User-Email")).toEqual(null);
  });

  it("returns 204 if Authorization header is empty", async () => {
    const res = await app.request("/auth", {
      headers: { Authorization: "" },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(null);
    expect(res.headers.get("X-User-Role")).toEqual(null);
    expect(res.headers.get("X-User-Email")).toEqual(null);
  });

  it("returns 204 if token is empty", async () => {
    const res = await app.request("/auth", {
      headers: { Authorization: "Bearer " },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(null);
    expect(res.headers.get("X-User-Role")).toEqual(null);
    expect(res.headers.get("X-User-Email")).toEqual(null);
  });

  it("returns 204 if token is malformed", async () => {
    const res = await app.request("/auth", {
      headers: { Authorization: "Bearer invalid" },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(null);
    expect(res.headers.get("X-User-Role")).toEqual(null);
    expect(res.headers.get("X-User-Email")).toEqual(null);
  });

  it("returns 204 if token signature is invalid", async () => {
    const token = await sign(user, "invalid-jwt-secret");
    const res = await app.request("/auth", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(null);
    expect(res.headers.get("X-User-Role")).toEqual(null);
    expect(res.headers.get("X-User-Email")).toEqual(null);
  });

  it("returns 204 if token has expired", async () => {
    const token = await sign({ ...user, exp: -1 }, Bun.env.JWT_SECRET);
    const res = await app.request("/auth", {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(null);
    expect(res.headers.get("X-User-Role")).toEqual(null);
    expect(res.headers.get("X-User-Email")).toEqual(null);
  });

  it("removes existing X-User-* headers if unauthenticated", async () => {
    const res = await app.request("/auth", {
      headers: {
        "X-User-Id": crypto.randomUUID(),
        "X-User-Role": "platform_admin",
        "X-User-Email": "platform-admin@telemedicine.ink",
      },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(null);
    expect(res.headers.get("X-User-Role")).toEqual(null);
    expect(res.headers.get("X-User-Email")).toEqual(null);
  });

  it("overwrites existing X-User-* headers if authenticated", async () => {
    const token = await sign(user, Bun.env.JWT_SECRET);
    const res = await app.request("/auth", {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-User-Id": crypto.randomUUID(),
        "X-User-Role": "platform_admin",
        "X-User-Email": "platform-admin@telemedicine.ink",
      },
    });
    expect(res.status).toEqual(204);
    expect(res.headers.get("X-User-Id")).toEqual(user.id);
    expect(res.headers.get("X-User-Role")).toEqual(user.role);
    expect(res.headers.get("X-User-Email")).toEqual(user.email);
  });
});
