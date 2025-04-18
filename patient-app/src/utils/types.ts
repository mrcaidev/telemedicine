export type Patient = {
  id: string;
  email: string;
  nickname: string;
  avatarUrl: string | null;
  gender: "male" | "female" | null;
  birthDate: string | null;
  createdAt: string;
};

export type Doctor = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: "male" | "female";
  description: string;
  specialties: string[];
  createdAt: string;
};

export type AppointmentStatus = "normal" | "to_be_rescheduled" | "cancelled";

export type Appointment = {
  id: string;
  patient: Patient;
  doctor: Doctor;
  date: string;
  startTime: string;
  endTime: string;
  remark: string;
  status: AppointmentStatus;
  createdAt: string;
};
