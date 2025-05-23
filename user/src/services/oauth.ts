import { produceEvent } from "@/events/producer";
import * as accountRepository from "@/repositories/account";
import * as auditLogRepository from "@/repositories/audit-log";
import * as googleIdentityRepository from "@/repositories/google-identity";
import * as patientProfileRepository from "@/repositories/patient-profile";
import { verifyGoogleIdToken } from "@/utils/id-token";
import { signJwt } from "@/utils/jwt";
import { HTTPException } from "hono/http-exception";

export async function logInWithGoogle(idToken: string) {
  // 解析 Google 的 ID 令牌。
  const idTokenPayload = await verifyGoogleIdToken(idToken);

  // 找到 Google 身份和本平台身份的映射关系。
  const googleIdentity = await googleIdentityRepository.selectOneByGoogleId(
    idTokenPayload.sub,
  );

  // 如果找到了，就以该身份登录。
  if (googleIdentity) {
    const patient = await patientProfileRepository.selectOneById(
      googleIdentity.userId,
    );
    if (!patient) {
      throw new HTTPException(404, { message: "User not found" });
    }

    const token = await signJwt(patient);

    await auditLogRepository.insertOne({
      userId: patient.id,
      action: "log_in_with_google",
    });

    return { ...patient, token };
  }

  // 如果没找到，说明用户是第一次使用 Google 登录。
  // 在这种情况下，如果用户的 Google 邮箱已经存在于本平台上，
  // 就把当前的 Google 身份绑定到本平台的这个邮箱上。
  // 然后，还是以本平台的身份登录。
  const existingAccount = await accountRepository.selectOneByEmail(
    idTokenPayload.email,
  );
  if (existingAccount) {
    await googleIdentityRepository.insertOne({
      userId: existingAccount.id,
      googleId: idTokenPayload.sub,
    });

    const patient = await patientProfileRepository.selectOneById(
      existingAccount.id,
    );
    if (!patient) {
      throw new HTTPException(404, { message: "Patient not found" });
    }

    const token = await signJwt(existingAccount);

    await auditLogRepository.insertMany([
      {
        userId: existingAccount.id,
        action: "link_to_google",
      },
      {
        userId: existingAccount.id,
        action: "log_in_with_google",
      },
    ]);

    return { ...patient, token };
  }

  // 如果 Google 邮箱也不在本平台，那么我们就无从知晓用户是否使用过本平台了。
  // 我们只能为其创建新账户，然后将 Google 身份与其绑定。
  // 然后，以这个新身份登录。
  const account = await accountRepository.insertOne({
    role: "patient",
    email: idTokenPayload.email,
  });

  const patient = await patientProfileRepository.insertOne({
    id: account.id,
    nickname: idTokenPayload.name,
    avatarUrl: idTokenPayload.picture,
  });

  await googleIdentityRepository.insertOne({
    userId: account.id,
    googleId: idTokenPayload.sub,
  });

  const token = await signJwt(account);

  await auditLogRepository.insertMany([
    {
      userId: account.id,
      action: "register_with_google",
    },
    {
      userId: account.id,
      action: "log_in_with_google",
    },
  ]);

  await produceEvent("PatientCreated", patient);

  return { ...patient, token };
}
