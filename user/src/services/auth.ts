import * as accountRepository from "@/repositories/account";
import * as auditLogRepository from "@/repositories/audit-log";
import * as clinicAdminProfileRepository from "@/repositories/clinic-admin-profile";
import * as doctorProfileRepository from "@/repositories/doctor-profile";
import * as patientProfileRepository from "@/repositories/patient-profile";
import * as platformAdminProfileRepository from "@/repositories/platform-admin-profile";
import * as otpVerificationService from "@/services/otp-verification";
import { signJwt } from "@/utils/jwt";
import type { Account, Actor, User } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findCurrentUser(actor: Actor) {
  // 虽然中间件已经验证了 JWT 的合法性，
  // 但那只能说明 JWT 中携带的账户信息一定“曾经”是真实有效的。
  // 然而，用户之后可能修改或删除了自己的账户，
  // 而这种修改可能并不会立刻同步到 JWT 中。
  // 所以，我们还是要保证拿到最新、最正确的账户信息。
  const account = await accountRepository.selectOneById(actor.id);
  if (!account) {
    throw new HTTPException(404, { message: "User not found" });
  }

  const user = await findUserByAccount(account);
  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  return user;
}

export async function logInWithEmailAndPassword(
  email: string,
  password: string,
) {
  const privateAccount = await accountRepository.selectOnePrivateByEmail(email);
  if (!privateAccount) {
    throw new HTTPException(404, {
      message:
        "This email has not yet been registered. Do you want to register one instead?",
    });
  }
  const { passwordHash, ...account } = privateAccount;

  // 如果密码是 null，说明这个用户是通过 OAuth 注册的病人。
  // 既然没有密码，就无法继续该流程。
  if (!passwordHash) {
    throw new HTTPException(401, {
      message:
        "Password login is not enabled for this account. Please try OAuth login instead",
    });
  }

  // 验证密码。
  const verified = await Bun.password.verify(password, passwordHash);
  if (!verified) {
    throw new HTTPException(401, { message: "Wrong password" });
  }

  // 查资料。
  const user = await findUserByAccount(account);
  if (!user) {
    throw new HTTPException(404, {
      message:
        "We found your account but can't retrieve your profile. Please try again in a few minutes",
    });
  }

  // 颁发 JWT。
  const token = await signJwt(account);

  // 记录到审计日志。
  await auditLogRepository.insertOne({
    userId: account.id,
    action: "log_in_with_email_and_password",
  });

  return { ...user, token };
}

export async function logOut(actor: Actor) {
  // 记录到审计日志。
  await auditLogRepository.insertOne({ userId: actor.id, action: "log_out" });

  // TODO：未来可以做 active token 管理。
}

async function findUserByAccount(account: Account): Promise<User | null> {
  if (account.role === "platform_admin") {
    return await platformAdminProfileRepository.selectOneById(account.id);
  }
  if (account.role === "clinic_admin") {
    return await clinicAdminProfileRepository.selectOneById(account.id);
  }
  if (account.role === "doctor") {
    return await doctorProfileRepository.selectOneById(account.id);
  }
  if (account.role === "patient") {
    return await patientProfileRepository.selectOneById(account.id);
  }
  throw new Error(
    `unknown role when finding user for account: ${JSON.stringify(account)}`,
  );
}

export async function updateEmail(
  data: { email: string; otp: string },
  actor: Actor,
) {
  const account = await accountRepository.selectOneById(actor.id);
  if (!account) {
    throw new HTTPException(404, { message: "User not found" });
  }

  // 新邮箱不能和其他人冲突。
  const conflictedAccount = await accountRepository.selectOneByEmail(
    data.email,
  );
  if (conflictedAccount) {
    throw new HTTPException(409, { message: "This email is already in use" });
  }

  // 验证 OTP。
  await otpVerificationService.verifyOtp(data.email, data.otp);

  await accountRepository.updateOneById(actor.id, { email: data.email });

  await auditLogRepository.insertOne({
    userId: account.id,
    action: "update_email",
  });
}

export async function updatePassword(
  data: {
    oldPassword: string;
    newPassword: string;
  },
  actor: Actor,
) {
  const privateAccount = await accountRepository.selectOnePrivateById(actor.id);
  if (!privateAccount) {
    throw new HTTPException(404, { message: "User not found" });
  }

  // 如果密码不是 null，说明这个用户之前设置过密码。需要验证旧密码是否匹配。
  // 否则，说明这个用户是通过 OAuth 注册的病人。直接为其更新密码。
  if (privateAccount.passwordHash !== null) {
    const verified = await Bun.password.verify(
      data.oldPassword,
      privateAccount.passwordHash,
    );
    if (!verified) {
      throw new HTTPException(401, { message: "Wrong password" });
    }
  }

  const passwordHash = await Bun.password.hash(data.newPassword);

  await accountRepository.updateOneById(actor.id, { passwordHash });

  await auditLogRepository.insertOne({
    userId: privateAccount.id,
    action: "update_password",
  });
}

export async function resetPassword(data: {
  email: string;
  password: string;
  otp: string;
}) {
  const account = await accountRepository.selectOneByEmail(data.email);
  if (!account) {
    throw new HTTPException(404, {
      message: "This email has not yet been registered",
    });
  }

  // 验证 OTP。
  await otpVerificationService.verifyOtp(data.email, data.otp);

  const passwordHash = await Bun.password.hash(data.password);

  await accountRepository.updateOneById(account.id, { passwordHash });

  await auditLogRepository.insertOne({
    userId: account.id,
    action: "reset_password",
  });
}
