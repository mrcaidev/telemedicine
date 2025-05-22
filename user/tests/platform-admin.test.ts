import { describe, expect, it } from "bun:test";
import {
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
  uuidTemplate,
} from "./utils/data";
import { GET, POST } from "./utils/request";

describe("GET /platform-admins/{id}", () => {
  it("returns patient admin if ok", async () => {
    const res = await GET(`/platform-admins/${mockData.platformAdmin.id}`, {
      headers: mockData.superAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: mockData.platformAdmin,
    });
  });

  it("returns 401 if token is absent", async () => {
    const res = await GET(`/platform-admins/${mockData.platformAdmin.id}`);
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 401 if token is wrong", async () => {
    const res = await GET(`/platform-admins/${mockData.platformAdmin.id}`, {
      headers: { Authorization: "Bearer whatever" },
    });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if platform admin does not exist", async () => {
    const res = await GET(
      "/platform-admins/00000000-0000-0000-0000-000000000000",
      { headers: mockData.superAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("POST /platform-admins", () => {
  it("creates platform admin if ok", async () => {
    const res = await POST(
      "/platform-admins",
      {
        email: "platform-admin2@example.com",
        password: mockData.password,
      },
      { headers: mockData.superAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        id: uuidTemplate,
        role: "platform_admin",
        email: "platform-admin2@example.com",
        createdAt: expect.any(String),
      },
    });
  });

  it("returns 401 if token is absent", async () => {
    const res = await POST("/platform-admins", {
      email: "platform-admin3@example.com",
      password: mockData.password,
    });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 401 if token is wrong", async () => {
    const res = await POST(
      "/platform-admins",
      {
        email: "platform-admin3@example.com",
        password: mockData.password,
      },
      { headers: { Authorization: "Bearer whatever" } },
    );
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 409 if email has already been registered", async () => {
    const res = await POST(
      "/platform-admins",
      {
        email: mockData.platformAdmin.email,
        password: mockData.password,
      },
      { headers: mockData.superAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(409);
    expect(json).toEqual(errorResponseTemplate);
  });
});
