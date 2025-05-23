import * as doctorRepository from "@/repositories/doctor";
import * as emailScheduleRepository from "@/repositories/email-schedule";
import * as patientRepository from "@/repositories/patient";
import { requestNotification } from "@/utils/request";
import dayjs from "dayjs";
import { consumer } from "./kafka";
import type {
  AppointmentBookedEvent,
  AppointmentCancelledEvent,
  DoctorCreatedEvent,
  DoctorUpdatedEvent,
  PatientCreatedEvent,
  PatientUpdatedEvent,
} from "./types";

// 订阅主题。
await consumer.subscribe({
  topics: [
    "PatientCreated",
    "DoctorCreated",
    "AppointmentBooked",
    "AppointmentCancelled",
  ],
});
console.log("kafka consumer subscribed to topics");

// 不断消费消息。
await consumer.run({
  eachMessage: async ({ topic, message }) => {
    const text = message.value?.toString();
    if (!text) {
      return;
    }

    const json = JSON.parse(text);
    if (!json) {
      return;
    }

    if (topic === "PatientCreated") {
      await consumePatientCreatedEvent(json);
    } else if (topic === "DoctorCreated") {
      await consumeDoctorCreatedEvent(json);
    } else if (topic === "AppointmentBooked") {
      await consumeAppointmentBookedEvent(json);
    } else if (topic === "AppointmentCancelled") {
      await consumeAppointmentCancelledEvent(json);
    }
  },
});
console.log("kafka consumer is running");

export async function consumePatientCreatedEvent(event: PatientCreatedEvent) {
  await patientRepository.createOne({
    id: event.id,
    email: event.email,
    nickname: event.nickname,
    avatarUrl: event.avatarUrl,
  });
}

export async function consumePatientUpdatedEvent(event: PatientUpdatedEvent) {
  await patientRepository.updateOneById(event.id, {
    email: event.email,
    nickname: event.nickname,
    avatarUrl: event.avatarUrl,
  });
}

export async function consumeDoctorCreatedEvent(event: DoctorCreatedEvent) {
  await doctorRepository.createOne({
    id: event.id,
    firstName: event.firstName,
    lastName: event.lastName,
    avatarUrl: event.avatarUrl,
  });
}

export async function consumeDoctorUpdatedEvent(event: DoctorUpdatedEvent) {
  await doctorRepository.updateOneById(event.id, {
    firstName: event.firstName,
    lastName: event.lastName,
    avatarUrl: event.avatarUrl,
  });
}

export async function consumeAppointmentBookedEvent(
  event: AppointmentBookedEvent,
) {
  // 找出病人的邮箱。
  const patientWithEmail = await patientRepository.findOneWithEmailById(
    event.patient.id,
  );
  if (!patientWithEmail) {
    console.error("Patient not found:", event.patient.id);
    return;
  }

  // 给病人发定时邮件，设定在预约开始时间前一天。
  const startAtObject = dayjs(event.startAt);
  const endAtObject = dayjs(event.endAt);
  const scheduledAt = startAtObject.subtract(1, "day").toISOString();
  const emailId = await requestNotification.post<string>("/scheduled-emails", {
    subject: "Appointment Reminder",
    to: [patientWithEmail.email],
    cc: [],
    bcc: [],
    content: `Hi, ${patientWithEmail.nickname ?? patientWithEmail.email}!\nPlease kindly be reminded that you have an appointment tomorrow:\n\nDate: ${startAtObject.format("dddd, LL")}\nTime: ${startAtObject.format("LT")} - ${endAtObject.format("LT")}\nDoctor: ${event.doctor.firstName} ${event.doctor.lastName}\n\nBest regards,\nYour Health App`,
    scheduledAt,
  });

  // 保存回执中的邮件 ID，以便后续撤销定时邮件。
  await emailScheduleRepository.createOne({
    appointmentId: event.id,
    emailId,
    scheduledAt,
  });
}

export async function consumeAppointmentCancelledEvent(
  event: AppointmentCancelledEvent,
) {
  // 找出定时邮件记录。
  const emailSchedule = await emailScheduleRepository.findOneByAppointmentId(
    event.id,
  );

  // 如果没有记录，就没什么好撤销。
  if (!emailSchedule) {
    return;
  }

  // 如果超过了定时发送的时间，说明邮件大概已经发送了，就也不撤销了。
  if (dayjs().isAfter(emailSchedule.scheduledAt)) {
    return;
  }

  // 让 notification 服务撤销定时邮件。
  await requestNotification.post(
    `/scheduled-emails/${emailSchedule.emailId}/cancel`,
  );
}
