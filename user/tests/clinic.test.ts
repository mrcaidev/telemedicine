import { describe, expect, it } from "bun:test";
import {
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
  uuidTemplate,
} from "./utils/data";
import { GET, POST } from "./utils/request";

describe("GET /clinics/{id}", () => {
  it("returns clinic if ok", async () => {
    const res = await GET(`/clinics/${mockData.clinic.id}`);
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: mockData.clinic,
    });
  });

  it("returns 404 if clinic not found", async () => {
    const res = await GET("/clinics/00000000-0000-0000-0000-000000000000");
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("POST /clinics", () => {
  it("creates clinic if ok", async () => {
    const res = await POST(
      "/clinics",
      { name: "clinic2" },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        id: uuidTemplate,
        name: "clinic2",
      },
    });
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await POST("/clinics", { name: "clinic3" });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await POST(
      "/clinics",
      { name: "clinic4" },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await POST(
      "/clinics",
      { name: "clinic5" },
      { headers: mockData.doctorAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await POST(
      "/clinics",
      { name: "clinic6" },
      { headers: mockData.patientAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });
});
