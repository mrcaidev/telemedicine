import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { sql } from "bun";
import {
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
  uuidTemplate,
} from "./utils/data";
import { DELETE, GET, PATCH, POST } from "./utils/request";

describe("GET /clinic-admins", () => {
  it("returns all clinic admins if ok", async () => {
    const res = await GET("/clinic-admins", {
      headers: mockData.platformAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: expect.arrayContaining([mockData.clinicAdmin]),
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

describe("PATCH /clinic-admins/{id}", () => {
  const targetId = crypto.randomUUID();

  beforeAll(async () => {
    await sql`
      insert into accounts (id, role, email) values
      (${targetId}, 'clinic_admin', 'Kane_Hintz@gmail.com')
    `;
    await sql`
      insert into clinic_admin_profiles (id, first_name, last_name, clinic_id, created_by) values
      (${targetId}, 'Kane', 'Hintz', ${mockData.clinic.id}, ${mockData.platformAdmin.id})
    `;
  });

  afterAll(async () => {
    await sql`delete from clinic_admin_profiles where id = ${targetId}`;
    await sql`delete from accounts where id = ${targetId}`;
  });

  it("updates clinic admin", async () => {
    const res = await PATCH(
      `/clinic-admins/${targetId}`,
      {
        firstName: "Bob",
        lastName: "Marley",
      },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        id: targetId,
        role: "clinic_admin",
        email: "Kane_Hintz@gmail.com",
        clinic: mockData.clinic,
        firstName: "Bob",
        lastName: "Marley",
      },
    });
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await PATCH(`/clinic-admins/${targetId}`, {
      firstName: "Bob",
      lastName: "Marley",
    });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await PATCH(
      `/clinic-admins/${targetId}`,
      {
        firstName: "Bob",
        lastName: "Marley",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await PATCH(
      `/clinic-admins/${targetId}`,
      {
        firstName: "Bob",
        lastName: "Marley",
      },
      { headers: mockData.doctorAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await PATCH(
      `/clinic-admins/${targetId}`,
      {
        firstName: "Bob",
        lastName: "Marley",
      },
      { headers: mockData.patientAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if clinic admin does not exist", async () => {
    const res = await PATCH(
      "/clinic-admins/00000000-0000-0000-0000-000000000000",
      {
        firstName: "Bob",
        lastName: "Marley",
      },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("DELETE /clinic-admins/{id}", () => {
  const targetId = crypto.randomUUID();

  beforeAll(async () => {
    await sql`
      insert into accounts (id, role, email) values
      (${targetId}, 'clinic_admin', 'Kraig_Ritchie@gmail.com')
    `;
    await sql`
      insert into clinic_admin_profiles (id, first_name, last_name, clinic_id, created_by) values
      (${targetId}, 'Kraig', 'Ritchie', ${mockData.clinic.id}, ${mockData.platformAdmin.id})
    `;
  });

  afterAll(async () => {
    await sql`delete from clinic_admin_profiles where id = ${targetId}`;
    await sql`delete from accounts where id = ${targetId}`;
  });

  it("deletes clinic admin", async () => {
    const res = await DELETE(`/clinic-admins/${targetId}`, {
      headers: mockData.platformAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: null,
    });
  });

  it("returns 401 if user is not authenticated", async () => {
    const res = await DELETE(`/clinic-admins/${targetId}`);
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await DELETE(`/clinic-admins/${targetId}`, {
      headers: mockData.clinicAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await DELETE(`/clinic-admins/${targetId}`, {
      headers: mockData.doctorAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await DELETE(`/clinic-admins/${targetId}`, {
      headers: mockData.patientAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if clinic admin does not exist", async () => {
    const res = await DELETE(
      "/clinic-admins/00000000-0000-0000-0000-000000000000",
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});
