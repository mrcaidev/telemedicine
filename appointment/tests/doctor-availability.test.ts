import { describe, expect, it } from "bun:test";
import {
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
  uuidTemplate,
} from "./utils/data";
import { GET, POST } from "./utils/request";

describe("GET /doctor-availabilities/{doctorId}", () => {
  it("returns all availabilities of doctor if ok", async () => {
    const res = await GET(`/doctor-availabilities/${mockData.doctor.id}`);
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: [mockData.doctorAvailability],
    });
  });

  it("returns an empty list if doctor does not exist", async () => {
    const res = await GET(
      "/doctor-availabilities/00000000-0000-0000-0000-000000000000",
    );
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: [],
    });
  });

  it("returns 400 if id is invalid", async () => {
    const res = await GET("/doctor-availabilities/0");
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("POST /doctor-availabilities/{doctorId}", () => {
  it("creates availability if ok", async () => {
    const res = await POST(
      `/doctor-availabilities/${mockData.doctor.id}`,
      {
        weekday: 2,
        startTime: "13:00",
        endTime: "14:00",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        id: uuidTemplate,
        weekday: 2,
        startTime: "13:00",
        endTime: "14:00",
      },
    });
  });

  it("returns 400 if id is invalid", async () => {
    const res = await POST(
      "/doctor-availabilities/0",
      {
        weekday: 2,
        startTime: "13:00",
        endTime: "14:00",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(400);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await POST(`/doctor-availabilities/${mockData.doctor.id}`, {
      weekday: 2,
      startTime: "13:00",
      endTime: "14:00",
    });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is platform admin", async () => {
    const res = await POST(
      `/doctor-availabilities/${mockData.doctor.id}`,
      {
        weekday: 2,
        startTime: "13:00",
        endTime: "14:00",
      },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await POST(
      `/doctor-availabilities/${mockData.doctor.id}`,
      {
        weekday: 2,
        startTime: "13:00",
        endTime: "14:00",
      },
      { headers: mockData.doctorAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is patient", async () => {
    const res = await POST(
      `/doctor-availabilities/${mockData.doctor.id}`,
      {
        weekday: 2,
        startTime: "13:00",
        endTime: "14:00",
      },
      { headers: mockData.patientAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if doctor does not exist", async () => {
    const res = await POST(
      "/doctor-availabilities/00000000-0000-0000-0000-000000000000",
      {
        weekday: 2,
        startTime: "13:00",
        endTime: "14:00",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 409 if availability conflicts with existing one", async () => {
    const res1 = await POST(
      `/doctor-availabilities/${mockData.doctor.id}`,
      {
        weekday: 1,
        startTime: "09:30",
        endTime: "10:30",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json1 = await res1.json();
    expect(res1.status).toEqual(409);
    expect(json1).toEqual(errorResponseTemplate);

    const res2 = await POST(
      `/doctor-availabilities/${mockData.doctor.id}`,
      {
        weekday: 1,
        startTime: "08:30",
        endTime: "09:30",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json2 = await res2.json();
    expect(res2.status).toEqual(409);
    expect(json2).toEqual(errorResponseTemplate);

    const res3 = await POST(
      `/doctor-availabilities/${mockData.doctor.id}`,
      {
        weekday: 1,
        startTime: "08:00",
        endTime: "10:00",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json3 = await res3.json();
    expect(res3.status).toEqual(409);
    expect(json3).toEqual(errorResponseTemplate);

    const res4 = await POST(
      `/doctor-availabilities/${mockData.doctor.id}`,
      {
        weekday: 1,
        startTime: "09:01",
        endTime: "09:59",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json4 = await res4.json();
    expect(res4.status).toEqual(409);
    expect(json4).toEqual(errorResponseTemplate);
  });
});
