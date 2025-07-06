import type { FullAppointment } from "@/utils/types";

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

export type EventRegistry = {
  PatientCreated: FullPatient;
  PatientUpdated: FullPatient;
  PatientDeleted: Pick<FullPatient, "id">;
  DoctorCreated: FullDoctor;
  DoctorUpdated: FullDoctor;
  DoctorDeleted: Pick<FullDoctor, "id">;
  AppointmentBooked: FullAppointment;
  AppointmentRescheduled: FullAppointment;
  AppointmentCancelled: FullAppointment;
  MedicalRecordCreated: {
    recordId: string;
    appointmentId: string;
  };
  EmailRequested: {
    subject: string;
    to: string[];
    cc: string[];
    bcc: string[];
    content: string;
  };
};
