import * as doctorAvailabilityRepository from "@/repositories/doctor-availability";
import { HTTPException } from "hono/http-exception";

export async function findAllByDoctorId(doctorId: string) {
  return await doctorAvailabilityRepository.findAllByDoctorId(doctorId);
}

export async function createOne(
  data: {
    doctorId: string;
    weekday: number;
    startTime: string;
    endTime: string;
  },
  createdBy: string,
) {
  const conflicted = await doctorAvailabilityRepository.hasConflict(data);

  if (conflicted) {
    throw new HTTPException(409, {
      message: "Doctor availability conflicts with existing one(s)",
    });
  }

  return await doctorAvailabilityRepository.insertOne({ ...data, createdBy });
}
