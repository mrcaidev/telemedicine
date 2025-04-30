import * as appointmentRepository from "@/repositories/appointment";
import * as doctorAvailabilityRepository from "@/repositories/doctor-availability";
import * as emailScheduleRepository from "@/repositories/email-schedule";
import * as patientRepository from "@/repositories/patient";
import { requestNotification } from "@/utils/request";
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

export async function findOneById(id: string, userId: string) {
  const appointment = await appointmentRepository.findOneFullById(id);

  if (!appointment) {
    throw new HTTPException(404, { message: "Appointment not found" });
  }

  if (appointment.patient.id !== userId && appointment.doctor.id !== userId) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  return appointment;
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

  const patient = await patientRepository.findOneById(patientId);

  if (!patient) {
    throw new HTTPException(404, { message: "Patient not found" });
  }

  const emailId = await requestNotification.post<string>("/scheduled-emails", {
    subject: "Appointment Reminder",
    to: [patient.email],
    cc: [],
    bcc: [],
    content: `Hi, ${patient.nickname}!\nPlease be reminded that you have an appointment tomorrow:\nDate: ${date.format("dddd, LL")}`,
  });

  await emailScheduleRepository.insertOne({
    appointmentId: appointment.id,
    emailId,
    scheduledAt: date.subtract(1, "day").toISOString(),
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

export async function cancelOneById(id: string, userId: string) {
  const appointment = await appointmentRepository.findOneById(id);

  if (!appointment) {
    throw new HTTPException(404, { message: "Appointment not found" });
  }

  if (appointment.patientId !== userId) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  if (dayjs().isAfter(appointment.startAt)) {
    throw new HTTPException(422, {
      message: "This appointment has already started",
    });
  }

  // 如果还没有到达定时邮件的发送时间，就撤销定时邮件。
  const emailSchedule =
    await emailScheduleRepository.findOneByAppointmentId(id);
  if (emailSchedule && dayjs().isBefore(emailSchedule.scheduledAt)) {
    await requestNotification.post(
      `/scheduled-emails/${emailSchedule.emailId}/cancel`,
    );
  }

  return await appointmentRepository.updateOneById(id, { status: "cancelled" });
}

export async function requestRescheduleOneById(id: string, userId: string) {
  const appointment = await appointmentRepository.findOneById(id);

  if (!appointment) {
    throw new HTTPException(404, { message: "Appointment not found" });
  }

  if (appointment.doctorId !== userId) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  if (dayjs().isAfter(appointment.startAt)) {
    throw new HTTPException(422, {
      message: "This appointment has already started",
    });
  }

  return await appointmentRepository.updateOneById(id, {
    status: "to_be_rescheduled",
  });
}
