export type Patient = {
  id: string;
  role: "patient";
  email: string;
  nickname: string;
  avatarUrl: string | null;
  gender: "male" | "female" | null;
  birthDate: string | null;
  createdAt: string;
};

export type Clinic = {
  id: string;
  name: string;
  createdAt: string;
};

export type Doctor = {
  id: string;
  role: "doctor";
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: "male" | "female";
  description: string;
  specialties: string[];
  clinic: Clinic;
  createdAt: string;
};

export type AppointmentStatus = "normal" | "to_be_rescheduled" | "cancelled";

export type Appointment = {
  id: string;
  patient: Patient;
  doctor: Doctor;
  startAt: string;
  endAt: string;
  remark: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type DoctorAvailability = {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  createdAt: string;
};
