import { describe, expect, it } from "bun:test";
import app from "@/index";

describe("GET /livez", () => {
  it("returns 200", async () => {
    const res = await app.request("/livez");
    expect(res.status).toEqual(200);
  });
});

describe("GET /readyz", () => {
  it("returns 200", async () => {
    const res = await app.request("/readyz");
    expect(res.status).toEqual(200);
  });
});
