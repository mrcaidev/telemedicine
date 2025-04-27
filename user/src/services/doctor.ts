import * as doctorRepository from "@/repositories/doctor";
import { HTTPException } from "hono/http-exception";

export async function findOneById(id: string) {
  const doctor = await doctorRepository.findOneById(id);

  if (!doctor) {
    throw new HTTPException(404, { message: "Doctor not found" });
  }

  return doctor;
}
