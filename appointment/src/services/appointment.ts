import {
  publishAppointmentBookedEvent,
  publishAppointmentCancelledEvent,
} from "@/events/producer";
import * as appointmentRepository from "@/repositories/appointment";
import * as doctorAvailabilityRepository from "@/repositories/doctor-availability";
import type { Actor, AppointmentStatus } from "@/utils/types";
import dayjs, { type Dayjs } from "dayjs";
import { HTTPException } from "hono/http-exception";

export async function findAll(
  query: {
    status?: AppointmentStatus;
    sortBy: "startAt" | "endAt";
    sortOrder: "asc" | "desc";
    limit: number;
    cursor: string;
  },
  actor: Actor,
) {
  const appointments = await appointmentRepository.findAll({
    ...query,
    ...(actor.role === "patient" && { patientId: actor.id }),
    ...(actor.role === "doctor" && { doctorId: actor.id }),
  });

  const nextCursor =
    appointments.length < query.limit
      ? null
      : appointments[appointments.length - 1]?.[query.sortBy];

  return { appointments, nextCursor } as const;
}

export async function findOneById(id: string, actor: Actor) {
  // 找出预约。
  const appointment = await appointmentRepository.findOneFullById(id);
  if (!appointment) {
    throw new HTTPException(404, { message: "Appointment not found" });
  }

  // 只有相关的病人和医生才能访问。
  if (
    appointment.patient.id !== actor.id &&
    appointment.doctor.id !== actor.id
  ) {
    throw new HTTPException(403, {
      message: "You are not allowed to view this appointment",
    });
  }

  return appointment;
}

export async function bookOne(
  data: { availabilityId: string; remark: string },
  actor: Actor,
) {
  // 找出空闲时间段详情。
  const doctorAvailability = await doctorAvailabilityRepository.findOneById(
    data.availabilityId,
  );
  if (!doctorAvailability) {
    throw new HTTPException(404, {
      message: "Doctor is not available at this time",
    });
  }

  // 计算出该空闲时间段对应的绝对时间。
  const date = computeNextDateOfWeekday(doctorAvailability.weekday);
  const startAt = dateToIso(date, doctorAvailability.startTime);
  const endAt = dateToIso(date, doctorAvailability.endTime);

  // 创建预约。
  const appointment = await appointmentRepository.createOne({
    patientId: actor.id,
    doctorId: doctorAvailability.doctorId,
    startAt,
    endAt,
    remark: data.remark,
  });

  // 发送事件。
  await publishAppointmentBookedEvent(appointment);

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

export async function requestRescheduleOneById(id: string, actor: Actor) {
  // 找出该预约。
  const appointment = await appointmentRepository.findOneById(id);
  if (!appointment) {
    throw new HTTPException(404, { message: "Appointment not found" });
  }

  // 只有预约的医生本人才能请求重排。
  if (appointment.doctorId !== actor.id) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  // 只有正常状态的预约才能请求重排。
  if (appointment.status !== "normal") {
    throw new HTTPException(409, {
      message: "This appointment cannot be resheduled",
    });
  }

  // 如果已经开始了，就不允许重排。
  if (dayjs().isAfter(appointment.startAt)) {
    throw new HTTPException(422, {
      message: "This appointment has already started",
    });
  }

  // 更新预约状态。
  return await appointmentRepository.updateOneById(id, {
    status: "to_be_rescheduled",
  });
}

export async function cancelOneById(id: string, actor: Actor) {
  // 找出该预约。
  const appointment = await appointmentRepository.findOneFullById(id);
  if (!appointment) {
    throw new HTTPException(404, { message: "Appointment not found" });
  }

  // 只有预约的病人本人才能取消预约。
  if (appointment.patient.id !== actor.id) {
    throw new HTTPException(403, {
      message: "You are not allowed to cancel this appointment",
    });
  }

  // 如果已经取消了，就不需要再取消了。
  if (appointment.status === "cancelled") {
    throw new HTTPException(409, {
      message: "This appointment is already cancelled",
    });
  }

  // 如果已经开始了，就不允许取消。
  if (dayjs().isAfter(appointment.startAt)) {
    throw new HTTPException(422, {
      message: "This appointment has already started",
    });
  }

  // 发送事件。
  await publishAppointmentCancelledEvent(appointment);

  // 更新预约状态。
  return await appointmentRepository.updateOneById(id, { status: "cancelled" });
}
