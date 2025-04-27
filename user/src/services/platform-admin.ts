import * as platformAdminRepository from "@/repositories/platform-admin";
import * as userRepository from "@/repositories/user";
import { HTTPException } from "hono/http-exception";

export async function findOneById(id: string) {
  const platformAdmin = await platformAdminRepository.findOneById(id);

  if (!platformAdmin) {
    throw new HTTPException(404, { message: "Platform admin not found" });
  }

  return platformAdmin;
}

export async function createOne(data: { email: string; password: string }) {
  // 密码加盐。
  const passwordHash = await Bun.password.hash(data.password);

  // 创建用户。
  const user = await userRepository.insertOne({
    role: "platform_admin",
    email: data.email,
    passwordHash,
  });

  // 创建平台管理员。
  await platformAdminRepository.insertOne({ id: user.id });

  return { id: user.id, role: user.role, email: user.email };
}
