import { expect } from "bun:test";

export const successResponseTemplate = {
  code: 0,
  message: "",
  data: expect.anything(),
};

export const errorResponseTemplate = {
  code: expect.any(Number),
  message: expect.any(String),
  data: null,
};

export const uuidTemplate = expect.stringMatching(
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
);

export const mockData = {
  patients: [
    {
      id: "0d342d37-fe96-45ff-97f8-629e40b823a6",
      email: "Jasper_Ferry77@gmail.com",
      nickname: "Lennie_Bednar",
      avatarUrl: null,
      authHeaders: {
        "X-User-Id": "0d342d37-fe96-45ff-97f8-629e40b823a6",
        "X-User-Role": "patient",
        "X-User-Email": "Jasper_Ferry77@gmail.com",
      },
    },
    {
      id: "aacdc7fb-bdb6-449e-a6ce-03f335927d45",
      email: "Michale1@yahoo.com",
      nickname: "Harold_Senger",
      avatarUrl: null,
      authHeaders: {
        "X-User-Id": "aacdc7fb-bdb6-449e-a6ce-03f335927d45",
        "X-User-Role": "patient",
        "X-User-Email": "Michale1@yahoo.com",
      },
    },
    {
      id: "d568ab85-f95d-47ea-a9d2-cfd1314af840",
      email: "Danyka36@yahoo.com",
      nickname: "Berneice95",
      avatarUrl: null,
      authHeaders: {
        "X-User-Id": "d568ab85-f95d-47ea-a9d2-cfd1314af840",
        "X-User-Role": "patient",
        "X-User-Email": "Danyka36@yahoo.com",
      },
    },
  ],
  doctors: [
    {
      id: "757eb510-e8ed-4304-958d-b881232e2632",
      clinicId: "8c18f073-683e-42a7-9dc8-7805df80fd3b",
      firstName: "Ahmed",
      lastName: "Hyatt",
      avatarUrl: null,
      authHeaders: {
        "X-User-Id": "757eb510-e8ed-4304-958d-b881232e2632",
        "X-User-Role": "doctor",
        "X-User-Email": "Ernestine_Stiedemann@yahoo.com",
      },
    },
    {
      id: "38dddfc7-c956-4e2a-ba3a-6c4ef032914f",
      clinicId: "8c18f073-683e-42a7-9dc8-7805df80fd3b",
      firstName: "Marisa",
      lastName: "Quigley",
      avatarUrl: null,
      authHeaders: {
        "X-User-Id": "38dddfc7-c956-4e2a-ba3a-6c4ef032914f",
        "X-User-Role": "doctor",
        "X-User-Email": "Emie_DAmore97@hotmail.com",
      },
    },
    {
      id: "c1f28821-523b-439a-970f-ed613e10255e",
      clinicId: "9c81b1f4-f9a7-4b72-a962-e48ba9883724",
      firstName: "Cheyanne",
      lastName: "Hammes",
      avatarUrl: null,
      authHeaders: {
        "X-User-Id": "c1f28821-523b-439a-970f-ed613e10255e",
        "X-User-Role": "doctor",
        "X-User-Email": "Lea20@gmail.com",
      },
    },
  ],
  clinicAdmins: [
    {
      authHeaders: {
        "X-User-Id": "f322704d-94bc-4a98-9614-a5b80ac25ffa",
        "X-User-Role": "clinic_admin",
        "X-User-Email": "Isabell_Bins@yahoo.com",
      },
    },
    {
      authHeaders: {
        "X-User-Id": "6ecaf291-d8cb-403e-99b2-59fc177ee1df",
        "X-User-Role": "clinic_admin",
        "X-User-Email": "Erica.Hyatt@yahoo.com",
      },
    },
  ],
  platformAdmins: [
    {
      authHeaders: {
        "X-User-Id": "e22a94e9-68f3-4ea0-ba58-ee745a96aded",
        "X-User-Role": "platform_admin",
        "X-User-Email": "Miguel28@hotmail.com",
      },
    },
  ],
  doctorAvailabilities: [
    {
      id: "0043fdc0-f8e0-45f4-9bf1-feb8c7e55bb0",
      doctorId: "757eb510-e8ed-4304-958d-b881232e2632",
      weekday: 1,
      startTime: "09:00",
      endTime: "10:00",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "5ad20a94-dd14-4cc5-94d7-91a0d206aabc",
      doctorId: "757eb510-e8ed-4304-958d-b881232e2632",
      weekday: 2,
      startTime: "10:00",
      endTime: "11:00",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "1a60e3af-974d-4f0d-bfec-734639bf2fd2",
      doctorId: "38dddfc7-c956-4e2a-ba3a-6c4ef032914f",
      weekday: 3,
      startTime: "11:00",
      endTime: "12:00",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
    {
      id: "6e68ce63-6b11-4019-8105-81bafcb9c845",
      doctorId: "c1f28821-523b-439a-970f-ed613e10255e",
      weekday: 4,
      startTime: "12:00",
      endTime: "13:00",
      createdAt: "2025-01-01T00:00:00.000Z",
    },
  ],
  appointments: [
    {
      id: "ef9e8b01-9385-4338-8ad4-3d19f473b07f",
      patient: {
        id: "0d342d37-fe96-45ff-97f8-629e40b823a6",
        nickname: "Lennie_Bednar",
        avatarUrl: null,
      },
      doctor: {
        id: "757eb510-e8ed-4304-958d-b881232e2632",
        firstName: "Ahmed",
        lastName: "Hyatt",
        avatarUrl: null,
      },
      clinicId: "8c18f073-683e-42a7-9dc8-7805df80fd3b",
      startAt: "2025-01-06T01:00:00.000Z",
      endAt: "2025-01-06T02:00:00.000Z",
      remark: "appointment1",
      status: "normal",
      createdAt: "2025-01-04T01:00:00.000Z",
    },
    {
      id: "3785021e-d4c6-40ce-841b-4230bb417c93",
      patient: {
        id: "0d342d37-fe96-45ff-97f8-629e40b823a6",
        nickname: "Lennie_Bednar",
        avatarUrl: null,
      },
      doctor: {
        id: "38dddfc7-c956-4e2a-ba3a-6c4ef032914f",
        firstName: "Marisa",
        lastName: "Quigley",
        avatarUrl: null,
      },
      clinicId: "8c18f073-683e-42a7-9dc8-7805df80fd3b",
      startAt: "2030-12-04T03:00:00.000Z",
      endAt: "2030-12-04T04:00:00.000Z",
      remark: "appointment2",
      status: "cancelled",
      createdAt: "2030-12-02T03:00:00.000Z",
    },
    {
      id: "4ca2283e-a33f-466c-9c8b-63096fa8c53a",
      patient: {
        id: "aacdc7fb-bdb6-449e-a6ce-03f335927d45",
        nickname: "Harold_Senger",
        avatarUrl: null,
      },
      doctor: {
        id: "c1f28821-523b-439a-970f-ed613e10255e",
        firstName: "Cheyanne",
        lastName: "Hammes",
        avatarUrl: null,
      },
      clinicId: "9c81b1f4-f9a7-4b72-a962-e48ba9883724",
      startAt: "2030-12-05T04:00:00.000Z",
      endAt: "2030-12-05T05:00:00.000Z",
      remark: "appointment3",
      status: "to_be_rescheduled",
      createdAt: "2030-12-03T04:00:00.000Z",
    },
    {
      id: "7195ca4e-b20f-4017-b1a0-7b1752ef225f",
      patient: {
        id: "d568ab85-f95d-47ea-a9d2-cfd1314af840",
        nickname: "Berneice95",
        avatarUrl: null,
      },
      doctor: {
        id: "757eb510-e8ed-4304-958d-b881232e2632",
        firstName: "Ahmed",
        lastName: "Hyatt",
        avatarUrl: null,
      },
      clinicId: "8c18f073-683e-42a7-9dc8-7805df80fd3b",
      startAt: "2030-12-03T02:00:00.000Z",
      endAt: "2030-12-03T03:00:00.000Z",
      remark: "appointment4",
      status: "cancelled",
      createdAt: "2030-12-01T02:00:00.000Z",
    },
  ],
  appointmentReminderEmails: [
    {
      appointmentId: "ef9e8b01-9385-4338-8ad4-3d19f473b07f",
      emailId: "cf995bbc-158b-4bde-baed-27e8ad275a2e",
      scheduledAt: "2025-01-05T01:00:00.000Z",
    },
    {
      appointmentId: "3785021e-d4c6-40ce-841b-4230bb417c93",
      emailId: "d8d0d36d-ffaf-4854-baac-7cffed014698",
      scheduledAt: "2030-12-03T03:00:00.000Z",
    },
    {
      appointmentId: "4ca2283e-a33f-466c-9c8b-63096fa8c53a",
      emailId: "9e92310b-e4b9-47cb-9e24-c4e1a5c58562",
      scheduledAt: "2030-12-04T04:00:00.000Z",
    },
    {
      appointmentId: "7195ca4e-b20f-4017-b1a0-7b1752ef225f",
      emailId: "568c34eb-e08a-4017-9b60-23c77ac7837a",
      scheduledAt: "2030-12-02T02:00:00.000Z",
    },
  ],
} as const;
