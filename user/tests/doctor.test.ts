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
import {
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
  uuidTemplate,
} from "./utils/data";
import { GET, POST } from "./utils/request";

const publishDoctorCreatedEventSpy = spyOn(
  producer,
  "publishDoctorCreatedEvent",
);

afterEach(() => {
  publishDoctorCreatedEventSpy.mockClear();
});

afterAll(() => {
  mock.restore();
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
    publishDoctorCreatedEventSpy.mockImplementationOnce(async () => {});
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
      },
    });
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(publishDoctorCreatedEventSpy).toHaveBeenNthCalledWith(1, json.data);
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
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(0);
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
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(0);
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
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(0);
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
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(0);
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
    expect(publishDoctorCreatedEventSpy).toHaveBeenCalledTimes(0);
  });
});
