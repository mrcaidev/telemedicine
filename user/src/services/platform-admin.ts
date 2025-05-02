import * as accountRepository from "@/repositories/account";
import * as platformAdminProfileRepository from "@/repositories/platform-admin-profile";
import type { PlatformAdmin } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findOneById(id: string) {
  const account = await accountRepository.findOneById(id);
  if (!account) {
    throw new HTTPException(404, {
      message: "This platform admin does not exist",
    });
  }

  const profile = await platformAdminProfileRepository.findOneById(id);
  if (!profile) {
    throw new HTTPException(404, {
      message: "This platform admin does not exist",
    });
  }

  return { ...account, ...profile } as PlatformAdmin;
}

export async function createOne(data: { email: string; password: string }) {
  // 如果该邮箱已经注册过了，就拒绝再次注册。
  const existingAccount = await accountRepository.findOneByEmail(data.email);
  if (existingAccount) {
    throw new HTTPException(409, {
      message: "This email has already been registered",
    });
  }

  // 密码加盐。
  const passwordHash = await Bun.password.hash(data.password);

  // 创建账户。
  const account = await accountRepository.createOne({
    role: "platform_admin",
    email: data.email,
    passwordHash,
  });

  // 创建资料。
  const profile = await platformAdminProfileRepository.createOne({
    id: account.id,
  });

  return { ...account, ...profile } as PlatformAdmin;
}
