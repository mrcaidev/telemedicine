export type Role = "platform_admin" | "clinic_admin" | "doctor" | "patient";

export type Actor = {
  id: string;
  role: Role;
  email: string;
};

export type Patient = {
  id: string;
  nickname: string | null;
  avatarUrl: string | null;
};

export type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
};

export type DoctorAvailability = {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
};

export type AppointmentStatus = "normal" | "to_be_rescheduled" | "cancelled";

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  startAt: string;
  endAt: string;
  remark: string;
  status: AppointmentStatus;
  createdAt: string;
};

export type FullAppointment = Omit<Appointment, "patientId" | "doctorId"> & {
  patient: Patient;
  doctor: Doctor;
};

export type EmailSchedule = {
  appointmentId: string;
  emailId: string;
  scheduledAt: string;
};

export type PartiallyRequired<T, K extends keyof T> = Pick<T, K> & Partial<T>;
