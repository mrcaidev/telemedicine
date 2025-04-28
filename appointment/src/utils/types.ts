export type Role = "platform_admin" | "clinic_admin" | "doctor" | "patient";

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
