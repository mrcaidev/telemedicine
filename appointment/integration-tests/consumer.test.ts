import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from "bun:test";
import {
  consumeAppointmentBookedEvent,
  consumeAppointmentCancelledEvent,
  consumeAppointmentRescheduledEvent,
  consumeDoctorCreatedEvent,
  consumeDoctorUpdatedEvent,
  consumePatientCreatedEvent,
  consumePatientUpdatedEvent,
} from "@/events/consumer";
import { producer } from "@/events/kafka";
import { requestNotification } from "@/utils/request";
import { sql } from "bun";
import { mockData } from "./utils/data";

const producerSendSpy = spyOn(producer, "send").mockImplementation(
  async ({ topic, messages }) => {
    const event = JSON.parse(messages[0]!.value!.toString());
    if (topic === "PatientCreated") {
      await consumePatientCreatedEvent(event);
    } else if (topic === "PatientUpdated") {
      await consumePatientUpdatedEvent(event);
    } else if (topic === "DoctorCreated") {
      await consumeDoctorCreatedEvent(event);
    } else if (topic === "DoctorUpdated") {
      await consumeDoctorUpdatedEvent(event);
    } else if (topic === "AppointmentBooked") {
      await consumeAppointmentBookedEvent(event);
    } else if (topic === "AppointmentRescheduled") {
      await consumeAppointmentRescheduledEvent(event);
    } else if (topic === "AppointmentCancelled") {
      await consumeAppointmentCancelledEvent(event);
    }
    return [];
  },
);

const requestNotificationPostSpy = spyOn(requestNotification, "post");
const requestNotificationPatchSpy = spyOn(requestNotification, "patch");
const requestNotificationDeleteSpy = spyOn(requestNotification, "delete");

afterEach(() => {
  producerSendSpy.mockClear();
  requestNotificationPostSpy.mockClear();
  requestNotificationPatchSpy.mockClear();
  requestNotificationDeleteSpy.mockClear();
});

afterAll(() => {
  mock.restore();
});

describe("patient lifecycle", () => {
  it("PatientCreated -> PatientUpdated", async () => {
    await producerSendSpy({
      topic: "PatientCreated",
      messages: [
        {
          value: JSON.stringify({
            id: "77cac682-7ab4-4bb3-bb7c-4477ed95ef04",
            role: "patient",
            email: "Maxie.Murray89@gmail.com",
            createdAt: "2025-01-01T00:00:00.000Z",
            nickname: "Kiley_Kub93",
            avatarUrl: null,
            gender: "male",
            birthDate: "1990-01-01",
          }),
        },
      ],
    });
    const [row1] = await sql`
      select *
      from patients
      where id = '77cac682-7ab4-4bb3-bb7c-4477ed95ef04'
    `;
    expect(row1).toEqual({
      id: "77cac682-7ab4-4bb3-bb7c-4477ed95ef04",
      email: "Maxie.Murray89@gmail.com",
      nickname: "Kiley_Kub93",
      avatar_url: null,
    });

    await producerSendSpy({
      topic: "PatientUpdated",
      messages: [
        {
          value: JSON.stringify({
            id: "77cac682-7ab4-4bb3-bb7c-4477ed95ef04",
            role: "patient",
            email: "Maxie.Murray89@gmail.com",
            createdAt: "2025-01-01T00:00:00.000Z",
            nickname: "Stone2",
            avatarUrl: null,
            gender: "male",
            birthDate: "1990-01-01",
          }),
        },
      ],
    });
    const [row2] = await sql`
      select *
      from patients
      where id = '77cac682-7ab4-4bb3-bb7c-4477ed95ef04'
    `;
    expect(row2).toEqual({
      id: "77cac682-7ab4-4bb3-bb7c-4477ed95ef04",
      email: "Maxie.Murray89@gmail.com",
      nickname: "Stone2",
      avatar_url: null,
    });

    await sql`
      delete from patients
      where id = '77cac682-7ab4-4bb3-bb7c-4477ed95ef04'
    `;
  });
});

describe("doctor lifecycle", () => {
  it("DoctorCreated -> DoctorUpdated", async () => {
    await producerSendSpy({
      topic: "DoctorCreated",
      messages: [
        {
          value: JSON.stringify({
            id: "5a1503f3-eee2-4c65-9b44-e0ee7b5dbbec",
            role: "doctor",
            email: "Kelton_Roberts40@hotmail.com",
            createdAt: "2025-01-01T00:00:00.000Z",
            firstName: "Clyde",
            lastName: "Dach",
            avatarUrl: null,
            gender: "female",
            description: "Dr. Dach is a highly experienced physician.",
            specialties: ["cardiology", "neurology"],
            clinic: {
              id: "f616adf8-2553-4f1c-80bb-1d8c31ad021b",
              name: "Health Clinic",
              createdAt: "2025-01-01T00:00:00.000Z",
            },
          }),
        },
      ],
    });
    const [row1] = await sql`
      select *
      from doctors
      where id = '5a1503f3-eee2-4c65-9b44-e0ee7b5dbbec'
    `;
    expect(row1).toEqual({
      id: "5a1503f3-eee2-4c65-9b44-e0ee7b5dbbec",
      clinic_id: "f616adf8-2553-4f1c-80bb-1d8c31ad021b",
      first_name: "Clyde",
      last_name: "Dach",
      avatar_url: null,
    });

    await producerSendSpy({
      topic: "DoctorUpdated",
      messages: [
        {
          value: JSON.stringify({
            id: "5a1503f3-eee2-4c65-9b44-e0ee7b5dbbec",
            role: "doctor",
            email: "Kelton_Roberts40@hotmail.com",
            createdAt: "2025-01-01T00:00:00.000Z",
            firstName: "Vanessa",
            lastName: "Bailey",
            avatarUrl: null,
            gender: "female",
            description: "Dr. Bailey is a highly experienced physician.",
            specialties: ["cardiology", "neurology"],
            clinic: {
              id: "f616adf8-2553-4f1c-80bb-1d8c31ad021b",
              name: "Health Clinic",
              createdAt: "2025-01-01T00:00:00.000Z",
            },
          }),
        },
      ],
    });
    const [row2] = await sql`
      select *
      from doctors
      where id = '5a1503f3-eee2-4c65-9b44-e0ee7b5dbbec'
    `;
    expect(row2).toEqual({
      id: "5a1503f3-eee2-4c65-9b44-e0ee7b5dbbec",
      clinic_id: "f616adf8-2553-4f1c-80bb-1d8c31ad021b",
      first_name: "Vanessa",
      last_name: "Bailey",
      avatar_url: null,
    });

    await sql`
      delete from doctors
      where id = '5a1503f3-eee2-4c65-9b44-e0ee7b5dbbec'
    `;
  });
});

describe("appointment lifecycle", () => {
  it("AppointmentBooked -> AppointmentRescheduled -> AppointmentCancelled", async () => {
    await sql`
      insert into appointments (id, patient_id, doctor_id, start_at, end_at, remark, status, created_at) values
      ('b1d7b957-d516-41ac-864f-cae1cb599e58', ${mockData.patients[0].id}, ${mockData.doctors[0].id}, '2030-01-03T10:00:00.000Z', '2030-01-03T11:00:00.000Z', 'Statua sono deduco curiositas veritas', 'normal', '2025-01-01T00:00:00.000Z');
    `;

    requestNotificationPostSpy.mockResolvedValueOnce(
      "6463ea54-6cd7-49bc-9986-8de960fb6851",
    );
    await producerSendSpy({
      topic: "AppointmentBooked",
      messages: [
        {
          value: JSON.stringify({
            id: "b1d7b957-d516-41ac-864f-cae1cb599e58",
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
            startAt: "2030-01-03T10:00:00.000Z",
            endAt: "2030-01-03T11:00:00.000Z",
            remark: "Statua sono deduco curiositas veritas",
            status: "normal",
            createdAt: "2025-01-01T00:00:00.000Z",
          }),
        },
      ],
    });
    expect(requestNotificationPostSpy).toHaveBeenCalledTimes(1);
    expect(requestNotificationPostSpy).toHaveBeenNthCalledWith(
      1,
      "/scheduled-emails",
      {
        subject: expect.any(String),
        to: [mockData.patients[0].email],
        cc: [],
        bcc: [],
        content: expect.any(String),
        scheduledAt: "2030-01-02T10:00:00.000Z",
      },
    );
    const [row1] = await sql`
      select *
      from appointment_reminder_emails
      where appointment_id = 'b1d7b957-d516-41ac-864f-cae1cb599e58'
    `;
    expect(row1).toEqual({
      appointment_id: "b1d7b957-d516-41ac-864f-cae1cb599e58",
      email_id: "6463ea54-6cd7-49bc-9986-8de960fb6851",
      scheduled_at: new Date("2030-01-02T10:00:00.000Z"),
    });

    requestNotificationPatchSpy.mockResolvedValueOnce(null);
    await producerSendSpy({
      topic: "AppointmentRescheduled",
      messages: [
        {
          value: JSON.stringify({
            id: "b1d7b957-d516-41ac-864f-cae1cb599e58",
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
            startAt: "2030-01-04T10:00:00.000Z",
            endAt: "2030-01-04T11:00:00.000Z",
            remark: "Statua sono deduco curiositas veritas",
            status: "to_be_rescheduled",
            createdAt: "2025-01-01T00:00:00.000Z",
          }),
        },
      ],
    });
    expect(producerSendSpy).toHaveBeenLastCalledWith({
      topic: "EmailRequested",
      messages: [
        { value: expect.stringContaining('"to":["Jasper_Ferry77@gmail.com"]') },
      ],
    });
    expect(requestNotificationPatchSpy).toHaveBeenCalledTimes(1);
    expect(requestNotificationPatchSpy).toHaveBeenNthCalledWith(
      1,
      "/scheduled-emails/6463ea54-6cd7-49bc-9986-8de960fb6851",
      { scheduledAt: "2030-01-03T10:00:00.000Z" },
    );
    const [row2] = await sql`
      select *
      from appointment_reminder_emails
      where appointment_id = 'b1d7b957-d516-41ac-864f-cae1cb599e58'
    `;
    expect(row2).toEqual({
      appointment_id: "b1d7b957-d516-41ac-864f-cae1cb599e58",
      email_id: "6463ea54-6cd7-49bc-9986-8de960fb6851",
      scheduled_at: new Date("2030-01-03T10:00:00.000Z"),
    });

    requestNotificationDeleteSpy.mockResolvedValueOnce(null);
    await producerSendSpy({
      topic: "AppointmentCancelled",
      messages: [
        {
          value: JSON.stringify({
            id: "b1d7b957-d516-41ac-864f-cae1cb599e58",
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
            startAt: "2030-01-04T10:00:00.000Z",
            endAt: "2030-01-04T11:00:00.000Z",
            remark: "Statua sono deduco curiositas veritas",
            status: "cancelled",
            createdAt: "2025-01-01T00:00:00.000Z",
          }),
        },
      ],
    });
    expect(requestNotificationDeleteSpy).toHaveBeenCalledTimes(1);
    expect(requestNotificationDeleteSpy).toHaveBeenNthCalledWith(
      1,
      "/scheduled-emails/6463ea54-6cd7-49bc-9986-8de960fb6851",
    );
  });
});
