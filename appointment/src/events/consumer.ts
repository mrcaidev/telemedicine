import * as appointmentReminderEmailRepository from "@/repositories/appointment-reminder-email";
import * as doctorRepository from "@/repositories/doctor";
import * as patientRepository from "@/repositories/patient";
import { requestNotification } from "@/utils/request";
import dayjs from "dayjs";
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
  // 找出病人的邮箱。
  const patientWithEmail = await patientRepository.selectOneWithEmail({
    id: event.patient.id,
  });
  if (!patientWithEmail) {
    console.error("Patient not found:", event.patient.id);
    return;
  }

  // 给病人发定时邮件，设定在预约开始时间前一天。
  const startAtDayjs = dayjs(event.startAt);
  const endAtDayjs = dayjs(event.endAt);
  const scheduledAt = startAtDayjs.subtract(1, "day").toISOString();

  // 如果定时的时间已经过去，就不用发送邮件了。
  if (dayjs().isAfter(scheduledAt)) {
    return;
  }

  // 安排定时邮件。
  const emailId = await requestNotification.post<string>("/scheduled-emails", {
    subject: "Appointment Reminder",
    to: [patientWithEmail.email],
    cc: [],
    bcc: [],
    content: `Hi, ${patientWithEmail.nickname ?? patientWithEmail.email}!\nPlease kindly be reminded that you have an appointment tomorrow:\n\nDate: ${startAtDayjs.format("dddd, LL")}\nTime: ${startAtDayjs.format("LT")} - ${endAtDayjs.format("LT")}\nDoctor: ${event.doctor.firstName} ${event.doctor.lastName}\n\nBest regards,\nYour Health App`,
    scheduledAt,
  });

  // 保存回执中的邮件 ID，以便后续撤销定时邮件。
  await appointmentReminderEmailRepository.insertOne({
    appointmentId: event.id,
    emailId,
    scheduledAt,
  });
}

export async function consumeAppointmentRescheduledEvent(
  event: EventRegistry["AppointmentRescheduled"],
) {
  // 马上给病人发送一封邮件，告知预约已被重排。
  const patientWithEmail = await patientRepository.selectOneWithEmail({
    id: event.patient.id,
  });

  if (!patientWithEmail) {
    console.error("Patient not found:", event.patient.id);
    return;
  }

  await produceEvent("EmailRequested", {
    subject: "Your Appointment Has Been Rescheduled",
    to: [patientWithEmail.email],
    cc: [],
    bcc: [],
    content: `Dear ${patientWithEmail.nickname ?? patientWithEmail.email},\nWe hope this message finds you well.\nWe are writing to inform you that your upcoming appointment has been rescheduled due to unforeseen circumstances. We sincerely apologize for any inconvenience this may cause and appreciate your understanding.\nYour new appointment details are as follows:\n- Date: ${dayjs(event.startAt).format("dddd, LL")}\n- Time: ${dayjs(event.startAt).format("LT")} - ${dayjs(event.endAt).format("LT")}\n- Doctor: ${event.doctor.firstName} ${event.doctor.lastName}\nIf the new time does not work for you, you are welcome to cancel the appointment on our platform.\nThank you for your patience and flexibility. If you have any questions or need assistance, please don't hesitate to contact our support team.\nWarm regards,\nTelemedicine`,
  });

  // 找出旧预约的提醒邮件。
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

  // 如果提醒时间已经过去，就不需要重排邮件了。
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
  // 找出定时邮件记录。
  const emailSchedule = await appointmentReminderEmailRepository.selectOne({
    appointmentId: event.id,
  });

  // 如果没有记录，就没什么好撤销。
  if (!emailSchedule) {
    return;
  }

  // 如果超过了定时发送的时间，说明邮件大概已经发送了，就也不撤销了。
  if (dayjs().isAfter(emailSchedule.scheduledAt)) {
    return;
  }

  // 撤销定时邮件。
  await requestNotification.delete<null>(
    `/scheduled-emails/${emailSchedule.emailId}`,
  );
}
