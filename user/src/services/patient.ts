import * as patientRepository from "@/repositories/patient";
import * as userRepository from "@/repositories/user";
import * as otpVerificationService from "@/services/otp-verification";
import { signJwt } from "@/utils/jwt";
import { HTTPException } from "hono/http-exception";

export async function findOneById(id: string) {
  const patient = await patientRepository.findOneById(id);

  if (!patient) {
    throw new HTTPException(404, { message: "Platform admin not found" });
  }

  return patient;
}

export async function createOne(data: {
  email: string;
  password: string;
  otp: string;
}) {
  // 如果该邮箱已经注册过了，拒绝再次注册。
  const existingUser = await userRepository.findOneByEmail(data.email);
  if (existingUser) {
    throw new HTTPException(409, {
      message: "This email has already been registered",
    });
  }

  // 验证 OTP。
  await otpVerificationService.verifyOtp(data.email, data.otp);

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

  return {
    id: user.id,
    role: user.role,
    email: user.email,
    nickname: patient.nickname,
    avatarUrl: patient.avatarUrl,
    gender: patient.gender,
    birthDate: patient.birthDate,
    token,
  };
}
