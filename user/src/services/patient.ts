import { produceEvent } from "@/events/producer";
import * as accountRepository from "@/repositories/account";
import * as auditLogRepository from "@/repositories/audit-log";
import * as patientProfileRepository from "@/repositories/patient-profile";
import * as otpVerificationService from "@/services/otp-verification";
import { signJwt } from "@/utils/jwt";
import type { Actor, Gender } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findById(id: string) {
  const patient = await patientProfileRepository.selectOneById(id);

  if (!patient) {
    throw new HTTPException(404, { message: "Patient not found" });
  }

  return patient;
}

export async function create(data: {
  email: string;
  password: string;
  otp: string;
}) {
  const conflictedAccount = await accountRepository.selectOneByEmail(
    data.email,
  );
  if (conflictedAccount) {
    throw new HTTPException(409, {
      message: "This email has already been registered",
    });
  }

  await otpVerificationService.verifyOtp(data.email, data.otp);

  const passwordHash = await Bun.password.hash(data.password);

  const account = await accountRepository.insertOne({
    role: "patient",
    email: data.email,
    passwordHash,
  });

  const patient = await patientProfileRepository.insertOne({ id: account.id });

  const token = await signJwt(account);

  await auditLogRepository.insertMany([
    {
      userId: account.id,
      action: "register_with_email_and_password",
    },
    {
      userId: account.id,
      action: "log_in_with_email_and_password",
    },
  ]);

  await produceEvent("PatientCreated", patient);

  return { ...patient, token };
}

export async function updateById(
  id: string,
  data: {
    nickname?: string;
    gender?: Gender;
    birthDate?: string;
  },
  actor: Actor,
) {
  const existingProfile =
    await patientProfileRepository.selectOneProfileById(id);
  if (!existingProfile) {
    throw new HTTPException(404, { message: "Patient not found" });
  }

  // 只有病人自己能更新自己。
  if (existingProfile.id !== actor.id) {
    throw new HTTPException(403, { message: "Permission denied" });
  }

  const newPatient = await patientProfileRepository.updateOneById(id, data);

  await produceEvent("PatientUpdated", newPatient);

  return newPatient;
}
