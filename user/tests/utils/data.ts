import { expect } from "bun:test";
import type {
  Clinic,
  ClinicAdmin,
  Doctor,
  Patient,
  PlatformAdmin,
} from "@/utils/types";

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

export const doctorTemplate = expect.objectContaining({
  id: uuidTemplate,
  role: "doctor",
  email: expect.any(String),
  createdAt: expect.any(String),
  firstName: expect.any(String),
  lastName: expect.any(String),
  avatarUrl: null,
  description: expect.any(String),
  gender: expect.stringMatching(/male|female/),
  specialties: expect.any(Array),
  clinic: expect.objectContaining({
    id: uuidTemplate,
    name: expect.any(String),
  }),
});

const mockPlatformAdmin: PlatformAdmin = {
  id: "e4c315ef-0f8d-4456-a69e-c971b5e25ebc",
  role: "platform_admin",
  email: "platform-admin@example.com",
  createdAt: "2025-05-14T08:27:50.926Z",
};

const mockClinic: Clinic = {
  id: "f5dc8bbb-079b-41a0-8f52-8e25b5c71401",
  name: "Test Clinic",
  createdAt: "2025-05-14T08:27:50.926Z",
};

const mockClinicAdmin: ClinicAdmin = {
  id: "b7aa316d-d7ef-4b35-8075-a5440922b030",
  role: "clinic_admin",
  email: "clinic-admin@example.com",
  clinic: mockClinic,
  firstName: "Charlie",
  lastName: "Avery",
  createdAt: "2025-05-14T08:27:50.926Z",
};

const mockDoctor: Doctor = {
  id: "4504abab-58c2-4fa7-ab05-ec5ac687625f",
  role: "doctor",
  email: "doctor@example.com",
  clinic: mockClinic,
  firstName: "David",
  lastName: "Tan",
  avatarUrl: null,
  description: "",
  gender: "male",
  specialties: [],
  createdAt: "2025-05-14T06:27:50.926Z",
};

const mockPatient: Patient = {
  id: "8b41503d-92fd-4325-8032-df5dca24ab10",
  role: "patient",
  email: "patient@example.com",
  nickname: null,
  avatarUrl: null,
  gender: null,
  birthDate: null,
  createdAt: "2025-05-14T08:27:50.926Z",
};

export const mockData = {
  superAdminAuthHeaders: {
    Authorization: `Bearer ${Bun.env.SUPER_ADMIN_TOKEN}`,
  },
  platformAdmin: mockPlatformAdmin,
  platformAdminAuthHeaders: {
    "X-User-Id": mockPlatformAdmin.id,
    "X-User-Role": mockPlatformAdmin.role,
    "X-User-Email": mockPlatformAdmin.email,
  },
  clinic: mockClinic,
  clinicAdmin: mockClinicAdmin,
  clinicAdminAuthHeaders: {
    "X-User-Id": mockClinicAdmin.id,
    "X-User-Role": mockClinicAdmin.role,
    "X-User-Email": mockClinicAdmin.email,
  },
  doctor: mockDoctor,
  doctorAuthHeaders: {
    "X-User-Id": mockDoctor.id,
    "X-User-Role": mockDoctor.role,
    "X-User-Email": mockDoctor.email,
  },
  patient: mockPatient,
  patientAuthHeaders: {
    "X-User-Id": mockPatient.id,
    "X-User-Role": mockPatient.role,
    "X-User-Email": mockPatient.email,
  },
  password: "password@123",
};
