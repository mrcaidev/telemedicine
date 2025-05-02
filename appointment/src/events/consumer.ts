import * as doctorRepository from "@/repositories/doctor";
import * as patientRepository from "@/repositories/patient";
import { consumer } from "./kafka";

// 订阅主题。
await consumer.subscribe({ topics: ["PatientCreated", "DoctorCreated"] });
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
    }
  },
});
console.log("kafka consumer is running");

type PatientCreatedEvent = {
  id: string;
  role: "patient";
  email: string;
  nickname: string | null;
  avatarUrl: string | null;
  gender: "male" | "female" | null;
  birthDate: string | null;
};

async function consumePatientCreatedEvent(event: PatientCreatedEvent) {
  await patientRepository.createOne({
    id: event.id,
    email: event.email,
    nickname: event.nickname,
    avatarUrl: event.avatarUrl,
  });
}

type DoctorCreatedEvent = {
  id: string;
  role: "doctor";
  email: string;
  clinic: { id: string; name: string };
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  gender: "male" | "female";
  description: string;
  specialties: string[];
};

async function consumeDoctorCreatedEvent(event: DoctorCreatedEvent) {
  await doctorRepository.createOne({
    id: event.id,
    firstName: event.firstName,
    lastName: event.lastName,
    avatarUrl: event.avatarUrl,
  });
}
