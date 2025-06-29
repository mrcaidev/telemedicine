import * as appointmentReminderEmailRepository from "@/repositories/appointment-reminder-email";
import * as doctorRepository from "@/repositories/doctor";
import * as patientRepository from "@/repositories/patient";
import { requestNotification } from "@/utils/request";
import dayjs from "dayjs";
import { produceEvent } from "./producer";
import type { EventRegistry } from "./registry";

export async function consumePatientCreatedEvent(
  event: EventRegistry["PatientCreated"],
) {
  await patientRepository.insertOne({
    id: event.id,
    email: event.email,
    nickname: event.nickname,
    avatarUrl: event.avatarUrl,
  });
}

export async function consumePatientUpdatedEvent(
  event: EventRegistry["PatientUpdated"],
) {
  await patientRepository.updateOneById(event.id, {
    email: event.email,
    nickname: event.nickname,
    avatarUrl: event.avatarUrl,
  });
}

export async function consumeDoctorCreatedEvent(
  event: EventRegistry["DoctorCreated"],
) {
  await doctorRepository.insertOne({
    id: event.id,
    firstName: event.firstName,
    lastName: event.lastName,
    avatarUrl: event.avatarUrl,
    clinicId: event.clinic.id,
  });
}

export async function consumeDoctorUpdatedEvent(
  event: EventRegistry["DoctorUpdated"],
) {
  await doctorRepository.updateOneById(event.id, {
    firstName: event.firstName,
    lastName: event.lastName,
    avatarUrl: event.avatarUrl,
    clinicId: event.clinic.id,
  });
}

export async function consumeAppointmentBookedEvent(
  event: EventRegistry["AppointmentBooked"],
) {
  // 找到病人的邮箱。
  const patientWithEmail = await patientRepository.selectOneWithEmail({
    id: event.patient.id,
  });

  if (!patientWithEmail) {
    console.error("Patient not found:", event.patient.id);
    return;
  }

  // 提醒时间：预约开始时间前一天。
  const scheduledAt = dayjs(event.startAt).subtract(1, "day").toISOString();

  // 如果提醒时间已过，就不用安排提醒邮件了。
  if (dayjs().isAfter(scheduledAt)) {
    return;
  }

  // 安排提醒邮件。
  const emailId = await requestNotification.post<string>("/scheduled-emails", {
    subject: "Appointment Reminder for Tomorrow",
    to: [patientWithEmail.email],
    cc: [],
    bcc: [],
    content: `Dear ${patientWithEmail.nickname ?? patientWithEmail.email},\nThis is a friendly reminder that you have a scheduled appointment tomorrow.\nHere are the details of your appointment:\n- Date: ${dayjs(event.startAt).format("dddd, LL")}\n- Time: ${dayjs(event.startAt).format("LT")} - ${dayjs(event.endAt).format("LT")}\n- Doctor: ${event.doctor.firstName} ${event.doctor.lastName}\nIf you are no longer able to attend, please kindly cancel or reschedule your appointment on our platform as soon as possible.\nThank you for choosing Telemedicine. We look forward to seeing you soon.\nWarm regards,\nTelemedicine`,
    scheduledAt,
  });

  // 保存回执中的提醒邮件 ID，以便后续撤销。
  await appointmentReminderEmailRepository.insertOne({
    appointmentId: event.id,
    emailId,
    scheduledAt,
  });
}

export async function consumeAppointmentRescheduledEvent(
  event: EventRegistry["AppointmentRescheduled"],
) {
  // 找到病人的邮箱。
  const patientWithEmail = await patientRepository.selectOneWithEmail({
    id: event.patient.id,
  });

  if (!patientWithEmail) {
    console.error("Patient not found:", event.patient.id);
    return;
  }

  // 马上给病人发送一封邮件，告知预约已被重排。
  await produceEvent("EmailRequested", {
    subject: "Your Appointment Has Been Rescheduled",
    to: [patientWithEmail.email],
    cc: [],
    bcc: [],
    content: `Dear ${patientWithEmail.nickname ?? patientWithEmail.email},\nWe hope this message finds you well.\nWe are writing to inform you that your upcoming appointment has been rescheduled due to unforeseen circumstances. We sincerely apologize for any inconvenience this may cause and appreciate your understanding.\nYour new appointment details are as follows:\n- Date: ${dayjs(event.startAt).format("dddd, LL")}\n- Time: ${dayjs(event.startAt).format("LT")} - ${dayjs(event.endAt).format("LT")}\n- Doctor: ${event.doctor.firstName} ${event.doctor.lastName}\nIf the new time does not work for you, you are welcome to cancel the appointment on our platform.\nThank you for your patience and flexibility. If you have any questions or need assistance, please don't hesitate to contact our support team.\nWarm regards,\nTelemedicine`,
  });

  // 找出预约的提醒邮件。
  const appointmentReminderEmail =
    await appointmentReminderEmailRepository.selectOne({
      appointmentId: event.id,
    });

  if (!appointmentReminderEmail) {
    console.error(
      "Appointment reminder email not found for appointment:",
      event.id,
    );
    return;
  }

  // 新的提醒时间：预约开始时间前一天。
  const rescheduledAt = dayjs(event.startAt).subtract(1, "day").toISOString();

  // 如果提醒时间已过，就不需要重排提醒邮件了。
  if (dayjs().isAfter(rescheduledAt)) {
    return;
  }

  // 重排提醒邮件。
  await requestNotification.patch<null>(
    `/scheduled-emails/${appointmentReminderEmail.emailId}`,
    { scheduledAt: rescheduledAt },
  );

  // 更新提醒邮件。
  await appointmentReminderEmailRepository.updateOneByAppointmentId(
    appointmentReminderEmail.appointmentId,
    { scheduledAt: rescheduledAt },
  );
}

export async function consumeAppointmentCancelledEvent(
  event: EventRegistry["AppointmentCancelled"],
) {
  // 找出预约的提醒邮件。
  const appointmentReminderEmail =
    await appointmentReminderEmailRepository.selectOne({
      appointmentId: event.id,
    });

  if (!appointmentReminderEmail) {
    console.error(
      "Appointment reminder email not found for appointment:",
      event.id,
    );
    return;
  }

  // 如果提醒时间已过，就不需要撤销提醒邮件了。
  if (dayjs().isAfter(appointmentReminderEmail.scheduledAt)) {
    return;
  }

  // 撤销提醒邮件。
  await requestNotification.delete<null>(
    `/scheduled-emails/${appointmentReminderEmail.emailId}`,
  );
}
