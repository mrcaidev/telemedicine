import { produceEvent } from "@/events/producer";
import * as accountRepository from "@/repositories/account";
import * as auditLogRepository from "@/repositories/audit-log";
import * as clinicAdminProfileRepository from "@/repositories/clinic-admin-profile";
import * as doctorProfileRepository from "@/repositories/doctor-profile";
import { createEmbedding } from "@/utils/embedding";
import type { Actor, Gender } from "@/utils/types";
import { HTTPException } from "hono/http-exception";
import pgvector from "pgvector";

export async function paginate(query: {
  clinicId?: string;
  sortBy: "createdAt";
  sortOrder: "asc" | "desc";
  limit: number;
  cursor?: string;
}) {
  const doctors = await doctorProfileRepository.selectMany(query);

  const nextCursor =
    doctors.length < query.limit ? null : (doctors.at(-1)?.createdAt ?? null);

  return { doctors, nextCursor };
}

export async function search(query: {
  q: string;
  limit: number;
  cursor: number;
}) {
  const embedding = await createEmbedding(query.q);

  const matches = await doctorProfileRepository.searchMany({
    text: query.q,
    embedding: pgvector.toSql(embedding),
    limit: query.limit,
    cursor: query.cursor,
  });

  const nextCursor =
    matches.length < query.limit ? null : (matches.at(-1)?.score ?? 0);

  return {
    doctors: matches.map(({ score, ...doctor }) => doctor),
    nextCursor,
  };
}

export async function sample(query: { limit: number }) {
  return await doctorProfileRepository.selectManyRandomly(query);
}

export async function findById(id: string) {
  const doctor = await doctorProfileRepository.selectOneById(id);

  if (!doctor) {
    throw new HTTPException(404, { message: "Doctor not found" });
  }

  return doctor;
}

export async function create(
  data: {
    email: string;
    password: string;
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

  // 医生的诊所信息继承自创建他的诊所管理员，也就是继承自当前用户。
  const clinicAdminProfile =
    await clinicAdminProfileRepository.selectOneProfileById(actor.id);
  if (!clinicAdminProfile) {
    throw new HTTPException(404, { message: "Clinic not found" });
  }

  const account = await accountRepository.insertOne({
    role: "doctor",
    email: data.email,
    passwordHash,
  });

  const doctor = await doctorProfileRepository.insertOne({
    id: account.id,
    clinicId: clinicAdminProfile.clinicId,
    firstName: data.firstName,
    lastName: data.lastName,
    createdBy: actor.id,
  });

  await auditLogRepository.insertOne({
    userId: account.id,
    action: "register_with_email_and_password",
  });

  await produceEvent("DoctorCreated", doctor);

  return doctor;
}

export async function updateById(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    description?: string;
    gender?: Gender;
    specialties?: string[];
  },
  actor: Actor,
) {
  const existingProfile =
    await doctorProfileRepository.selectOneProfileById(id);
  if (!existingProfile) {
    throw new HTTPException(404, { message: "Doctor not found" });
  }

  // 只有医生所属诊所的管理员才能更新。
  const clinicAdminProfile =
    await clinicAdminProfileRepository.selectOneProfileById(actor.id);
  if (!clinicAdminProfile) {
    throw new HTTPException(404, { message: "Clinic admin not found" });
  }
  if (clinicAdminProfile.clinicId !== existingProfile.clinicId) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  const newDoctor = await doctorProfileRepository.updateOneById(id, data);

  await produceEvent("DoctorUpdated", newDoctor);

  return newDoctor;
}

export async function deleteById(id: string, actor: Actor) {
  const existingProfile =
    await doctorProfileRepository.selectOneProfileById(id);
  if (!existingProfile) {
    throw new HTTPException(404, { message: "Doctor not found" });
  }

  // 只有医生所属诊所的管理员才能删除。
  const clinicAdminProfile =
    await clinicAdminProfileRepository.selectOneProfileById(actor.id);
  if (!clinicAdminProfile) {
    throw new HTTPException(404, { message: "Clinic admin not found" });
  }
  if (clinicAdminProfile.clinicId !== existingProfile.clinicId) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  await accountRepository.deleteOneById(id);
  await doctorProfileRepository.deleteOneById(id, actor.id);

  await produceEvent("DoctorDeleted", { id });
}
