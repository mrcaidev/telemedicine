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
  consumeMedicalRecordCreatedEvent,
  consumePatientCreatedEvent,
  consumePatientUpdatedEvent,
} from "@/events/consumer";
import { producer } from "@/events/kafka";
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
    } else if (topic === "MedicalRecordCreated") {
      await consumeMedicalRecordCreatedEvent(event);
    }
    return [];
  },
);

const fetchSpy = spyOn(global, "fetch");

afterEach(() => {
  producerSendSpy.mockClear();
  fetchSpy.mockClear();
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
            createdAt: "2000-01-01T00:00:00.000Z",
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
            createdAt: "2000-01-01T00:00:00.000Z",
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
            createdAt: "2000-01-01T00:00:00.000Z",
            firstName: "Clyde",
            lastName: "Dach",
            avatarUrl: null,
            gender: "female",
            description: "Dr. Dach is a highly experienced physician.",
            specialties: ["cardiology", "neurology"],
            clinic: {
              id: "f616adf8-2553-4f1c-80bb-1d8c31ad021b",
              name: "Health Clinic",
              createdAt: "2000-01-01T00:00:00.000Z",
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
            createdAt: "2000-01-01T00:00:00.000Z",
            firstName: "Vanessa",
            lastName: "Bailey",
            avatarUrl: null,
            gender: "female",
            description: "Dr. Bailey is a highly experienced physician.",
            specialties: ["cardiology", "neurology"],
            clinic: {
              id: "f616adf8-2553-4f1c-80bb-1d8c31ad021b",
              name: "Health Clinic",
              createdAt: "2000-01-01T00:00:00.000Z",
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
  it("AppointmentBooked -> MedicalRecordCreated -> AppointmentRescheduled -> AppointmentCancelled", async () => {
    await sql`
      insert into appointments (id, patient_id, doctor_id, start_at, end_at, remark, status, created_at) values
      ('b1d7b957-d516-41ac-864f-cae1cb599e58', ${mockData.patients[0].id}, ${mockData.doctors[0].id}, '2099-01-03T00:00:00.000Z', '2099-01-03T01:00:00.000Z', 'Statua sono deduco curiositas veritas', 'normal', '2099-01-01T00:00:00.000Z');
    `;

    fetchSpy.mockResolvedValueOnce(
      Response.json(
        { code: 0, message: "", data: "6463ea54-6cd7-49bc-9986-8de960fb6851" },
        { status: 201 },
      ),
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
            startAt: "2099-01-03T00:00:00.000Z",
            endAt: "2099-01-03T01:00:00.000Z",
            remark: "Statua sono deduco curiositas veritas",
            status: "normal",
            createdAt: "2099-01-01T00:00:00.000Z",
          }),
        },
      ],
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining("/scheduled-emails"),
      {
        method: "POST",
        body: JSON.stringify({
          subject: "Appointment Reminder for Tomorrow",
          to: [mockData.patients[0].email],
          cc: [],
          bcc: [],
          content: `Dear ${mockData.patients[0].nickname},\nThis is a friendly reminder that you have a scheduled appointment tomorrow.\nHere are the details of your appointment:\n- Date: Saturday, 3 January 2099\n- Time: 08:00 - 09:00\n- Doctor: ${mockData.doctors[0].firstName} ${mockData.doctors[0].lastName}\nIf you are no longer able to attend, please kindly cancel or reschedule your appointment on our platform as soon as possible.\nThank you for choosing Telemedicine. We look forward to seeing you soon.\nWarm regards,\nTelemedicine`,
          scheduledAt: "2099-01-02T00:00:00.000Z",
        }),
        headers: { "Content-Type": "application/json" },
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
      scheduled_at: new Date("2099-01-02T00:00:00.000Z"),
    });

    await producerSendSpy({
      topic: "MedicalRecordCreated",
      messages: [
        {
          value: JSON.stringify({
            recordId: "2520bd31-3d4c-4680-b7a7-95ac4d2fda07",
            appointmentId: "b1d7b957-d516-41ac-864f-cae1cb599e58",
          }),
        },
      ],
    });
    const [row15] = await sql`
      select *
      from appointments
      where id = 'b1d7b957-d516-41ac-864f-cae1cb599e58'
    `;
    expect(row15).toMatchObject({
      medical_record_id: "2520bd31-3d4c-4680-b7a7-95ac4d2fda07",
    });

    fetchSpy.mockResolvedValueOnce(
      Response.json({ code: 0, message: "", data: null }),
    );
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
            startAt: "2099-01-04T00:00:00.000Z",
            endAt: "2099-01-04T01:00:00.000Z",
            remark: "Statua sono deduco curiositas veritas",
            status: "to_be_rescheduled",
            createdAt: "2099-01-01T00:00:00.000Z",
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
    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(fetchSpy).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining(
        "/scheduled-emails/6463ea54-6cd7-49bc-9986-8de960fb6851",
      ),
      {
        method: "PATCH",
        body: JSON.stringify({ scheduledAt: "2099-01-03T00:00:00.000Z" }),
        headers: { "Content-Type": "application/json" },
      },
    );
    const [row2] = await sql`
      select *
      from appointment_reminder_emails
      where appointment_id = 'b1d7b957-d516-41ac-864f-cae1cb599e58'
    `;
    expect(row2).toEqual({
      appointment_id: "b1d7b957-d516-41ac-864f-cae1cb599e58",
      email_id: "6463ea54-6cd7-49bc-9986-8de960fb6851",
      scheduled_at: new Date("2099-01-03T00:00:00.000Z"),
    });

    fetchSpy.mockResolvedValueOnce(
      Response.json({ code: 0, message: "", data: null }),
    );
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
            startAt: "2099-01-04T00:00:00.000Z",
            endAt: "2099-01-04T01:00:00.000Z",
            remark: "Statua sono deduco curiositas veritas",
            status: "cancelled",
            createdAt: "2099-01-01T00:00:00.000Z",
          }),
        },
      ],
    });
    expect(fetchSpy).toHaveBeenCalledTimes(3);
    expect(fetchSpy).toHaveBeenNthCalledWith(
      3,
      expect.stringContaining(
        "/scheduled-emails/6463ea54-6cd7-49bc-9986-8de960fb6851",
      ),
      { method: "DELETE" },
    );

    await sql`
      delete from appointment_reminder_emails
      where appointment_id = 'b1d7b957-d516-41ac-864f-cae1cb599e58';

      delete from appointments
      where id = 'b1d7b957-d516-41ac-864f-cae1cb599e58';
    `.simple();
  });
});

describe("AppointmentBooked", () => {
  it("does not schedule email if time has passed", async () => {
    await sql`
      insert into appointments (id, patient_id, doctor_id, start_at, end_at, remark, status, created_at) values
      ('0aa42b6e-d3e5-445e-a6ca-4ebed4cdbb4d', ${mockData.patients[0].id}, ${mockData.doctors[0].id}, '2000-01-03T00:00:00.000Z', '2000-01-03T01:00:00.000Z', 'Quaerat laborum avaritia apparatus', 'normal', '2000-01-01T00:00:00.000Z');
    `;

    await producerSendSpy({
      topic: "AppointmentBooked",
      messages: [
        {
          value: JSON.stringify({
            id: "0aa42b6e-d3e5-445e-a6ca-4ebed4cdbb4d",
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
            startAt: "2000-01-03T00:00:00.000Z",
            endAt: "2000-01-03T01:00:00.000Z",
            remark: "Quaerat laborum avaritia apparatus",
            status: "normal",
            createdAt: "2000-01-01T00:00:00.000Z",
          }),
        },
      ],
    });
    expect(fetchSpy).toHaveBeenCalledTimes(0);
    const [row1] = await sql`
      select *
      from appointment_reminder_emails
      where appointment_id = '0aa42b6e-d3e5-445e-a6ca-4ebed4cdbb4d'
    `;
    expect(row1).toEqual(undefined);

    await sql`
      delete from appointments
      where id = '0aa42b6e-d3e5-445e-a6ca-4ebed4cdbb4d';
    `;
  });
});

describe("AppointmentRescheduled", () => {
  it("does not reschedule email if time has passed", async () => {
    await sql`
      insert into appointments (id, patient_id, doctor_id, start_at, end_at, remark, status, created_at) values
      ('5b5bc7ce-3d18-4305-9a63-7ad46894cd6a', ${mockData.patients[0].id}, ${mockData.doctors[0].id}, '2000-01-03T00:00:00.000Z', '2000-01-03T01:00:00.000Z', 'Statua cavus ambitus', 'normal', '2000-01-01T00:00:00.000Z');
    `;

    await producerSendSpy({
      topic: "AppointmentRescheduled",
      messages: [
        {
          value: JSON.stringify({
            id: "5b5bc7ce-3d18-4305-9a63-7ad46894cd6a",
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
            startAt: "2000-01-03T00:00:00.000Z",
            endAt: "2000-01-03T01:00:00.000Z",
            remark: "Statua cavus ambitus",
            status: "normal",
            createdAt: "2000-01-01T00:00:00.000Z",
          }),
        },
      ],
    });
    expect(fetchSpy).toHaveBeenCalledTimes(0);
    const [row1] = await sql`
      select *
      from appointment_reminder_emails
      where appointment_id = '5b5bc7ce-3d18-4305-9a63-7ad46894cd6a'
    `;
    expect(row1).toEqual(undefined);

    await sql`
      delete from appointments
      where id = '5b5bc7ce-3d18-4305-9a63-7ad46894cd6a';
    `;
  });
});

describe("AppointmentCancelled", () => {
  it("does not cancel email if time has passed", async () => {
    await sql`
      insert into appointments (id, patient_id, doctor_id, start_at, end_at, remark, status, created_at) values
      ('a47426c3-4d3c-42d5-8fbe-5b31ed683b66', ${mockData.patients[0].id}, ${mockData.doctors[0].id}, '2020-01-03T00:00:00.000Z', '2020-01-03T01:00:00.000Z', 'Valeo corrigo vobis', 'normal', '2020-01-01T00:00:00.000Z');
    `;

    await producerSendSpy({
      topic: "AppointmentCancelled",
      messages: [
        {
          value: JSON.stringify({
            id: "a47426c3-4d3c-42d5-8fbe-5b31ed683b66",
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
            startAt: "2020-01-03T00:00:00.000Z",
            endAt: "2020-01-03T01:00:00.000Z",
            remark: "Valeo corrigo vobis",
            status: "normal",
            createdAt: "2020-01-01T00:00:00.000Z",
          }),
        },
      ],
    });
    expect(fetchSpy).toHaveBeenCalledTimes(0);
    const [row1] = await sql`
      select *
      from appointment_reminder_emails
      where appointment_id = 'a47426c3-4d3c-42d5-8fbe-5b31ed683b66'
    `;
    expect(row1).toEqual(undefined);

    await sql`
      delete from appointments
      where id = 'a47426c3-4d3c-42d5-8fbe-5b31ed683b66';
    `;
  });
});
