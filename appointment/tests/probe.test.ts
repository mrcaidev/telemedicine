import { describe, expect, it } from "bun:test";
import { GET } from "./utils/request";

describe("GET /livez", () => {
  it("returns 200", async () => {
    const res = await GET("/livez");
    expect(res.status).toEqual(200);
  });
});

describe("GET /readyz", () => {
  it("returns 200", async () => {
    const res = await GET("/readyz");
    expect(res.status).toEqual(200);
  });
});
