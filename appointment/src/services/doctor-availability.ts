import * as doctorRepository from "@/repositories/doctor";
import * as doctorAvailabilityRepository from "@/repositories/doctor-availability";
import { HTTPException } from "hono/http-exception";

export async function findAllByDoctorId(doctorId: string) {
  return await doctorAvailabilityRepository.selectMany({ doctorId });
}

export async function createOne(data: {
  doctorId: string;
  weekday: number;
  startTime: string;
  endTime: string;
}) {
  const doctor = await doctorRepository.selectOne({ id: data.doctorId });

  if (!doctor) {
    throw new HTTPException(404, { message: "Doctor not found" });
  }

  const conflicted = await doctorAvailabilityRepository.hasConflict(data);

  if (conflicted) {
    throw new HTTPException(409, {
      message: "Doctor availability conflicts with existing one(s)",
    });
  }

  return await doctorAvailabilityRepository.insertOne(data);
}

export async function deleteOneById(id: string) {
  const existingDoctorAvailability =
    await doctorAvailabilityRepository.selectOne({ id });

  if (!existingDoctorAvailability) {
    throw new HTTPException(404, { message: "Doctor availability not found" });
  }

  await doctorAvailabilityRepository.deleteOneById(id);
}
