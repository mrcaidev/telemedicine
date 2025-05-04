import type { FullAppointment } from "@/utils/types";

export type EmailRequestedEvent = {
  subject: string;
  to: string[];
  cc: string[];
  bcc: string[];
  content: string;
};

export type PatientCreatedEvent = {
  id: string;
  role: "patient";
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  gender: "male" | "female" | null;
  birthDate: string | null;
};

export type DoctorCreatedEvent = {
  id: string;
  role: "doctor";
  email: string;
  clinic: { id: string; name: string };
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: "male" | "female";
  description: string;
  specialties: string[];
};

export type AppointmentBookedEvent = FullAppointment;

export type AppointmentCancelledEvent = FullAppointment;

export type AppointmentRescheduleRequestedEvent = FullAppointment;
