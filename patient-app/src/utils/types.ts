export type Gender = "male" | "female";

export type Patient = {
  id: string;
  role: "patient";
  email: string;
  createdAt: string;
  nickname: string | null;
  avatarUrl: string | null;
  gender: Gender | null;
  birthDate: string | null;
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
  createdAt: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: Gender;
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

export type ChatMessage = {
  role: "assistant" | "user";
  content: string;
};

export type ChatEvaluation = {
  symptom: string;
  urgency: number;
  suggestion: string;
  keyword: string;
};

export type ChatSession = {
  id: string;
  history: ChatMessage[];
  evaluation: ChatEvaluation | null;
  createdAt: string;
};
