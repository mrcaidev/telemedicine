import * as clinicRepository from "@/repositories/clinic";
import * as clinicAdminRepository from "@/repositories/clinic-admin";
import * as userRepository from "@/repositories/user";
import type { ClinicAdmin, WithFull } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findOneById(id: string) {
  const clinicAdmin = await clinicAdminRepository.findOneById(id);

  if (!clinicAdmin) {
    throw new HTTPException(404, { message: "Clinic admin not found" });
  }

  return clinicAdmin;
}

export async function createOne(
  data: {
    email: string;
    password: string;
    clinicId: string;
    firstName: string;
    lastName: string;
  },
  createdBy: string,
) {
  // 密码加盐。
  const passwordHash = await Bun.password.hash(data.password);

  // 检索出诊所。
  const clinic = await clinicRepository.findOneById(data.clinicId);
  if (!clinic) {
    throw new HTTPException(404, { message: "Clinic not found" });
  }

  // 创建用户。
  const user = await userRepository.insertOne({
    role: "clinic_admin",
    email: data.email,
    passwordHash,
  });

  // 创建诊所管理员。
  const clinicAdmin = await clinicAdminRepository.insertOne({
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
    firstName: clinicAdmin.firstName,
    lastName: clinicAdmin.lastName,
  } as WithFull<ClinicAdmin>;
}
