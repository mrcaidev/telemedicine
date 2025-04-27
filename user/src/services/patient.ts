import * as otpVerificationRepository from "@/repositories/otp-verification";
import * as patientRepository from "@/repositories/patient";
import * as userRepository from "@/repositories/user";
import { signJwt } from "@/utils/jwt";
import type { Patient } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function createPatient(data: {
  email: string;
  password: string;
  otp: string;
}) {
  // 如果找不到待验证的 OTP 记录，说明用户还没有验证过邮箱。
  const otpVerification = await otpVerificationRepository.findLastOneByEmail(
    data.email,
  );
  if (!otpVerification || otpVerification.verifiedAt) {
    throw new HTTPException(422, {
      message:
        "This email has not yet been verified. Have you requested an OTP?",
    });
  }

  // OTP 在 5 分钟后就应该视为过期。
  if (new Date(otpVerification.sentAt).getTime() + 5 * 60 * 1000 < Date.now()) {
    throw new HTTPException(422, {
      message: "This OTP has expired. Let's try another time!",
    });
  }

  // 检查 OTP 是否匹配。
  if (otpVerification.otp !== data.otp) {
    throw new HTTPException(422, {
      message: "This OTP is incorrect. Make sure you copied the right code!",
    });
  }

  // 更新 OTP 验证记录，标记为已验证。
  await otpVerificationRepository.updateOneById(otpVerification.id, {
    verifiedAt: new Date().toISOString(),
  });

  // 密码加盐。
  const passwordHash = await Bun.password.hash(data.password);

  // 创建用户。
  const user = await userRepository.insertOne({
    role: "patient",
    email: data.email,
    passwordHash,
  });

  // 创建病人。
  const patient = await patientRepository.insertOne({ id: user.id });

  // 颁发 JWT。
  const token = await signJwt({ id: user.id, role: "patient" });

  const fullPatient = {
    id: user.id,
    role: "patient",
    email: user.email,
    nickname: patient.nickname,
    avatarUrl: patient.avatarUrl,
    gender: patient.gender,
    birthDate: patient.birthDate,
  } satisfies Patient;

  return { ...fullPatient, token };
}
