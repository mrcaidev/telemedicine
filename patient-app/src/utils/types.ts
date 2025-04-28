export type Patient = {
  id: string;
  role: "patient";
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  gender: "male" | "female" | null;
  birthDate: string | null;
};

export type Clinic = {
  id: string;
  name: string;
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
};

export type AppointmentStatus = "normal" | "to_be_rescheduled" | "cancelled";

export type Appointment = {
  id: string;
  patient: Pick<Patient, "id" | "nickname" | "avatarUrl">;
  doctor: Pick<Doctor, "id" | "firstName" | "lastName" | "avatarUrl">;
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
};
