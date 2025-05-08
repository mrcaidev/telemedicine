import { producer } from "./kafka";
import type {
  AppointmentBookedEvent,
  AppointmentCancelledEvent,
  EmailRequestedEvent,
} from "./types";

export async function publishEmailRequestedEvent(event: EmailRequestedEvent) {
  const [record] = await producer.send({
    topic: "EmailRequested",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent event:", JSON.stringify(record));
}

export async function publishAppointmentBookedEvent(
  event: AppointmentBookedEvent,
) {
  const [record] = await producer.send({
    topic: "AppointmentBooked",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent event:", JSON.stringify(record));
}

export async function publishAppointmentCancelledEvent(
  event: AppointmentCancelledEvent,
) {
  const [record] = await producer.send({
    topic: "AppointmentCancelled",
    messages: [{ value: JSON.stringify(event) }],
  });
  console.log("sent event:", JSON.stringify(record));
}
