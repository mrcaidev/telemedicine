import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import * as producer from "@/events/producer";
import { sql } from "bun";
import {
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
  uuidTemplate,
} from "./utils/data";
import { GET, POST } from "./utils/request";

const publishPatientCreatedEventSpy = spyOn(
  producer,
  "publishPatientCreatedEvent",
);

afterEach(() => {
  publishPatientCreatedEventSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("GET /patients/{id}", () => {
  it("returns patient if ok", async () => {
    const res = await GET(`/patients/${mockData.patient.id}`, {
      headers: mockData.doctorAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: mockData.patient,
    });
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await GET(`/patients/${mockData.patient.id}`);
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is platform admin", async () => {
    const res = await GET(`/patients/${mockData.patient.id}`, {
      headers: mockData.platformAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await GET(`/patients/${mockData.patient.id}`, {
      headers: mockData.clinicAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await GET(`/patients/${mockData.patient.id}`, {
      headers: mockData.patientAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if patient does not exist", async () => {
    const res = await GET("/patients/00000000-0000-0000-0000-000000000000", {
      headers: mockData.doctorAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("POST /patients", () => {
  it("creates patient if ok", async () => {
    await sql`
      insert into otp_verifications (email, otp) values
      ('patient2@example.com', '123456');
    `;
    publishPatientCreatedEventSpy.mockImplementationOnce(async () => {});
    const res = await POST("/patients", {
      email: "patient2@example.com",
      password: mockData.password,
      otp: "123456",
    });
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        id: uuidTemplate,
        role: "patient",
        email: "patient2@example.com",
        nickname: null,
        avatarUrl: null,
        gender: null,
        birthDate: null,
        token: expect.any(String),
      },
    });
    expect(publishPatientCreatedEventSpy).toHaveBeenCalledTimes(1);
    // @ts-ignore
    const { token, ...patient } = json.data;
    expect(publishPatientCreatedEventSpy).toHaveBeenNthCalledWith(1, patient);
  });

  it("returns 409 if email has already been registered", async () => {
    const res = await POST("/patients", {
      email: mockData.patient.email,
      password: mockData.password,
      otp: "123456",
    });
    const json = await res.json();
    expect(res.status).toEqual(409);
    expect(json).toEqual(errorResponseTemplate);
    expect(publishPatientCreatedEventSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 422 if no otp is sent", async () => {
    const res = await POST("/patients", {
      email: "patient3@example.com",
      password: mockData.password,
      otp: "123456",
    });
    const json = await res.json();
    expect(res.status).toEqual(422);
    expect(json).toEqual(errorResponseTemplate);
    expect(publishPatientCreatedEventSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 422 if otp expires", async () => {
    await sql`
      insert into otp_verifications (email, otp, sent_at) values
      ('patient4@example.com', '123456', ${new Date(Date.now() - 6 * 60 * 1000).toISOString()});
    `;
    const res = await POST("/patients", {
      email: "patient4@example.com",
      password: mockData.password,
      otp: "123456",
    });
    const json = await res.json();
    expect(res.status).toEqual(422);
    expect(json).toEqual(errorResponseTemplate);
    expect(publishPatientCreatedEventSpy).toHaveBeenCalledTimes(0);
  });

  it("returns 422 if otp is wrong", async () => {
    await sql`
      insert into otp_verifications (email, otp) values
      ('patient5@example.com', '123456');
    `;
    const res = await POST("/patients", {
      email: "patient5@example.com",
      password: mockData.password,
      otp: "654321",
    });
    const json = await res.json();
    expect(res.status).toEqual(422);
    expect(json).toEqual(errorResponseTemplate);
    expect(publishPatientCreatedEventSpy).toHaveBeenCalledTimes(0);
  });
});
