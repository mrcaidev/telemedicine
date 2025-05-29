import { produceEvent } from "@/events/producer";
import * as appointmentRepository from "@/repositories/appointment";
import * as doctorAvailabilityRepository from "@/repositories/doctor-availability";
import { requestUser } from "@/utils/request";
import type { Actor, AppointmentStatus } from "@/utils/types";
import dayjs, { type Dayjs } from "dayjs";
import { HTTPException } from "hono/http-exception";

export async function paginate(
  query: {
    clinicId?: string;
    status: AppointmentStatus[];
    sortBy: "startAt" | "endAt";
    sortOrder: "asc" | "desc";
    limit: number;
    cursor: string;
  },
  actor: Actor,
) {
  const { clinicId, ...safeQuery } = query;

  const appointments = await appointmentRepository.selectManyFull({
    // 这些查询选项是安全的，不会导致越权问题。
    ...safeQuery,
    // 病人只能查询自己的预约。
    ...(actor.role === "patient" && { patientId: actor.id }),
    // 医生只能查询自己的预约。
    ...(actor.role === "doctor" && { doctorId: actor.id }),
    // 诊所管理员可以查询自己诊所内的预约。
    ...(actor.role === "clinic_admin" && { clinicId }),
  });

  const nextCursor =
    appointments.length < query.limit
      ? null
      : appointments.at(-1)?.[query.sortBy];

  return { appointments, nextCursor } as const;
}

export async function findOneById(id: string, actor: Actor) {
  const appointment = await appointmentRepository.selectOneFull({ id });

  if (!appointment) {
    throw new HTTPException(404, { message: "Appointment not found" });
  }

  // 只有预约涉及到的病人或医生才有权查看。
  if (
    appointment.patient.id !== actor.id &&
    appointment.doctor.id !== actor.id
  ) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  return appointment;
}

export async function book(
  data: { availabilityId: string; remark: string },
  actor: Actor,
) {
  const doctorAvailability = await doctorAvailabilityRepository.selectOne({
    id: data.availabilityId,
  });

  if (!doctorAvailability) {
    throw new HTTPException(404, { message: "Doctor availability not found" });
  }

  // 计算出空闲时间段在下一周内对应的绝对时间。
  const date = computeNextDateOfWeekday(doctorAvailability.weekday);
  const startAt = dateTimeToTimestamp(date, doctorAvailability.startTime);
  const endAt = dateTimeToTimestamp(date, doctorAvailability.endTime);

  const appointment = await appointmentRepository.insertOne({
    patientId: actor.id,
    doctorId: doctorAvailability.doctorId,
    startAt,
    endAt,
    remark: data.remark,
  });

  await produceEvent("AppointmentBooked", appointment);

  return appointment;
}

export async function requestReschedule(id: string, actor: Actor) {
  const oldAppointment = await appointmentRepository.selectOneFull({ id });

  if (!oldAppointment) {
    throw new HTTPException(404, { message: "Appointment not found" });
  }

  // 当前用户必须是预约的医生本人。
  if (oldAppointment.doctor.id !== actor.id) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  // 预约必须处于正常状态。
  if (oldAppointment.status !== "normal") {
    throw new HTTPException(409, {
      message: "This appointment cannot be rescheduled",
    });
  }

  // 预约必须未开始。
  if (dayjs().isAfter(oldAppointment.startAt)) {
    throw new HTTPException(422, {
      message: "This appointment has already started",
    });
  }

  const newAppointment = await appointmentRepository.updateOneById(id, {
    status: "to_be_rescheduled",
  });

  return newAppointment;
}

export async function reschedule(
  id: string,
  data: { availabilityId: string },
  actor: Actor,
) {
  const oldAppointment = await appointmentRepository.selectOneFull({ id });

  if (!oldAppointment) {
    throw new HTTPException(404, { message: "Appointment not found" });
  }

  // 当前用户必须是预约的医生所属诊所的管理员。
  const fullActor = await requestUser.get<{
    clinic: { id: string; name: string };
  }>("/auth/me", {
    headers: {
      "X-User-Id": actor.id,
      "X-User-Role": actor.role,
      "X-User-Email": actor.email,
    },
  });

  if (oldAppointment.clinicId !== fullActor.clinic.id) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  // 预约必须处于待重排状态。
  if (oldAppointment.status !== "to_be_rescheduled") {
    throw new HTTPException(409, {
      message: "This appointment cannot be rescheduled",
    });
  }

  const doctorAvailability = await doctorAvailabilityRepository.selectOne({
    id: data.availabilityId,
  });

  if (!doctorAvailability) {
    throw new HTTPException(404, { message: "Doctor availability not found" });
  }

  // 计算出空闲时间段在下一周内对应的绝对时间。
  const date = computeNextDateOfWeekday(doctorAvailability.weekday);
  const startAt = dateTimeToTimestamp(date, doctorAvailability.startTime);
  const endAt = dateTimeToTimestamp(date, doctorAvailability.endTime);

  const newAppointment = await appointmentRepository.updateOneById(id, {
    doctorId: doctorAvailability.doctorId,
    startAt,
    endAt,
    status: "normal",
  });

  await produceEvent("AppointmentRescheduled", newAppointment);

  return newAppointment;
}

export async function cancel(id: string, actor: Actor) {
  const oldAppointment = await appointmentRepository.selectOneFull({ id });

  if (!oldAppointment) {
    throw new HTTPException(404, { message: "Appointment not found" });
  }

  // 当前用户必须是预约的病人本人。
  if (oldAppointment.patient.id !== actor.id) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  // 预约必须不处于取消状态。
  if (oldAppointment.status === "cancelled") {
    throw new HTTPException(409, {
      message: "This appointment is already cancelled",
    });
  }

  // 预约必须未开始。
  if (dayjs().isAfter(oldAppointment.startAt)) {
    throw new HTTPException(422, {
      message: "This appointment has already started",
    });
  }

  const newAppointment = await appointmentRepository.updateOneById(id, {
    status: "cancelled",
  });

  await produceEvent("AppointmentCancelled", newAppointment);

  return newAppointment;
}

function computeNextDateOfWeekday(weekday: number) {
  const today = dayjs();
  const targetDate = today.day(weekday);
  if (today.isBefore(targetDate)) {
    return targetDate;
  }
  return targetDate.add(1, "week");
}

function dateTimeToTimestamp(date: Dayjs, time: string) {
  return dayjs.tz(`${date.format("YYYY-MM-DD")} ${time}`).toISOString();
}
