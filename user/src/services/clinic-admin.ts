import * as accountRepository from "@/repositories/account";
import * as auditLogRepository from "@/repositories/audit-log";
import * as clinicRepository from "@/repositories/clinic";
import * as clinicAdminProfileRepository from "@/repositories/clinic-admin-profile";
import type { Actor } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findMany(query: { clinicId?: string }) {
  return await clinicAdminProfileRepository.selectMany(query);
}

export async function findById(id: string) {
  const clinicAdmin = await clinicAdminProfileRepository.selectOneById(id);

  if (!clinicAdmin) {
    throw new HTTPException(404, { message: "Clinic admin not found" });
  }

  return clinicAdmin;
}

export async function create(
  data: {
    email: string;
    password: string;
    clinicId: string;
    firstName: string;
    lastName: string;
  },
  actor: Actor,
) {
  const conflictedAccount = await accountRepository.selectOneByEmail(
    data.email,
  );
  if (conflictedAccount) {
    throw new HTTPException(409, {
      message: "This email has already been registered",
    });
  }

  const passwordHash = await Bun.password.hash(data.password);

  const clinic = await clinicRepository.selectOneById(data.clinicId);
  if (!clinic) {
    throw new HTTPException(404, { message: "Clinic not found" });
  }

  const account = await accountRepository.insertOne({
    role: "clinic_admin",
    email: data.email,
    passwordHash,
  });

  const clinicAdmin = await clinicAdminProfileRepository.insertOne({
    id: account.id,
    clinicId: data.clinicId,
    firstName: data.firstName,
    lastName: data.lastName,
    createdBy: actor.id,
  });

  await auditLogRepository.insertOne({
    userId: account.id,
    action: "register_with_email_and_password",
  });

  return clinicAdmin;
}

export async function updateById(
  id: string,
  data: { firstName?: string; lastName?: string },
) {
  const existingProfile =
    await clinicAdminProfileRepository.selectOneProfileById(id);
  if (!existingProfile) {
    throw new HTTPException(404, { message: "Clinic admin not found" });
  }

  return await clinicAdminProfileRepository.updateOneById(id, data);
}

export async function deleteById(id: string, actor: Actor) {
  const existingProfile =
    await clinicAdminProfileRepository.selectOneProfileById(id);
  if (!existingProfile) {
    throw new HTTPException(404, { message: "Clinic admin not found" });
  }

  await accountRepository.deleteOneById(id);
  await clinicAdminProfileRepository.deleteOneById(id, actor.id);
}
