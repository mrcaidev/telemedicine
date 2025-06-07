import * as doctorProfileRepository from "@/repositories/doctor-profile";
import { embedDoctor } from "@/utils/embedding";
import pgvector from "pgvector";
import type { EventRegistry } from "./registry";

export async function consumeDoctorCreatedEvent(
  event: EventRegistry["DoctorCreated"],
) {
  const embedding = await embedDoctor(event);
  await doctorProfileRepository.updateOneById(event.id, {
    embedding: pgvector.toSql(embedding),
  });
}
