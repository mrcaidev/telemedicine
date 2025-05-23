import type { FullAppointment } from "@/utils/types";

export type EmailRequestedEvent = {
  subject: string;
  to: string[];
  cc: string[];
  bcc: string[];
  content: string;
};

type FullPatient = {
  id: string;
  role: "patient";
  email: string;
  createdAt: string;
  nickname: string | null;
  avatarUrl: string | null;
  gender: "male" | "female" | null;
  birthDate: string | null;
};

export type PatientCreatedEvent = FullPatient;

export type PatientUpdatedEvent = FullPatient;

export type PatientDeletedEvent = Pick<FullPatient, "id">;

type FullDoctor = {
  id: string;
  role: "doctor";
  email: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: "male" | "female";
  description: string;
  specialties: string[];
  clinic: {
    id: string;
    name: string;
    createdAt: string;
  };
};

export type DoctorCreatedEvent = FullDoctor;

export type DoctorUpdatedEvent = FullDoctor;

export type DoctorDeletedEvent = Pick<FullDoctor, "id">;

export type AppointmentBookedEvent = FullAppointment;

export type AppointmentCancelledEvent = FullAppointment;

export type AppointmentRescheduleRequestedEvent = FullAppointment;
