import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import { producer } from "@/events/kafka";
import type { FullAppointment } from "@/utils/types";
import { mockData, successResponseTemplate, uuidTemplate } from "./utils/data";
import { GET, POST } from "./utils/request";

const producerSendSpy = spyOn(producer, "send");
const fetchSpy = spyOn(global, "fetch");

afterEach(() => {
  producerSendSpy.mockClear();
  fetchSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("lifecycle", () => {
  it("list -> book -> request reschedule -> reschedule -> cancel", async () => {
    const res10 = await GET("/appointments", {
      headers: mockData.patients[0].authHeaders,
    });
    const json10 = await res10.json();
    expect(res10.status).toEqual(200);
    expect(json10).toEqual({
      ...successResponseTemplate,
      data: {
        appointments: [mockData.appointments[1]],
        nextCursor: null,
      },
    });

    producerSendSpy.mockResolvedValueOnce([]);
    const res20 = await POST(
      "/appointments",
      {
        availabilityId: mockData.doctorAvailabilities[1].id,
        remark: "hello",
      },
      { headers: mockData.patients[0].authHeaders },
    );
    const json20 = (await res20.json()) as { data: FullAppointment };
    expect(res20.status).toEqual(201);
    expect(json20).toEqual({
      ...successResponseTemplate,
      data: expect.objectContaining({
        id: uuidTemplate,
        patient: {
          id: mockData.patients[0].id,
          nickname: mockData.patients[0].nickname,
          avatarUrl: mockData.patients[0].avatarUrl,
        },
        doctor: {
          id: mockData.doctors[0].id,
          firstName: mockData.doctors[0].firstName,
          lastName: mockData.doctors[0].lastName,
          avatarUrl: mockData.doctors[0].avatarUrl,
        },
        clinicId: mockData.doctors[0].clinicId,
        startAt: expect.stringMatching(/T02:00:00.000Z$/),
        endAt: expect.stringMatching(/T03:00:00.000Z$/),
        remark: "hello",
        status: "normal",
        medicalRecordId: null,
        createdAt: expect.any(String),
      }),
    });
    expect(producerSendSpy).toHaveBeenCalledTimes(1);
    expect(producerSendSpy).toHaveBeenNthCalledWith(1, {
      topic: "AppointmentBooked",
      messages: [{ value: JSON.stringify(json20.data) }],
    });

    const res21 = await GET(`/appointments/${json20.data.id}`, {
      headers: mockData.patients[0].authHeaders,
    });
    const json21 = await res21.json();
    expect(res21.status).toEqual(200);
    expect(json21).toEqual({ ...successResponseTemplate, data: json20.data });

    const res22 = await GET("/appointments", {
      headers: mockData.patients[0].authHeaders,
    });
    const json22 = await res22.json();
    expect(res22.status).toEqual(200);
    expect(json22).toEqual({
      ...successResponseTemplate,
      data: {
        appointments: [json20.data, mockData.appointments[1]],
        nextCursor: null,
      },
    });

    producerSendSpy.mockResolvedValueOnce([]);
    const res30 = await POST(
      `/appointments/${json20.data.id}/request-reschedule`,
      {},
      { headers: mockData.doctors[0].authHeaders },
    );
    const json30 = (await res30.json()) as { data: FullAppointment };
    expect(res30.status).toEqual(200);
    expect(json30).toEqual({
      ...successResponseTemplate,
      data: { ...json20.data, status: "to_be_rescheduled" },
    });

    const res31 = await GET(`/appointments/${json30.data.id}`, {
      headers: mockData.patients[0].authHeaders,
    });
    const json31 = await res31.json();
    expect(res31.status).toEqual(200);
    expect(json31).toEqual({ ...successResponseTemplate, data: json30.data });

    const res32 = await GET("/appointments", {
      headers: mockData.patients[0].authHeaders,
    });
    const json32 = await res32.json();
    expect(res32.status).toEqual(200);
    expect(json32).toEqual({
      ...successResponseTemplate,
      data: {
        appointments: [json30.data, mockData.appointments[1]],
        nextCursor: null,
      },
    });

    const res33 = await GET(
      `/appointments?clinicId=${mockData.doctors[0].clinicId}&status=to_be_rescheduled`,
      { headers: mockData.clinicAdmins[0].authHeaders },
    );
    const json33 = await res33.json();
    expect(res33.status).toEqual(200);
    expect(json33).toEqual({
      ...successResponseTemplate,
      data: {
        appointments: [json30.data],
        nextCursor: null,
      },
    });

    producerSendSpy.mockResolvedValueOnce([]);
    fetchSpy.mockResolvedValueOnce(
      Response.json({
        code: 0,
        message: "",
        data: { clinic: { id: mockData.doctors[0].clinicId } },
      }),
    );
    const res40 = await POST(
      `/appointments/${json30.data.id}/reschedule`,
      { availabilityId: mockData.doctorAvailabilities[2].id },
      { headers: mockData.clinicAdmins[0].authHeaders },
    );
    const json40 = (await res40.json()) as { data: FullAppointment };
    expect(res40.status).toEqual(200);
    expect(json40).toEqual({
      ...successResponseTemplate,
      data: {
        ...json20.data,
        doctor: {
          id: mockData.doctors[1].id,
          firstName: mockData.doctors[1].firstName,
          lastName: mockData.doctors[1].lastName,
          avatarUrl: mockData.doctors[1].avatarUrl,
        },
        startAt: expect.stringMatching(/T03:00:00.000Z$/),
        endAt: expect.stringMatching(/T04:00:00.000Z$/),
        status: "normal",
      },
    });
    expect(producerSendSpy).toHaveBeenCalledTimes(2);
    expect(producerSendSpy).toHaveBeenNthCalledWith(2, {
      topic: "AppointmentRescheduled",
      messages: [{ value: JSON.stringify(json40.data) }],
    });

    const res41 = await GET(`/appointments/${json40.data.id}`, {
      headers: mockData.patients[0].authHeaders,
    });
    const json41 = await res41.json();
    expect(res41.status).toEqual(200);
    expect(json41).toEqual({ ...successResponseTemplate, data: json40.data });

    const res42 = await GET("/appointments", {
      headers: mockData.patients[0].authHeaders,
    });
    const json42 = await res42.json();
    expect(res42.status).toEqual(200);
    expect(json42).toEqual({
      ...successResponseTemplate,
      data: {
        appointments: [json40.data, mockData.appointments[1]],
        nextCursor: null,
      },
    });

    producerSendSpy.mockResolvedValueOnce([]);
    const res50 = await POST(
      `/appointments/${json40.data.id}/cancel`,
      {},
      { headers: mockData.patients[0].authHeaders },
    );
    const json50 = (await res50.json()) as { data: FullAppointment };
    expect(res50.status).toEqual(200);
    expect(json50).toEqual({
      ...successResponseTemplate,
      data: { ...json40.data, status: "cancelled" },
    });
    expect(producerSendSpy).toHaveBeenCalledTimes(3);
    expect(producerSendSpy).toHaveBeenNthCalledWith(3, {
      topic: "AppointmentCancelled",
      messages: [{ value: JSON.stringify(json50.data) }],
    });

    const res51 = await GET(`/appointments/${json50.data.id}`, {
      headers: mockData.patients[0].authHeaders,
    });
    const json51 = await res51.json();
    expect(res51.status).toEqual(200);
    expect(json51).toEqual({ ...successResponseTemplate, data: json50.data });

    const res52 = await GET("/appointments", {
      headers: mockData.patients[0].authHeaders,
    });
    const json52 = await res52.json();
    expect(res52.status).toEqual(200);
    expect(json52).toEqual({
      ...successResponseTemplate,
      data: {
        appointments: [json50.data, mockData.appointments[1]],
        nextCursor: null,
      },
    });
  });
});
