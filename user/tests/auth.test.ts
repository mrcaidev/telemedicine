import { describe, expect, it } from "bun:test";
import {
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
} from "./utils/data";
import { GET, POST } from "./utils/request";

describe("GET /auth/me", () => {
  it("returns platform admin if ok", async () => {
    const res = await GET("/auth/me", {
      headers: mockData.platformAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: mockData.platformAdmin,
    });
  });

  it("returns clinic admin if ok", async () => {
    const res = await GET("/auth/me", {
      headers: mockData.clinicAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: mockData.clinicAdmin,
    });
  });

  it("returns doctor if ok", async () => {
    const res = await GET("/auth/me", {
      headers: mockData.doctorAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: mockData.doctor,
    });
  });

  it("returns patient if ok", async () => {
    const res = await GET("/auth/me", {
      headers: mockData.patientAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: mockData.patient,
    });
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await GET("/auth/me");
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if user does not exist", async () => {
    const res = await GET("/auth/me", {
      headers: {
        "X-User-Id": "00000000-0000-0000-0000-000000000000",
        "X-User-Role": "patient",
        "X-User-Email": "nobody@example.com",
      },
    });
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("POST /auth/login", () => {
  it("returns platform admin and token if ok", async () => {
    const res = await POST("/auth/login", {
      email: mockData.platformAdmin.email,
      password: mockData.password,
    });
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        ...mockData.platformAdmin,
        token: expect.any(String),
      },
    });
  });

  it("returns clinic admin and token if ok", async () => {
    const res = await POST("/auth/login", {
      email: mockData.clinicAdmin.email,
      password: mockData.password,
    });
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        ...mockData.clinicAdmin,
        token: expect.any(String),
      },
    });
  });

  it("returns doctor and token if ok", async () => {
    const res = await POST("/auth/login", {
      email: mockData.doctor.email,
      password: mockData.password,
    });
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        ...mockData.doctor,
        token: expect.any(String),
      },
    });
  });

  it("returns patient and token if ok", async () => {
    const res = await POST("/auth/login", {
      email: mockData.patient.email,
      password: mockData.password,
    });
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        ...mockData.patient,
        token: expect.any(String),
      },
    });
  });

  it("returns 400 if email is invalid", async () => {
    const res = await POST("/auth/login", {
      email: "",
      password: mockData.password,
    });
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 400 if password is invalid", async () => {
    const res = await POST("/auth/login", {
      email: mockData.platformAdmin.email,
      password: "",
    });
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 401 if password is wrong", async () => {
    const res = await POST("/auth/login", {
      email: mockData.platformAdmin.email,
      password: "321@drowssap",
    });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if email does exist", async () => {
    const res = await POST("/auth/login", {
      email: "me@example.com",
      password: mockData.password,
    });
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("POST /auth/logout", () => {
  it("returns 200 if ok", async () => {
    const res = await POST(
      "/auth/logout",
      {},
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({ ...successResponseTemplate, data: null });
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await POST("/auth/logout", {});
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });
});
