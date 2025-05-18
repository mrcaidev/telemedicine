import * as accountRepository from "@/repositories/account";
import * as auditLogRepository from "@/repositories/audit-log";
import * as clinicAdminProfileRepository from "@/repositories/clinic-admin-profile";
import * as doctorProfileRepository from "@/repositories/doctor-profile";
import * as patientProfileRepository from "@/repositories/patient-profile";
import * as platformAdminProfileRepository from "@/repositories/platform-admin-profile";
import * as otpVerificationService from "@/services/otp-verification";
import { signJwt } from "@/utils/jwt";
import type { Account, User, UserFullProfile } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function findCurrentUser(actor: Account) {
  // 虽然中间件已经验证了 JWT 的合法性，
  // 但那只能说明 JWT 中携带的账户信息一定“曾经”是真实有效的。
  // 然而，用户之后可能修改或删除了自己的账户，
  // 而这种修改可能并不会立刻同步到 JWT 中。
  // 所以，我们还是要保证拿到最新、最正确的账户信息。
  const account = await accountRepository.findOneById(actor.id);
  if (!account) {
    throw new HTTPException(404, { message: "This account does not exist" });
  }

  const fullProfile = await findFullProfileByAccount(account);
  if (!fullProfile) {
    throw new HTTPException(404, {
      message:
        "We found your account but can't retrieve your profile. Please try again in a few minutes",
    });
  }

  return { ...account, ...fullProfile } as User;
}

export async function logInWithEmailAndPassword(
  email: string,
  password: string,
) {
  // 查账户，顺便拿到密码哈希。
  const accountWithPasswordHash =
    await accountRepository.findOneWithPasswordHashByEmail(email);
  if (!accountWithPasswordHash) {
    throw new HTTPException(404, {
      message:
        "This email has not yet been registered. Do you want to register one instead?",
    });
  }
  const { passwordHash, ...account } = accountWithPasswordHash;

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
  const fullProfile = await findFullProfileByAccount(account);
  if (!fullProfile) {
    throw new HTTPException(404, {
      message:
        "We found your account but can't retrieve your profile. Please try again in a few minutes",
    });
  }

  // 颁发 JWT。
  const token = await signJwt(account);

  // 记录到审计日志。
  await auditLogRepository.createOne({
    userId: account.id,
    action: "log_in_with_email_and_password",
  });

  return { ...account, ...fullProfile, token } as User & { token: string };
}

export async function logOut(actor: Account) {
  // 记录到审计日志。
  await auditLogRepository.createOne({ userId: actor.id, action: "log_out" });

  // TODO：未来可以做 active token 管理。
}

async function findFullProfileByAccount(
  account: Account,
): Promise<UserFullProfile | null> {
  if (account.role === "platform_admin") {
    return await platformAdminProfileRepository.findOneById(account.id);
  }
  if (account.role === "clinic_admin") {
    return await clinicAdminProfileRepository.findOneFullById(account.id);
  }
  if (account.role === "doctor") {
    return await doctorProfileRepository.findOneFullById(account.id);
  }
  if (account.role === "patient") {
    return await patientProfileRepository.findOneById(account.id);
  }
  throw new Error(
    `met unknown role when finding profile for account: ${JSON.stringify(account)}`,
  );
}

export async function updateEmail(
  data: { email: string; otp: string },
  actor: Account,
) {
  const account = await accountRepository.findOneById(actor.id);
  if (!account) {
    throw new HTTPException(404, { message: "This account does not exist" });
  }

  // 新邮箱不能和其他人冲突。
  const conflictedAccount = await accountRepository.findOneByEmail(data.email);
  if (conflictedAccount) {
    throw new HTTPException(409, { message: "This email is already in use" });
  }

  // 验证 OTP。
  await otpVerificationService.verifyOtp(data.email, data.otp);

  await accountRepository.updateOneEmailById(actor.id, data.email);

  await auditLogRepository.createOne({
    userId: account.id,
    action: "update_email",
  });
}

export async function updatePassword(
  data: {
    oldPassword: string;
    newPassword: string;
  },
  actor: Account,
) {
  const account = await accountRepository.findOneWithPasswordHashById(actor.id);
  if (!account) {
    throw new HTTPException(404, { message: "This account does not exist" });
  }

  const verified = await Bun.password.verify(
    data.oldPassword,
    account.passwordHash,
  );
  if (!verified) {
    throw new HTTPException(401, { message: "Wrong password" });
  }

  const passwordHash = await Bun.password.hash(data.newPassword);

  await accountRepository.updateOnePasswordHashById(actor.id, passwordHash);

  await auditLogRepository.createOne({
    userId: account.id,
    action: "update_password",
  });
}

export async function resetPassword(data: {
  email: string;
  password: string;
  otp: string;
}) {
  const account = await accountRepository.findOneByEmail(data.email);
  if (!account) {
    throw new HTTPException(404, {
      message: "This email has not yet been registered",
    });
  }

  // 验证 OTP。
  await otpVerificationService.verifyOtp(data.email, data.otp);

  const passwordHash = await Bun.password.hash(data.password);

  await accountRepository.updateOnePasswordHashById(account.id, passwordHash);

  await auditLogRepository.createOne({
    userId: account.id,
    action: "reset_password",
  });
}
