import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { sql } from "bun";
import {
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
  uuidTemplate,
} from "./utils/data";
import { DELETE, GET, PATCH, POST } from "./utils/request";

describe("GET /clinics", () => {
  it("returns clinics if ok", async () => {
    const res = await GET("/clinics");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: expect.arrayContaining([mockData.clinic]),
    });
  });
});

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
        createdAt: expect.any(String),
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

describe("PATCH /clinics/{id}", () => {
  const targetClinicId = crypto.randomUUID();

  beforeAll(async () => {
    await sql`
      insert into clinics (id, name, created_by) values
      (${targetClinicId}, 'sufficio', ${mockData.platformAdmin.id})
    `;
  });

  afterAll(async () => {
    await sql`
      delete from clinics
      where id = ${targetClinicId}
    `;
  });

  it("updates clinic", async () => {
    const res = await PATCH(
      `/clinics/${targetClinicId}`,
      { name: "cursus" },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        id: targetClinicId,
        name: "cursus",
        createdAt: expect.any(String),
      },
    });
  });

  it("returns 404 if clinic not found", async () => {
    const res = await PATCH(
      "/clinics/00000000-0000-0000-0000-000000000000",
      { name: "cursus" },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 401 if user is not authenticated", async () => {
    const res = await PATCH(`/clinics/${targetClinicId}`, { name: "cursus" });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await PATCH(
      `/clinics/${targetClinicId}`,
      { name: "cursus" },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await PATCH(
      `/clinics/${targetClinicId}`,
      { name: "cursus" },
      { headers: mockData.doctorAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await PATCH(
      `/clinics/${targetClinicId}`,
      { name: "cursus" },
      {
        headers: mockData.patientAuthHeaders,
      },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("DELETE /clinics/{id}", () => {
  const targetClinicId = crypto.randomUUID();

  beforeAll(async () => {
    await sql`
      insert into clinics (id, name, created_by) values
      (${targetClinicId}, 'voluptate', ${mockData.platformAdmin.id})
    `;
  });

  it("deletes clinic", async () => {
    const res = await DELETE(`/clinics/${targetClinicId}`, {
      headers: mockData.platformAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: null,
    });
  });

  it("returns 404 if clinic not found", async () => {
    const res = await DELETE("/clinics/00000000-0000-0000-0000-000000000000", {
      headers: mockData.platformAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 401 if user is not authenticated", async () => {
    const res = await DELETE(`/clinics/${targetClinicId}`);
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await DELETE(`/clinics/${targetClinicId}`, {
      headers: mockData.clinicAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await DELETE(`/clinics/${targetClinicId}`, {
      headers: mockData.doctorAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await DELETE(`/clinics/${targetClinicId}`, {
      headers: mockData.patientAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });
});
