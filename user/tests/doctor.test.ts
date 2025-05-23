import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import * as producer from "@/events/producer";
import { sql } from "bun";
import {
  doctorTemplate,
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
  uuidTemplate,
} from "./utils/data";
import { DELETE, GET, PATCH, POST } from "./utils/request";

const produceEventSpy = spyOn(producer, "produceEvent");

afterEach(() => {
  produceEventSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("GET /doctors", () => {
  it("returns doctors", async () => {
    const res = await GET("/doctors");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: expect.arrayContaining([doctorTemplate]),
        nextCursor: null,
      },
    });
  });

  it("paginates", async () => {
    const res1 = await GET("/doctors?limit=2");
    const json1 = await res1.json();
    expect(res1.status).toEqual(200);
    expect(json1).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: expect.arrayContaining([doctorTemplate]),
        nextCursor: expect.any(String),
      },
    });

    // @ts-ignore
    const cursor = json1.data.nextCursor as string;
    const res2 = await GET(`/doctors?limit=30&cursor=${cursor}`);
    const json2 = await res2.json();
    expect(res2.status).toEqual(200);
    expect(json2).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: expect.arrayContaining([doctorTemplate]),
        nextCursor: null,
      },
    });
  });
});

describe("GET /doctors/random", () => {
  it("returns random doctors", async () => {
    const res = await GET("/doctors/random");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: expect.arrayContaining([doctorTemplate]),
    });
  });

  it("limits number of doctors", async () => {
    const res = await GET("/doctors/random?limit=1");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: expect.arrayContaining([doctorTemplate]),
    });
    // @ts-ignore
    expect(json.data.length).toEqual(1);
  });
});

describe("GET /doctors/{id}", () => {
  it("returns doctor if ok", async () => {
    const res = await GET(`/doctors/${mockData.doctor.id}`);
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: mockData.doctor,
    });
  });

  it("returns 404 if doctor does not exist", async () => {
    const res = await GET("/doctors/00000000-0000-0000-0000-000000000000");
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("POST /doctors", () => {
  it("creates doctor if ok", async () => {
    produceEventSpy.mockResolvedValueOnce();
    const res = await POST(
      "/doctors",
      {
        email: "doctor2@example.com",
        password: mockData.password,
        firstName: "Tim",
        lastName: "Drake",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        id: uuidTemplate,
        role: "doctor",
        email: "doctor2@example.com",
        clinic: mockData.clinic,
        firstName: "Tim",
        lastName: "Drake",
        avatarUrl: null,
        gender: "male",
        description: "",
        specialties: [],
        createdAt: expect.any(String),
      },
    });
    expect(produceEventSpy).toHaveBeenCalledTimes(1);
    expect(produceEventSpy).toHaveBeenNthCalledWith(
      1,
      "DoctorCreated",
      // @ts-ignore
      json.data,
    );
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await POST("/doctors", {
      email: "doctor3@example.com",
      password: mockData.password,
      firstName: "Tim",
      lastName: "Drake",
    });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
    expect(produceEventSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 403 if user is platform admin", async () => {
    const res = await POST(
      "/doctors",
      {
        email: "doctor4@example.com",
        password: mockData.password,
        firstName: "Tim",
        lastName: "Drake",
      },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
    expect(produceEventSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await POST(
      "/doctors",
      {
        email: "doctor5@example.com",
        password: mockData.password,
        firstName: "Tim",
        lastName: "Drake",
      },
      { headers: mockData.doctorAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
    expect(produceEventSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 403 if user is patient", async () => {
    const res = await POST(
      "/doctors",
      {
        email: "doctor6@example.com",
        password: mockData.password,
        firstName: "Tim",
        lastName: "Drake",
      },
      { headers: mockData.patientAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
    expect(produceEventSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 409 if email has already been registered", async () => {
    const res = await POST(
      "/doctors",
      {
        email: mockData.doctor.email,
        password: mockData.password,
        firstName: "Tim",
        lastName: "Drake",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(409);
    expect(json).toEqual(errorResponseTemplate);
    expect(produceEventSpy).toHaveBeenCalledTimes(0);
  });
});

describe("GET /doctors/search", () => {
  it("returns two doctors if searching 'surgery'", async () => {
    const res = await GET("/doctors/search?q=surgery");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: [
          {
            id: "df9ffcca-1415-4837-95fa-83288e199d99",
            role: "doctor",
            email: "christa@gmail.com",
            clinic: mockData.clinic,
            firstName: "Christa",
            lastName: "Conn",
            avatarUrl: null,
            gender: "male",
            description: "Very good at Surgery",
            specialties: ["surgery"],
            createdAt: "2025-05-14T07:27:50.926Z",
          },
          {
            id: "04cd46f0-c785-48cc-bde1-898aac54c425",
            role: "doctor",
            email: "rory@gmail.com",
            clinic: mockData.clinic,
            firstName: "Rory",
            lastName: "Greenfelder",
            avatarUrl: null,
            gender: "male",
            description: "Good at both Cardiology and Surgery",
            specialties: ["cardiology"],
            createdAt: "2025-05-14T08:27:50.926Z",
          },
        ],
        nextCursor: null,
      },
    });
  });

  it("returns one doctor if searching 'cardiology'", async () => {
    const res = await GET("/doctors/search?q=cardiology");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: [
          {
            id: "04cd46f0-c785-48cc-bde1-898aac54c425",
            role: "doctor",
            email: "rory@gmail.com",
            clinic: mockData.clinic,
            firstName: "Rory",
            lastName: "Greenfelder",
            avatarUrl: null,
            gender: "male",
            description: "Good at both Cardiology and Surgery",
            specialties: ["cardiology"],
            createdAt: "2025-05-14T08:27:50.926Z",
          },
        ],
        nextCursor: null,
      },
    });
  });

  it("returns one doctor if searching 'david tan'", async () => {
    const res = await GET("/doctors/search?q=david%20tan");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: [mockData.doctor],
        nextCursor: null,
      },
    });
  });

  it("returns no doctor if searching 'neurology'", async () => {
    const res = await GET("/doctors/search?q=neurology");
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: { doctors: [], nextCursor: null },
    });
  });

  it("paginates", async () => {
    const res1 = await GET("/doctors/search?q=surgery&limit=1");
    const json1 = await res1.json();
    expect(res1.status).toEqual(200);
    expect(json1).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: [
          {
            id: "df9ffcca-1415-4837-95fa-83288e199d99",
            role: "doctor",
            email: "christa@gmail.com",
            clinic: mockData.clinic,
            firstName: "Christa",
            lastName: "Conn",
            avatarUrl: null,
            gender: "male",
            description: "Very good at Surgery",
            specialties: ["surgery"],
            createdAt: "2025-05-14T07:27:50.926Z",
          },
        ],
        nextCursor: expect.any(Number),
      },
    });
    // @ts-ignore
    console.log(json1.data.nextCursor);

    const res2 = await GET(
      // @ts-ignore
      `/doctors/search?q=surgery&cursor=${json1.data.nextCursor}`,
    );
    const json2 = await res2.json();
    expect(res2.status).toEqual(200);
    expect(json2).toEqual({
      ...successResponseTemplate,
      data: {
        doctors: [
          {
            id: "04cd46f0-c785-48cc-bde1-898aac54c425",
            role: "doctor",
            email: "rory@gmail.com",
            clinic: mockData.clinic,
            firstName: "Rory",
            lastName: "Greenfelder",
            avatarUrl: null,
            gender: "male",
            description: "Good at both Cardiology and Surgery",
            specialties: ["cardiology"],
            createdAt: "2025-05-14T08:27:50.926Z",
          },
        ],
        nextCursor: null,
      },
    });
  });
});

describe("PATCH /doctors/{id}", () => {
  const targetId = crypto.randomUUID();

  beforeAll(async () => {
    await sql`
      insert into accounts (id, role, email) values
      (${targetId}, 'doctor', 'Dawson_Wisoky@gmail.com');
    `;
    await sql`
      insert into doctor_profiles (id, clinic_id, first_name, last_name, created_by) values
      (${targetId}, ${mockData.clinic.id}, 'Dawson', 'Wisoky', ${mockData.clinicAdmin.id});
    `;
  });

  afterAll(async () => {
    await sql`delete from doctor_profiles where id = ${targetId}`;
    await sql`delete from accounts where id = ${targetId}`;
  });

  it("updates doctor", async () => {
    produceEventSpy.mockResolvedValueOnce();
    const res = await PATCH(
      `/doctors/${targetId}`,
      {
        firstName: "Tim",
        description: "Vox clam sol vulgaris demo una universe cicuta",
        gender: "female",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        id: targetId,
        role: "doctor",
        email: "Dawson_Wisoky@gmail.com",
        clinic: mockData.clinic,
        firstName: "Tim",
        lastName: "Wisoky",
        avatarUrl: null,
        description: "Vox clam sol vulgaris demo una universe cicuta",
        gender: "female",
        specialties: [],
        createdAt: expect.any(String),
      },
    });
    expect(produceEventSpy).toHaveBeenCalledTimes(1);
    expect(produceEventSpy).toHaveBeenNthCalledWith(1, "DoctorUpdated", {
      id: targetId,
      role: "doctor",
      email: "Dawson_Wisoky@gmail.com",
      clinic: mockData.clinic,
      firstName: "Tim",
      lastName: "Wisoky",
      avatarUrl: null,
      description: "Vox clam sol vulgaris demo una universe cicuta",
      gender: "female",
      specialties: [],
      createdAt: expect.any(String),
    });
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await PATCH(`/doctors/${targetId}`, {
      firstName: "Tim",
      description: "Vox clam sol vulgaris demo una universe cicuta",
      gender: "female",
    });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is platform admin", async () => {
    const res = await PATCH(
      `/doctors/${targetId}`,
      {
        firstName: "Tim",
        description: "Vox clam sol vulgaris demo una universe cicuta",
        gender: "female",
      },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await PATCH(
      `/doctors/${targetId}`,
      {
        firstName: "Tim",
        description: "Vox clam sol vulgaris demo una universe cicuta",
        gender: "female",
      },
      { headers: mockData.doctorAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await PATCH(
      `/doctors/${targetId}`,
      {
        firstName: "Tim",
        description: "Vox clam sol vulgaris demo una universe cicuta",
        gender: "female",
      },
      { headers: mockData.patientAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if doctor not found", async () => {
    const res = await PATCH(
      "/doctors/00000000-0000-0000-0000-000000000000",
      {
        firstName: "Tim",
        description: "Vox clam sol vulgaris demo una universe cicuta",
        gender: "female",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("DELETE /doctors/{id}", () => {
  const targetId = crypto.randomUUID();

  beforeAll(async () => {
    await sql`
      insert into accounts (id, role, email) values
      (${targetId}, 'doctor', 'Ben_Tay@gmail.com');
    `;
    await sql`
      insert into doctor_profiles (id, clinic_id, first_name, last_name, created_by) values
      (${targetId}, ${mockData.clinic.id}, 'Ben', 'Tay', ${mockData.clinicAdmin.id});
    `;
  });

  afterAll(async () => {
    await sql`delete from doctor_profiles where id = ${targetId}`;
    await sql`delete from accounts where id = ${targetId}`;
  });

  it("deletes doctor", async () => {
    produceEventSpy.mockResolvedValueOnce();
    const res = await DELETE(`/doctors/${targetId}`, {
      headers: mockData.clinicAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: null,
    });
    expect(produceEventSpy).toHaveBeenCalledTimes(1);
    expect(produceEventSpy).toHaveBeenNthCalledWith(1, "DoctorDeleted", {
      id: targetId,
    });
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await DELETE(`/doctors/${targetId}`);
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is platform admin", async () => {
    const res = await DELETE(`/doctors/${targetId}`, {
      headers: mockData.platformAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await DELETE(`/doctors/${targetId}`, {
      headers: mockData.doctorAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await DELETE(`/doctors/${targetId}`, {
      headers: mockData.patientAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if doctor not found", async () => {
    const res = await DELETE("/doctors/00000000-0000-0000-0000-000000000000", {
      headers: mockData.clinicAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});
