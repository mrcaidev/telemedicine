import dayjs from "dayjs";
import type { Appointment } from "./types";

export const AppointmentRealtimeStatus = {
  ToBeRescheduled: "To be rescheduled",
  Cancelled: "Cancelled",
  Confirmed: "Confirmed",
  Ongoing: "Ongoing",
  Completed: "Completed",
} as const;

export function getAppointmentRealtimeStatus(appointment: Appointment) {
  const { status, startAt, endAt } = appointment;

  if (status === "to_be_rescheduled") {
    return AppointmentRealtimeStatus.ToBeRescheduled;
  }

  if (status === "cancelled") {
    return AppointmentRealtimeStatus.Cancelled;
  }

  if (dayjs().isBefore(startAt)) {
    return AppointmentRealtimeStatus.Confirmed;
  }

  if (dayjs().isBefore(endAt)) {
    return AppointmentRealtimeStatus.Ongoing;
  }

  return AppointmentRealtimeStatus.Completed;
}
