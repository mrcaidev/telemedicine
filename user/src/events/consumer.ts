import * as doctorProfileRepository from "@/repositories/doctor-profile";
import { createEmbedding } from "@/utils/embedding";
import pgvector from "pgvector";
import type { EventRegistry } from "./registry";

export async function consumeDoctorCreatedEvent(
  event: EventRegistry["DoctorCreated"],
) {
  const embedding = await createEmbedding(
    `${event.firstName} ${event.lastName} ${event.description} ${event.specialties.join(" ")}`,
  );
  await doctorProfileRepository.updateOneById(event.id, {
    embedding: pgvector.toSql(embedding),
  });
}

export async function consumeDoctorUpdatedEvent(
  event: EventRegistry["DoctorUpdated"],
) {
  const embedding = await createEmbedding(
    `${event.firstName} ${event.lastName} ${event.description} ${event.specialties.join(" ")}`,
  );
  await doctorProfileRepository.updateOneById(event.id, {
    embedding: pgvector.toSql(embedding),
  });
}
