import type { Doctor, Patient } from "@/utils/types";
import { producer } from "./kafka";

type EmailRequestedEvent = {
  subject: string;
  to: string[];
  cc: string[];
  bcc: string[];
  content: string;
};

export async function publishEmailRequestedEvent(event: EmailRequestedEvent) {
  const [record] = await producer.send({
    topic: "EmailRequested",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent event:", JSON.stringify(record));
}

type PatientCreatedEvent = Patient;

export async function publishPatientCreatedEvent(event: PatientCreatedEvent) {
  const [record] = await producer.send({
    topic: "PatientCreated",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent event:", JSON.stringify(record));
}

type DoctorCreatedEvent = Doctor;

export async function publishDoctorCreatedEvent(event: DoctorCreatedEvent) {
  const [record] = await producer.send({
    topic: "DoctorCreated",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent event:", JSON.stringify(record));
}
