import {
  publishDoctorCreatedEvent,
  publishDoctorDeletedEvent,
  publishDoctorUpdatedEvent,
} from "@/events/producer";
import * as accountRepository from "@/repositories/account";
import * as auditLogRepository from "@/repositories/audit-log";
import * as clinicAdminProfileRepository from "@/repositories/clinic-admin-profile";
import * as doctorProfileRepository from "@/repositories/doctor-profile";
import type { Account, Doctor, Gender } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findMany(query: {
  clinicId?: string;
  sortBy: "createdAt";
  sortOrder: "asc" | "desc";
  limit: number;
  cursor?: string;
}) {
  const doctors = await doctorProfileRepository.findManyFull(query);

  const nextCursor =
    doctors.length < query.limit ? null : (doctors.at(-1)?.createdAt ?? 0);

  return {
    doctors: doctors.map((d) => {
      const { createdAt, ...rest } = d;
      return rest;
    }),
    nextCursor,
  } as const;
}

export async function findManyRandom(query: { limit: number }) {
  return await doctorProfileRepository.findManyFullRandom(query);
}

export async function findOneById(id: string) {
  const account = await accountRepository.findOneById(id);
  if (!account) {
    throw new HTTPException(404, { message: "This doctor does not exist" });
  }

  const fullProfile = await doctorProfileRepository.findOneFullById(id);
  if (!fullProfile) {
    throw new HTTPException(404, { message: "This doctor does not exist" });
  }

  return { ...account, ...fullProfile } as Doctor;
}

export async function createOne(
  data: {
    email: string;
    password: string;
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

  // 医生的诊所信息继承自创建他的诊所管理员，也就是继承自当前用户。
  const clinicAdminFullProfile =
    await clinicAdminProfileRepository.findOneFullById(actor.id);
  if (!clinicAdminFullProfile) {
    throw new HTTPException(404, { message: "This clinic does not exist" });
  }
  const clinic = clinicAdminFullProfile.clinic;

  // 创建账户。
  const account = await accountRepository.createOne({
    role: "doctor",
    email: data.email,
    passwordHash,
  });

  // 创建资料。
  const profile = await doctorProfileRepository.createOne({
    id: account.id,
    firstName: data.firstName,
    lastName: data.lastName,
    clinicId: clinic.id,
    createdBy: actor.id,
  });

  const { clinicId, ...doctor } = { ...account, clinic, ...profile };

  // 发布事件。
  await publishDoctorCreatedEvent(doctor);

  // 记录到审计日志。
  await auditLogRepository.createOne({
    userId: account.id,
    action: "register_with_email_and_password",
  });

  return doctor as Doctor;
}

export async function search(query: {
  q: string;
  limit: number;
  cursor: number;
}) {
  const fullProfiles = await doctorProfileRepository.searchManyFull({
    q: query.q,
    limit: query.limit,
    maxSimilarity: query.cursor,
  });

  const nextCursor =
    fullProfiles.length < query.limit
      ? null
      : (fullProfiles.at(-1)?.similarity ?? 0);

  return {
    doctors: fullProfiles.map(({ similarity, ...rest }) => rest),
    nextCursor,
  };
}

export async function updateOneById(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    description?: string;
    gender?: Gender;
    specialties?: string[];
  },
  actor: Account,
) {
  const existingProfile = await doctorProfileRepository.findOneById(id);
  if (!existingProfile) {
    throw new HTTPException(404, {
      message: "This doctor does not exist",
    });
  }

  // 只有医生所属诊所的管理员才能更新。
  const clinicAdminProfile = await clinicAdminProfileRepository.findOneById(
    actor.id,
  );
  if (!clinicAdminProfile) {
    throw new HTTPException(404, { message: "Clinic admin not found" });
  }
  if (clinicAdminProfile.clinicId !== existingProfile.clinicId) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  const newDoctor = await doctorProfileRepository.updateOneById(id, data);

  await publishDoctorUpdatedEvent(newDoctor);

  return newDoctor;
}

export async function deleteOneById(id: string, actor: Account) {
  // 首先得要存在。
  const existingProfile = await doctorProfileRepository.findOneById(id);
  if (!existingProfile) {
    throw new HTTPException(404, {
      message: "This doctor does not exist",
    });
  }

  // 只有医生所属诊所的管理员才能删除。
  const clinicAdminProfile = await clinicAdminProfileRepository.findOneById(
    actor.id,
  );
  if (!clinicAdminProfile) {
    throw new HTTPException(404, { message: "Clinic admin not found" });
  }
  if (clinicAdminProfile.clinicId !== existingProfile.clinicId) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  // 删除账户。
  await accountRepository.deleteOneById(id);

  // 删除资料。
  await doctorProfileRepository.deleteOneById(id, actor.id);

  // 发布事件。
  await publishDoctorDeletedEvent({ id });
}
