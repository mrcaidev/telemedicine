import * as clinicRepository from "@/repositories/clinic";
import { HTTPException } from "hono/http-exception";

export async function findOneById(id: string) {
  const clinic = await clinicRepository.findOneById(id);

  if (!clinic) {
    throw new HTTPException(404, { message: "Clinic not found" });
  }

  return clinic;
}

export async function createOne(data: { name: string }, createdBy: string) {
  const clinic = await clinicRepository.insertOne({
    name: data.name,
    createdBy,
  });

  return clinic;
}
