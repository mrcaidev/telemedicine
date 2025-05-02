import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { requestNotification } from "@/utils/request";
import {
  appointmentTemplate,
  errorResponseTemplate,
  mockData,
  successResponseTemplate,
} from "./utils/data";
import { GET, POST } from "./utils/request";

const requestNotificationPostSpy = spyOn(requestNotification, "post");

afterEach(() => {
  requestNotificationPostSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("GET /appointments", () => {
  it("returns future appointments", async () => {
    const res = await GET("/appointments", {
      headers: mockData.patientAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        appointments: expect.arrayContaining([appointmentTemplate]),
        nextCursor: null,
      },
    });
    // @ts-ignore
    for (const appointment of json.data.appointments) {
      expect(new Date(appointment.endAt).getTime()).toBeGreaterThan(Date.now());
    }
  });

  it("returns history appointments", async () => {
    const res = await GET("/appointments?sortOrder=desc", {
      headers: mockData.patientAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: {
        appointments: expect.arrayContaining([appointmentTemplate]),
        nextCursor: null,
      },
    });
    // @ts-ignore
    for (const appointment of json.data.appointments) {
      expect(new Date(appointment.endAt).getTime()).toBeLessThan(Date.now());
    }
  });

  it("paginates", async () => {
    const res1 = await GET("/appointments?limit=1", {
      headers: mockData.patientAuthHeaders,
    });
    const json1 = await res1.json();
    expect(res1.status).toEqual(200);
    expect(json1).toEqual({
      ...successResponseTemplate,
      data: {
        appointments: expect.arrayContaining([appointmentTemplate]),
        nextCursor: expect.any(String),
      },
    });

    // @ts-ignore
    const cursor = json1.data.nextCursor as string;
    const res2 = await GET(`/appointments?limit=30&cursor=${cursor}`, {
      headers: mockData.patientAuthHeaders,
    });
    const json2 = await res2.json();
    expect(res2.status).toEqual(200);
    expect(json2).toEqual({
      ...successResponseTemplate,
      data: {
        appointments: expect.arrayContaining([appointmentTemplate]),
        nextCursor: null,
      },
    });

    // @ts-ignore
    const endAt1 = new Date(json1.data.appointments[0].endAt).getTime();
    // @ts-ignore
    const endAt2 = new Date(json2.data.appointments[0].endAt).getTime();
    expect(endAt1).toBeLessThan(endAt2);
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await GET("/appointments");
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is platform admin", async () => {
    const res = await GET("/appointments", {
      headers: mockData.platformAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await GET("/appointments", {
      headers: mockData.clinicAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("GET /appointments/{id}", () => {
  it("returns appointment if ok", async () => {
    const res = await GET(`/appointments/${mockData.appointment.id}`, {
      headers: mockData.patientAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(200);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: appointmentTemplate,
    });
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await GET(`/appointments/${mockData.appointment.id}`);
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is platform admin", async () => {
    const res = await GET(`/appointments/${mockData.appointment.id}`, {
      headers: mockData.platformAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await GET(`/appointments/${mockData.appointment.id}`, {
      headers: mockData.clinicAdminAuthHeaders,
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is irrelevant patient", async () => {
    const res = await GET(`/appointments/${mockData.appointment.id}`, {
      headers: {
        "X-User-Id": "00000000-0000-0000-0000-000000000000",
        "X-User-Role": "patient",
        "X-User-Email": "patient2@example.com",
      },
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is irrelevant doctor", async () => {
    const res = await GET(`/appointments/${mockData.appointment.id}`, {
      headers: {
        "X-User-Id": "00000000-0000-0000-0000-000000000000",
        "X-User-Role": "doctor",
        "X-User-Email": "doctor2@example.com",
      },
    });
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if appointment does not exist", async () => {
    const res = await GET(
      "/appointments/00000000-0000-0000-0000-000000000000",
      { headers: mockData.patientAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});

describe("POST /appointments", () => {
  it("creates appointment if ok", async () => {
    const emailId = crypto.randomUUID();
    requestNotificationPostSpy.mockResolvedValueOnce(emailId);
    const res = await POST(
      "/appointments",
      {
        availabilityId: mockData.doctorAvailability.id,
        remark: "",
      },
      { headers: mockData.patientAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(201);
    expect(json).toEqual({
      ...successResponseTemplate,
      data: { ...appointmentTemplate, remark: "" },
    });
    expect(requestNotificationPostSpy).toHaveBeenCalledTimes(1);
    expect(requestNotificationPostSpy).toHaveBeenNthCalledWith(
      1,
      "/scheduled-emails",
      {
        subject: expect.any(String),
        to: ["patient@example.com"],
        cc: [],
        bcc: [],
        content: expect.any(String),
        scheduledAt: expect.any(String),
      },
    );
  });

  it("returns 401 if user has not logged in", async () => {
    const res = await POST("/appointments", {
      availabilityId: mockData.doctorAvailability.id,
      remark: "",
    });
    const json = await res.json();
    expect(res.status).toEqual(401);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is platform admin", async () => {
    const res = await POST(
      "/appointments",
      {
        availabilityId: mockData.doctorAvailability.id,
        remark: "",
      },
      { headers: mockData.platformAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is clinic admin", async () => {
    const res = await POST(
      "/appointments",
      {
        availabilityId: mockData.doctorAvailability.id,
        remark: "",
      },
      { headers: mockData.clinicAdminAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 403 if user is doctor", async () => {
    const res = await POST(
      "/appointments",
      {
        availabilityId: mockData.doctorAvailability.id,
        remark: "",
      },
      { headers: mockData.doctorAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(403);
    expect(json).toEqual(errorResponseTemplate);
  });

  it("returns 404 if doctor availability does not exist", async () => {
    const res = await POST(
      "/appointments",
      {
        availabilityId: "00000000-0000-0000-0000-000000000000",
        remark: "",
      },
      { headers: mockData.patientAuthHeaders },
    );
    const json = await res.json();
    expect(res.status).toEqual(404);
    expect(json).toEqual(errorResponseTemplate);
  });
});
