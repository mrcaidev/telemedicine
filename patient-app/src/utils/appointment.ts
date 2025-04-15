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
  const { status, date, startTime, endTime } = appointment;

  if (status === "to_be_rescheduled") {
    return AppointmentRealtimeStatus.ToBeRescheduled;
  }

  if (status === "cancelled") {
    return AppointmentRealtimeStatus.Cancelled;
  }

  if (dayjs().isBefore(`${date} ${startTime}`)) {
    return AppointmentRealtimeStatus.Confirmed;
  }

  if (dayjs().isBefore(`${date} ${endTime}`)) {
    return AppointmentRealtimeStatus.Ongoing;
  }

  return AppointmentRealtimeStatus.Completed;
}
