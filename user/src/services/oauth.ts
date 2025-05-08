import { publishPatientCreatedEvent } from "@/events/producer";
import * as accountRepository from "@/repositories/account";
import * as auditLogRepository from "@/repositories/audit-log";
import * as googleIdentityRepository from "@/repositories/google-identity";
import * as patientProfileRepository from "@/repositories/patient-profile";
import { verifyGoogleIdToken } from "@/utils/id-token";
import { signJwt } from "@/utils/jwt";
import type { Patient } from "@/utils/types";
import { HTTPException } from "hono/http-exception";

export async function logInWithGoogle(idToken: string) {
  // 解析 Google 的 ID 令牌。
  const idTokenPayload = await verifyGoogleIdToken(idToken);

  // 找到 Google 身份和本平台身份的映射关系。
  const googleIdentity = await googleIdentityRepository.findOneByGoogleId(
    idTokenPayload.sub,
  );

  // 如果找到了，就以该身份登录。
  if (googleIdentity) {
    const account = await accountRepository.findOneById(googleIdentity.id);
    if (!account) {
      throw new HTTPException(404, { message: "This patient does not exist" });
    }

    const profile = await patientProfileRepository.findOneById(
      googleIdentity.id,
    );
    if (!profile) {
      throw new HTTPException(404, { message: "This patient does not exist" });
    }

    await auditLogRepository.createOne({
      userId: account.id,
      action: "log_in_with_google",
    });

    const token = await signJwt(account);

    return { ...account, ...profile, token } as Patient & { token: string };
  }

  // 如果没找到，说明用户是第一次使用 Google 登录。
  // 在这种情况下，如果用户的 Google 邮箱已经存在于本平台上，
  // 就把当前的 Google 身份绑定到本平台的这个邮箱上。
  // 然后，还是以本平台的身份登录。
  const existingAccount = await accountRepository.findOneByEmail(
    idTokenPayload.email,
  );
  if (existingAccount) {
    await googleIdentityRepository.createOne({
      id: existingAccount.id,
      googleId: idTokenPayload.sub,
    });

    // 记录到审计日志。
    await auditLogRepository.createOne({
      userId: existingAccount.id,
      action: "link_to_google",
    });

    const profile = await patientProfileRepository.findOneById(
      existingAccount.id,
    );
    if (!profile) {
      throw new HTTPException(404, { message: "This patient does not exist" });
    }

    const token = await signJwt(existingAccount);

    // 记录到审计日志。
    await auditLogRepository.createOne({
      userId: existingAccount.id,
      action: "log_in_with_google",
    });

    return { ...existingAccount, ...profile, token } as Patient & {
      token: string;
    };
  }

  // 如果 Google 邮箱也不在本平台，那么我们就无从知晓用户是否使用过本平台了。
  // 我们只能为其创建新账户，然后将 Google 身份与其绑定。
  // 然后，以这个新身份登录。
  const account = await accountRepository.createOne({
    role: "patient",
    email: idTokenPayload.email,
  });

  const profile = await patientProfileRepository.createOne({
    id: account.id,
    nickname: idTokenPayload.name,
    avatarUrl: idTokenPayload.picture,
  });

  await googleIdentityRepository.createOne({
    id: account.id,
    googleId: idTokenPayload.sub,
  });

  // 记录到审计日志。
  await auditLogRepository.createOne({
    userId: account.id,
    action: "register_with_google",
  });

  const patient = { ...account, ...profile };

  // 发布事件。
  await publishPatientCreatedEvent(patient);

  const token = await signJwt(account);

  // 记录到审计日志。
  await auditLogRepository.createOne({
    userId: account.id,
    action: "log_in_with_google",
  });

  return { ...patient, token } as Patient & { token: string };
}
