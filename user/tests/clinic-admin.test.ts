import { describe, expect, it } from "bun:test";
import {
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
  uuidTemplate,
} from "./utils/data";
import { GET, POST } from "./utils/request";

describe("GET /clinic-admins", () => {
  it("returns all clinic admins if ok", async () => {
    const res = await GET("/clinic-admins", {
      headers: mockData.platformAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: [mockData.clinicAdmin],
    });
  });

  it("returns clinic admins within clinic if given clinicId", async () => {
    const res = await GET(
      "/clinic-admins?clinicId=00000000-0000-0000-0000-000000000000",
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: [],
    });
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await GET("/clinic-admins");
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await GET("/clinic-admins", {
      headers: mockData.clinicAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await GET("/clinic-admins", {
      headers: mockData.doctorAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await GET("/clinic-admins", {
      headers: mockData.patientAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("GET /clinic-admins/{id}", () => {
  it("returns clinic admin if ok", async () => {
    const res = await GET(`/clinic-admins/${mockData.clinicAdmin.id}`, {
      headers: mockData.platformAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: mockData.clinicAdmin,
    });
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await GET(`/clinic-admins/${mockData.clinicAdmin.id}`);
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await GET(`/clinic-admins/${mockData.clinicAdmin.id}`, {
      headers: mockData.clinicAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await GET(`/clinic-admins/${mockData.clinicAdmin.id}`, {
      headers: mockData.doctorAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await GET(`/clinic-admins/${mockData.clinicAdmin.id}`, {
      headers: mockData.patientAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if clinic admin does not exist", async () => {
    const res = await GET(
      "/clinic-admins/00000000-0000-0000-0000-000000000000",
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("POST /clinic-admins", () => {
  it("creates clinic admin if ok", async () => {
    const res = await POST(
      "/clinic-admins",
      {
        email: "clinic-admin2@example.com",
        password: mockData.password,
        clinicId: mockData.clinic.id,
        firstName: "Alice",
        lastName: "Cooper",
      },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        id: uuidTemplate,
        role: "clinic_admin",
        email: "clinic-admin2@example.com",
        clinic: mockData.clinic,
        firstName: "Alice",
        lastName: "Cooper",
      },
    });
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await POST("/clinic-admins", {
      email: "clinic-admin3@example.com",
      password: mockData.password,
      clinicId: mockData.clinic.id,
      firstName: "Alice",
      lastName: "Cooper",
    });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await POST(
      "/clinic-admins",
      {
        email: "clinic-admin4@example.com",
        password: mockData.password,
        clinicId: mockData.clinic.id,
        firstName: "Alice",
        lastName: "Cooper",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await POST(
      "/clinic-admins",
      {
        email: "clinic-admin5@example.com",
        password: mockData.password,
        clinicId: mockData.clinic.id,
        firstName: "Alice",
        lastName: "Cooper",
      },
      { headers: mockData.doctorAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await POST(
      "/clinic-admins",
      {
        email: "clinic-admin6@example.com",
        password: mockData.password,
        clinicId: mockData.clinic.id,
        firstName: "Alice",
        lastName: "Cooper",
      },
      { headers: mockData.patientAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if clinic does not exist", async () => {
    const res = await POST(
      "/clinic-admins",
      {
        email: "clinic-admin7@example.com",
        password: mockData.password,
        clinicId: "00000000-0000-0000-0000-000000000000",
        firstName: "Alice",
        lastName: "Cooper",
      },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 409 if email has already been registered", async () => {
    const res = await POST(
      "/clinic-admins",
      {
        email: mockData.clinicAdmin.email,
        password: mockData.password,
        clinicId: mockData.clinic.id,
        firstName: "Alice",
        lastName: "Cooper",
      },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(409);
    expect(json).toEqual(errorResponseTemplate);
  });
});
