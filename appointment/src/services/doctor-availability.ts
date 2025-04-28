import * as doctorRepository from "@/repositories/doctor";
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
  // 医生必须存在。
  const doctor = await doctorRepository.findOneById(data.doctorId);
  if (!doctor) {
    throw new HTTPException(404, { message: "Doctor not found" });
  }

  // 空闲时间不能互相重叠。
  const conflicted = await doctorAvailabilityRepository.hasConflict(data);
  if (conflicted) {
    throw new HTTPException(409, {
      message: "Doctor availability conflicts with existing one(s)",
    });
  }

  return await doctorAvailabilityRepository.insertOne({ ...data, createdBy });
}
