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

type PatientUpdatedEvent = Patient;

export async function publishPatientUpdatedEvent(event: PatientUpdatedEvent) {
  const [record] = await producer.send({
    topic: "PatientUpdated",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent event:", JSON.stringify(record));
}

type PatientDeletedEvent = {
  id: string;
};

export async function publishPatientDeletedEvent(event: PatientDeletedEvent) {
  const [record] = await producer.send({
    topic: "PatientDeleted",
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

type DoctorUpdatedEvent = Doctor;

export async function publishDoctorUpdatedEvent(event: DoctorUpdatedEvent) {
  const [record] = await producer.send({
    topic: "DoctorUpdated",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent event:", JSON.stringify(record));
}

type DoctorDeletedEvent = {
  id: string;
};

export async function publishDoctorDeletedEvent(event: DoctorDeletedEvent) {
  const [record] = await producer.send({
    topic: "DoctorDeleted",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent event:", JSON.stringify(record));
}
