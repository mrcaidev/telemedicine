import * as accountRepository from "@/repositories/account";
import * as auditLogRepository from "@/repositories/audit-log";
import * as platformAdminProfileRepository from "@/repositories/platform-admin-profile";
import { HTTPException } from "hono/http-exception";

export async function findById(id: string) {
  const platformAdmin = await platformAdminProfileRepository.selectOneById(id);

  if (!platformAdmin) {
    throw new HTTPException(404, { message: "Platform admin not found" });
  }

  return platformAdmin;
}

export async function create(data: { email: string; password: string }) {
  const conflictedAccount = await accountRepository.selectOneByEmail(
    data.email,
  );
  if (conflictedAccount) {
    throw new HTTPException(409, {
      message: "This email has already been registered",
    });
  }

  const passwordHash = await Bun.password.hash(data.password);

  const account = await accountRepository.insertOne({
    role: "platform_admin",
    email: data.email,
    passwordHash,
  });

  const platformAdmin = await platformAdminProfileRepository.insertOne({
    id: account.id,
  });

  await auditLogRepository.insertOne({
    userId: account.id,
    action: "register_with_email_and_password",
  });

  return platformAdmin;
}
