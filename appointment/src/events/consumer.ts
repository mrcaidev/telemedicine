import * as doctorRepository from "@/repositories/doctor";
import * as patientRepository from "@/repositories/patient";
import { consumer } from "./kafka";

// 消费者订阅主题。
await consumer.subscribe({ topic: "PatientCreated" });
console.log("kafka consumer subscribed to PatientCreated topic");
await consumer.subscribe({ topic: "PatientUpdated" });
console.log("kafka consumer subscribed to PatientUpdated topic");
await consumer.subscribe({ topic: "DoctorCreated" });
console.log("kafka consumer subscribed to DoctorCreated topic");
await consumer.subscribe({ topic: "DoctorUpdated" });
console.log("kafka consumer subscribed to DoctorUpdated topic");

// 不断消费消息。
await consumer.run({
  eachMessage: async ({ topic, message }) => {
    try {
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
      }
    } catch (error) {
      console.error(error);
      return;
    }
  },
});
console.log("kafka consumer is running");

type PatientCreatedEvent = {
  id: string;
  nickname: string | null;
  avatarUrl: string | null;
  gender: "male" | "female" | null;
  birthDate: string | null;
};

async function consumePatientCreatedEvent(event: PatientCreatedEvent) {
  await patientRepository.insertOne({
    id: event.id,
    nickname: event.nickname,
    avatarUrl: event.avatarUrl,
  });
}

type DoctorCreatedEvent = {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: "male" | "female";
  description: string;
  specialties: string[];
  clinic: { id: string; name: string };
};

async function consumeDoctorCreatedEvent(event: DoctorCreatedEvent) {
  await doctorRepository.insertOne({
    id: event.id,
    firstName: event.firstName,
    lastName: event.lastName,
    avatarUrl: event.avatarUrl,
  });
}
