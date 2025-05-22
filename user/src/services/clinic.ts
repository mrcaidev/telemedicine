import * as clinicRepository from "@/repositories/clinic";
import type { Actor } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findMany() {
  return await clinicRepository.selectMany();
}

export async function findById(id: string) {
  const clinic = await clinicRepository.selectOneById(id);
  if (!clinic) {
    throw new HTTPException(404, { message: "Clinic not found" });
  }
  return clinic;
}

export async function create(data: { name: string }, actor: Actor) {
  return await clinicRepository.insertOne({
    name: data.name,
    createdBy: actor.id,
  });
}

export async function updateById(id: string, data: { name?: string }) {
  const existingClinic = await clinicRepository.selectOneById(id);
  if (!existingClinic) {
    throw new HTTPException(404, { message: "Clinic not found" });
  }

  return await clinicRepository.updateOneById(id, data);
}

export async function deleteById(id: string, actor: Actor) {
  const existingClinic = await clinicRepository.selectOneById(id);
  if (!existingClinic) {
    throw new HTTPException(404, { message: "Clinic not found" });
  }

  await clinicRepository.deleteOneById(id, actor.id);
}
