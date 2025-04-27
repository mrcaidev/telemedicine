import * as clinicAdminRepository from "@/repositories/clinic-admin";
import * as doctorRepository from "@/repositories/doctor";
import * as userRepository from "@/repositories/user";
import type { Doctor, Gender, WithFull } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findOneById(id: string) {
  const doctor = await doctorRepository.findOneById(id);

  if (!doctor) {
    throw new HTTPException(404, { message: "Doctor not found" });
  }

  return doctor;
}

export async function createOne(
  data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: Gender;
  },
  createdBy: string,
) {
  // 密码加盐。
  const passwordHash = await Bun.password.hash(data.password);

  // 医生的诊所继承自创建他的诊所管理员。
  const clinicAdmin = await clinicAdminRepository.findOneById(createdBy);
  if (!clinicAdmin) {
    throw new HTTPException(404, { message: "Clinic admin not found" });
  }
  const clinic = clinicAdmin.clinic;

  // 创建用户。
  const user = await userRepository.insertOne({
    role: "doctor",
    email: data.email,
    passwordHash,
  });

  // 创建医生。
  const doctor = await doctorRepository.insertOne({
    id: user.id,
    firstName: data.firstName,
    lastName: data.lastName,
    clinic,
    createdBy,
  });

  return {
    id: user.id,
    role: user.role,
    email: user.email,
    clinic,
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    avatarUrl: doctor.avatarUrl,
    description: doctor.description,
    gender: doctor.gender,
    specialties: doctor.specialties,
  } as WithFull<Doctor>;
}
