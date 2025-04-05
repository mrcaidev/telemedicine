import * as userRepository from "@/repositories/user";
import type { User } from "@/types";
import { signJwt } from "@/utils/jwt";
import {
  generatePasswordSalt,
  hashPassword,
  verifyPassword,
} from "@/utils/password";
import { HTTPException } from "hono/http-exception";

export async function getUserById(id: string) {
  const user = await userRepository.findOneById(id);
  if (!user) {
    throw new HTTPException(404, { message: "This user does not exist" });
  }

  return { id, email: user.email };
}

export async function registerWithEmailPassword(
  role: User["role"],
  email: string,
  password: string,
) {
  // 检查邮箱是否已经注册。
  const oldUser = await userRepository.findOneByEmail(email);
  if (oldUser) {
    throw new HTTPException(409, {
      message: "This email is already registered",
    });
  }

  // 加盐哈希密码。
  const passwordSalt = generatePasswordSalt();
  const passwordHash = await hashPassword(password, passwordSalt);

  // 创建用户。
  const newUser = await userRepository.insertOne({
    role,
    email,
    passwordHash,
    passwordSalt,
  });

  // 颁发 JWT。
  const token = await signJwt({ id: newUser.id, role: newUser.role });

  return { id: newUser.id, email, token };
}

export async function loginWithEmailPassword(email: string, password: string) {
  // 找到这个邮箱对应的用户。
  const user = await userRepository.findOneByEmail(email);
  if (!user) {
    throw new HTTPException(404, {
      message: "This email is not registered",
    });
  }

  // 如果没有密码，说明这个用户是病人，并且使用了 OAuth 注册。无法继续流程。
  const { id, role, passwordHash, passwordSalt } = user;
  if (!passwordHash || !passwordSalt) {
    throw new HTTPException(401, {
      message: "Password login is not enabled for this account",
    });
  }

  // 验证密码。
  const verified = await verifyPassword(password, passwordSalt, passwordHash);
  if (!verified) {
    throw new HTTPException(401, { message: "Wrong password. Try again?" });
  }

  // 颁发 JWT。
  const token = await signJwt({ id, role });

  return { id, email, token };
}
