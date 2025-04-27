import * as clinicAdminRepository from "@/repositories/clinic-admin";
import * as doctorRepository from "@/repositories/doctor";
import * as patientRepository from "@/repositories/patient";
import * as platformAdminRepository from "@/repositories/platform-admin";
import * as userRepository from "@/repositories/user";
import { signJwt } from "@/utils/jwt";
import type { User } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function logInWithEmailAndPassword(
  email: string,
  password: string,
) {
  // 如果找不到该邮箱，说明用户还没注册。
  const user = await userRepository.findOneByEmail(email);
  if (!user) {
    throw new HTTPException(404, {
      message:
        "This email does not exist. Do you want to register an account instead?",
    });
  }

  // 如果密码是 null，说明这个用户是通过 OAuth 注册的病人。
  // 既然没有密码，就无法继续该流程。
  if (!user.passwordHash) {
    throw new HTTPException(401, {
      message:
        "Password login is not enabled for this account. Try 3rd-party login instead",
    });
  }

  // 验证密码。
  const verified = await Bun.password.verify(password, user.passwordHash);
  if (!verified) {
    throw new HTTPException(401, { message: "Wrong password. Try again?" });
  }

  // 获取其完整信息。
  let fullUser: User | null;
  if (user.role === "platform_admin") {
    fullUser = await platformAdminRepository.findOneById(user.id);
  } else if (user.role === "clinic_admin") {
    fullUser = await clinicAdminRepository.findOneById(user.id);
  } else if (user.role === "doctor") {
    fullUser = await doctorRepository.findOneById(user.id);
  } else if (user.role === "patient") {
    fullUser = await patientRepository.findOneById(user.id);
  } else {
    throw new HTTPException(500, {
      message: `Unknown user role: ${user.role}`,
    });
  }

  // 一般不会走到这一步。
  if (!fullUser) {
    throw new HTTPException(404, { message: "User not found" });
  }

  // 为其颁发 JWT。
  const token = await signJwt({ id: user.id, role: user.role });

  return { ...fullUser, token };
}
