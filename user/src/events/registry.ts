import type { Doctor, Patient } from "@/utils/types";

export type EventRegistry = {
  PatientCreated: Patient;
  PatientUpdated: Patient;
  PatientDeleted: Pick<Patient, "id">;
  DoctorCreated: Doctor;
  DoctorUpdated: Doctor;
  DoctorDeleted: Pick<Doctor, "id">;
  EmailRequested: {
    subject: string;
    to: string[];
    cc: string[];
    bcc: string[];
    content: string;
  };
};
