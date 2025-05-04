import * as appointmentRepository from "@/repositories/appointment";
import * as doctorAvailabilityRepository from "@/repositories/doctor-availability";
import * as emailScheduleRepository from "@/repositories/email-schedule";
import * as patientRepository from "@/repositories/patient";
import { requestNotification } from "@/utils/request";
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

export async function createOne(
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

  // TODO：发送邮件这一段逻辑可以作为背景任务。实际上这里就应该返回了。
  // 找出病人的邮箱。
  const patientWithEmail = await patientRepository.findOneWithEmailById(
    actor.id,
  );
  if (!patientWithEmail) {
    throw new HTTPException(404, { message: "Patient not found" });
  }

  // 给病人发定时邮件，设定在预约开始时间前一天。
  const scheduledAt = date.subtract(1, "day").toISOString();
  const emailId = await requestNotification.post<string>("/scheduled-emails", {
    subject: "Appointment Reminder",
    to: [patientWithEmail.email],
    cc: [],
    bcc: [],
    content: `Hi, ${patientWithEmail.nickname ?? patientWithEmail.email}!\nPlease be reminded that you have an appointment tomorrow:\nDate: ${date.format("dddd, LL")}`,
    scheduledAt,
  });

  // 保存回执中的邮件 ID，以便后续撤销定时邮件。
  await emailScheduleRepository.createOne({
    appointmentId: appointment.id,
    emailId,
    scheduledAt,
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

export async function cancelOneById(id: string, actor: Actor) {
  // 找出该预约。
  const appointment = await appointmentRepository.findOneById(id);
  if (!appointment) {
    throw new HTTPException(404, { message: "Appointment not found" });
  }

  // 只有预约的病人本人才能取消预约。
  if (appointment.patientId !== actor.id) {
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

  // TODO：这个逻辑也可以放进背景。
  // 如果还没有到达定时邮件的发送时间，就撤销定时邮件。
  const emailSchedule =
    await emailScheduleRepository.findOneByAppointmentId(id);
  if (emailSchedule && dayjs().isBefore(emailSchedule.scheduledAt)) {
    await requestNotification.post(
      `/scheduled-emails/${emailSchedule.emailId}/cancel`,
    );
  }

  // 更新预约状态。
  return await appointmentRepository.updateOneById(id, { status: "cancelled" });
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
