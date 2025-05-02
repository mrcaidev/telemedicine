import { expect } from "bun:test";
import type { Doctor, DoctorAvailability, Patient } from "@/utils/types";

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
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
);

const mockPatient: Patient = {
  id: "8b41503d-92fd-4325-8032-df5dca24ab10",
  nickname: null,
  avatarUrl: null,
};

const mockDoctor: Doctor = {
  id: "4504abab-58c2-4fa7-ab05-ec5ac687625f",
  firstName: "David",
  lastName: "Tan",
  avatarUrl: null,
};

const mockDoctorAvailability: DoctorAvailability = {
  id: "103de33f-52e5-460d-a18f-a90b4837b982",
  weekday: 1,
  startTime: "09:00",
  endTime: "10:00",
};

export const mockData = {
  platformAdminAuthHeaders: {
    "X-User-Id": "e4c315ef-0f8d-4456-a69e-c971b5e25ebc",
    "X-User-Role": "platform_admin",
    "X-User-Email": "platform-admin@example.com",
  },
  clinicAdminAuthHeaders: {
    "X-User-Id": "b7aa316d-d7ef-4b35-8075-a5440922b030",
    "X-User-Role": "clinic_admin",
    "X-User-Email": "clinic-admin@example.com",
  },
  doctor: mockDoctor,
  doctorAuthHeaders: {
    "X-User-Id": mockDoctor.id,
    "X-User-Role": "doctor",
    "X-User-Email": "doctor@example.com",
  },
  patient: mockPatient,
  patientAuthHeaders: {
    "X-User-Id": mockPatient.id,
    "X-User-Role": "patient",
    "X-User-Email": "patient@example.com",
  },
  doctorAvailability: mockDoctorAvailability,
};
