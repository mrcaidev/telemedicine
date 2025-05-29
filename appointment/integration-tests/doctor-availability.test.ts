import { describe, expect, it } from "bun:test";
import type { DoctorAvailability } from "@/utils/types";
import {
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
  uuidTemplate,
} from "./utils/data";
import { DELETE, GET, POST } from "./utils/request";

describe("lifecycle", () => {
  it("list -> create -> list -> delete -> list", async () => {
    const res1 = await GET(`/doctor-availabilities/${mockData.doctors[0].id}`);
    const json1 = await res1.json();
    expect(res1.status).toEqual(200);
    expect(json1).toEqual({
      ...successResponseTemplate,
      data: [
        mockData.doctorAvailabilities[0],
        mockData.doctorAvailabilities[1],
      ],
    });

    const res2 = await POST(
      `/doctor-availabilities/${mockData.doctors[0].id}`,
      {
        weekday: 5,
        startTime: "14:00",
        endTime: "15:00",
      },
      { headers: mockData.clinicAdmins[0].authHeaders },
    );
    const json2 = (await res2.json()) as { data: DoctorAvailability };
    expect(res2.status).toEqual(201);
    expect(json2).toEqual({
      ...successResponseTemplate,
      data: expect.objectContaining({
        id: uuidTemplate,
        doctorId: mockData.doctors[0].id,
        weekday: 5,
        startTime: "14:00",
        endTime: "15:00",
        createdAt: expect.any(String),
      }),
    });

    const res3 = await GET(`/doctor-availabilities/${mockData.doctors[0].id}`);
    const json3 = await res3.json();
    expect(res3.status).toEqual(200);
    expect(json3).toEqual({
      ...successResponseTemplate,
      data: [
        mockData.doctorAvailabilities[0],
        mockData.doctorAvailabilities[1],
        json2.data,
      ],
    });

    const res4 = await DELETE(
      `/doctor-availabilities/${mockData.doctors[0].id}/${json2.data.id}`,
      { headers: mockData.clinicAdmins[0].authHeaders },
    );
    const json4 = await res4.json();
    expect(res4.status).toEqual(200);
    expect(json4).toEqual({ ...successResponseTemplate, data: null });

    const res5 = await GET(`/doctor-availabilities/${mockData.doctors[0].id}`);
    const json5 = await res5.json();
    expect(res5.status).toEqual(200);
    expect(json5).toEqual({
      ...successResponseTemplate,
      data: [
        mockData.doctorAvailabilities[0],
        mockData.doctorAvailabilities[1],
      ],
    });
  });
});

describe("POST /doctor-availabilities/{doctorId}", () => {
  it("returns 401 if not authenticated", async () => {
    const res = await POST(`/doctor-availabilities/${mockData.doctors[0].id}`, {
      weekday: 5,
      startTime: "14:00",
      endTime: "15:00",
    });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if not clinic admin", async () => {
    const res1 = await POST(
      `/doctor-availabilities/${mockData.doctors[0].id}`,
      {
        weekday: 5,
        startTime: "14:00",
        endTime: "15:00",
      },
      { headers: mockData.patients[0].authHeaders },
    );
    const json1 = await res1.json();
    expect(res1.status).toEqual(403);
    expect(json1).toEqual(errorResponseTemplate);

    const res2 = await POST(
      `/doctor-availabilities/${mockData.doctors[0].id}`,
      {
        weekday: 5,
        startTime: "14:00",
        endTime: "15:00",
      },
      { headers: mockData.doctors[0].authHeaders },
    );
    const json2 = await res2.json();
    expect(res2.status).toEqual(403);
    expect(json2).toEqual(errorResponseTemplate);

    const res3 = await POST(
      `/doctor-availabilities/${mockData.doctors[0].id}`,
      {
        weekday: 5,
        startTime: "14:00",
        endTime: "15:00",
      },
      { headers: mockData.platformAdmins[0].authHeaders },
    );
    const json3 = await res3.json();
    expect(res3.status).toEqual(403);
    expect(json3).toEqual(errorResponseTemplate);
  });

  it("returns 404 if doctor not found", async () => {
    const res = await POST(
      "/doctor-availabilities/00000000-0000-0000-0000-000000000000",
      {
        weekday: 5,
        startTime: "14:00",
        endTime: "15:00",
      },
      { headers: mockData.clinicAdmins[0].authHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 409 if availabilities overlap", async () => {
    const res1 = await POST(
      `/doctor-availabilities/${mockData.doctors[0].id}`,
      {
        weekday: 1,
        startTime: "08:30",
        endTime: "09:30",
      },
      { headers: mockData.clinicAdmins[0].authHeaders },
    );
    const json1 = await res1.json();
    expect(res1.status).toEqual(409);
    expect(json1).toEqual(errorResponseTemplate);

    const res2 = await POST(
      `/doctor-availabilities/${mockData.doctors[0].id}`,
      {
        weekday: 1,
        startTime: "09:30",
        endTime: "10:30",
      },
      { headers: mockData.clinicAdmins[0].authHeaders },
    );
    const json2 = await res2.json();
    expect(res2.status).toEqual(409);
    expect(json2).toEqual(errorResponseTemplate);

    const res3 = await POST(
      `/doctor-availabilities/${mockData.doctors[0].id}`,
      {
        weekday: 1,
        startTime: "08:00",
        endTime: "11:00",
      },
      { headers: mockData.clinicAdmins[0].authHeaders },
    );
    const json3 = await res3.json();
    expect(res3.status).toEqual(409);
    expect(json3).toEqual(errorResponseTemplate);

    const res4 = await POST(
      `/doctor-availabilities/${mockData.doctors[0].id}`,
      {
        weekday: 1,
        startTime: "09:15",
        endTime: "09:45",
      },
      { headers: mockData.clinicAdmins[0].authHeaders },
    );
    const json4 = await res4.json();
    expect(res4.status).toEqual(409);
    expect(json4).toEqual(errorResponseTemplate);
  });
});

describe("DELETE /doctor-availabilities/{doctorId}/{id}", () => {
  it("returns 401 if not authenticated", async () => {
    const res = await DELETE(
      `/doctor-availabilities/${mockData.doctors[0].id}/${mockData.doctorAvailabilities[0].id}`,
    );
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if not clinic admin", async () => {
    const res1 = await DELETE(
      `/doctor-availabilities/${mockData.doctors[0].id}/${mockData.doctorAvailabilities[0].id}`,
      { headers: mockData.patients[0].authHeaders },
    );
    const json1 = await res1.json();
    expect(res1.status).toEqual(403);
    expect(json1).toEqual(errorResponseTemplate);

    const res2 = await DELETE(
      `/doctor-availabilities/${mockData.doctors[0].id}/${mockData.doctorAvailabilities[0].id}`,
      { headers: mockData.doctors[0].authHeaders },
    );
    const json2 = await res2.json();
    expect(res2.status).toEqual(403);
    expect(json2).toEqual(errorResponseTemplate);

    const res3 = await DELETE(
      `/doctor-availabilities/${mockData.doctors[0].id}/${mockData.doctorAvailabilities[0].id}`,
      { headers: mockData.platformAdmins[0].authHeaders },
    );
    const json3 = await res3.json();
    expect(res3.status).toEqual(403);
    expect(json3).toEqual(errorResponseTemplate);
  });

  it("returns 404 if doctor availability not found", async () => {
    const res = await DELETE(
      `/doctor-availabilities/${mockData.doctors[0].id}/00000000-0000-0000-0000-000000000000`,
      { headers: mockData.clinicAdmins[0].authHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});
