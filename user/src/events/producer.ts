import type { Doctor, Patient } from "@/utils/types";
import { producer } from "./kafka";

type EventRegistry = {
  PatientCreated: Patient;
  PatientUpdated: Patient;
  PatientDeleted: { id: string };
  DoctorCreated: Doctor;
  DoctorUpdated: Doctor;
  DoctorDeleted: { id: string };
  EmailRequested: {
    subject: string;
    to: string[];
    cc: string[];
    bcc: string[];
    content: string;
  };
};

export async function produceEvent<Topic extends keyof EventRegistry>(
  topic: Topic,
  event: EventRegistry[Topic] | EventRegistry[Topic][],
) {
  const events = Array.isArray(event) ? event : [event];

  const [record] = await producer.send({
    topic: topic,
    messages: events.map((e) => ({ value: JSON.stringify(e) })),
  });
  console.log("sent event:", JSON.stringify(record));
}
