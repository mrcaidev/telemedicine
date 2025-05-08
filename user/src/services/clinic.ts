import * as clinicRepository from "@/repositories/clinic";
import type { Account } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findOneById(id: string) {
  const clinic = await clinicRepository.findOneById(id);
  if (!clinic) {
    throw new HTTPException(404, { message: "This clinic does not exist" });
  }
  return clinic;
}

export async function createOne(data: { name: string }, actor: Account) {
  const clinic = await clinicRepository.createOne({
    name: data.name,
    createdBy: actor.id,
  });
  return clinic;
}
