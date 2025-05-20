import * as accountRepository from "@/repositories/account";
import * as auditLogRepository from "@/repositories/audit-log";
import * as clinicRepository from "@/repositories/clinic";
import * as clinicAdminProfileRepository from "@/repositories/clinic-admin-profile";
import type { Account, ClinicAdmin } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findMany(query: { clinicId?: string }) {
  return await clinicAdminProfileRepository.findManyFull(query);
}

export async function findOneById(id: string) {
  const account = await accountRepository.findOneById(id);
  if (!account) {
    throw new HTTPException(404, {
      message: "This clinic admin does not exist",
    });
  }

  const fullProfile = await clinicAdminProfileRepository.findOneFullById(id);
  if (!fullProfile) {
    throw new HTTPException(404, {
      message: "This clinic admin does not exist",
    });
  }

  return { ...account, ...fullProfile } as ClinicAdmin;
}

export async function createOne(
  data: {
    email: string;
    password: string;
    clinicId: string;
    firstName: string;
    lastName: string;
  },
  actor: Account,
) {
  // 如果该邮箱已经注册过了，就拒绝再次注册。
  const existingAccount = await accountRepository.findOneByEmail(data.email);
  if (existingAccount) {
    throw new HTTPException(409, {
      message: "This email has already been registered",
    });
  }

  // 密码加盐。
  const passwordHash = await Bun.password.hash(data.password);

  // 查指定的诊所。
  const clinic = await clinicRepository.findOneById(data.clinicId);
  if (!clinic) {
    throw new HTTPException(404, { message: "This clinic does not exist" });
  }

  // 创建账户。
  const account = await accountRepository.createOne({
    role: "clinic_admin",
    email: data.email,
    passwordHash,
  });

  // 创建资料。
  const profile = await clinicAdminProfileRepository.createOne({
    id: account.id,
    firstName: data.firstName,
    lastName: data.lastName,
    clinicId: data.clinicId,
    createdBy: actor.id,
  });

  // 记录到审计日志。
  await auditLogRepository.createOne({
    userId: account.id,
    action: "register_with_email_and_password",
  });

  const { clinicId, ...clinicAdmin } = { ...account, clinic, ...profile };

  return clinicAdmin as ClinicAdmin;
}

export async function updateOneById(
  id: string,
  data: { firstName?: string; lastName?: string },
) {
  const existingProfile = await clinicAdminProfileRepository.findOneById(id);
  if (!existingProfile) {
    throw new HTTPException(404, {
      message: "This clinic admin does not exist",
    });
  }

  return await clinicAdminProfileRepository.updateOneById(id, data);
}

export async function deleteOneById(id: string, actor: Account) {
  // 首先得要存在。
  const existingProfile = await clinicAdminProfileRepository.findOneById(id);
  if (!existingProfile) {
    throw new HTTPException(404, {
      message: "This clinic admin does not exist",
    });
  }

  // 删除账户。
  await accountRepository.deleteOneById(id);

  // 删除资料。
  await clinicAdminProfileRepository.deleteOneById(id, actor.id);
}
