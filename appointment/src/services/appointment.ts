import * as appointmentRepository from "@/repositories/appointment";
import * as doctorAvailabilityRepository from "@/repositories/doctor-availability";
import type { AppointmentStatus, Role } from "@/utils/types";
import dayjs, { type Dayjs } from "dayjs";
import { HTTPException } from "hono/http-exception";

export async function findAll(
  options: {
    status?: AppointmentStatus;
    sortBy: "startAt" | "endAt";
    sortOrder: "asc" | "desc";
    limit: number;
    cursor: string | null;
  },
  user: { id: string; role: Role },
) {
  const appointments = await appointmentRepository.findAll({
    ...options,
    ...(user.role === "patient" && { patientId: user.id }),
    ...(user.role === "doctor" && { doctorId: user.id }),
  });

  const nextCursor =
    appointments.length < options.limit
      ? null
      : appointments[appointments.length - 1]?.[options.sortBy];

  return { appointments, nextCursor } as const;
}

export async function createOne(
  availabilityId: string,
  remark: string,
  patientId: string,
) {
  const doctorAvailability =
    await doctorAvailabilityRepository.findOneById(availabilityId);

  if (!doctorAvailability) {
    throw new HTTPException(404, {
      message: "Doctor is not available at this time",
    });
  }

  const date = computeNextDateOfWeekday(doctorAvailability.weekday);
  const startAt = dateToIso(date, doctorAvailability.startTime);
  const endAt = dateToIso(date, doctorAvailability.endTime);

  const appointment = await appointmentRepository.insertOne({
    patientId,
    doctorId: doctorAvailability.doctorId,
    startAt,
    endAt,
    remark,
  });

  return appointment;
}

function computeNextDateOfWeekday(weekday: number) {
  const today = dayjs();
  const targetDate = today.day(weekday);
  if (today.isBefore(targetDate)) {
    return targetDate;
  }
  return targetDate.add(1, "week");
}

function dateToIso(date: Dayjs, time: string) {
  return dayjs(`${date.format("YYYY-MM-DD")} ${time}`).toISOString();
}
