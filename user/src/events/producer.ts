import type { Doctor, Patient } from "@/utils/types";
import { producer } from "./kafka";

type EmailRequestedEvent = {
  subject: string;
  to: string[];
  cc: string[];
  bcc: string[];
  content: string;
  scheduledAt: string | null;
};

export async function sendEmailRequestedEvent(event: EmailRequestedEvent) {
  const [record] = await producer.send({
    topic: "EmailRequested",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent EmailRequested event:", JSON.stringify(record));
}

type PatientCreatedEvent = Patient;

export async function publishPatientCreatedEvent(event: PatientCreatedEvent) {
  const [record] = await producer.send({
    topic: "PatientCreated",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent PatientCreated event:", JSON.stringify(record));
}

type DoctorCreatedEvent = Doctor;

export async function publishDoctorCreatedEvent(event: DoctorCreatedEvent) {
  const [record] = await producer.send({
    topic: "DoctorCreated",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent DoctorCreated event:", JSON.stringify(record));
}
