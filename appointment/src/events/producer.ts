import { producer } from "./kafka";
import type { EventRegistry } from "./registry";

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
