import { publishPatientCreatedEvent } from "@/events/producer";
import * as accountRepository from "@/repositories/account";
import * as patientProfileRepository from "@/repositories/patient-profile";
import * as otpVerificationService from "@/services/otp-verification";
import { signJwt } from "@/utils/jwt";
import type { Patient } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findOneById(id: string) {
  const account = await accountRepository.findOneById(id);
  if (!account) {
    throw new HTTPException(404, { message: "This patient does not exist" });
  }

  const profile = await patientProfileRepository.findOneById(id);
  if (!profile) {
    throw new HTTPException(404, { message: "This patient does not exist" });
  }

  return { ...account, ...profile } as Patient;
}

export async function createOne(data: {
  email: string;
  password: string;
  otp: string;
}) {
  // 如果该邮箱已经注册过了，就拒绝再次注册。
  const existingAccount = await accountRepository.findOneByEmail(data.email);
  if (existingAccount) {
    throw new HTTPException(409, {
      message: "This email has already been registered",
    });
  }

  // 验证 OTP。
  await otpVerificationService.verifyOtp(data.email, data.otp);

  // 密码加盐。
  const passwordHash = await Bun.password.hash(data.password);

  // 创建账户。
  const account = await accountRepository.createOne({
    role: "patient",
    email: data.email,
    passwordHash,
  });

  // 创建资料。
  const profile = await patientProfileRepository.createOne({ id: account.id });

  const patient = { ...account, ...profile };

  // 发布事件。
  await publishPatientCreatedEvent(patient);

  // 颁发 JWT。
  const token = await signJwt(account);

  return { ...patient, token } as Patient & { token: string };
}
