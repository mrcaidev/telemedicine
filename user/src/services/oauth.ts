import { publishPatientCreatedEvent } from "@/events/producer";
import * as googleIdentityRepository from "@/repositories/google-identity";
import * as patientRepository from "@/repositories/patient";
import * as userRepository from "@/repositories/user";
import { verifyGoogleIdToken } from "@/utils/id-token";
import { signJwt } from "@/utils/jwt";
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
    const patient = await patientRepository.findOneById(googleIdentity.id);
    if (!patient) {
      throw new HTTPException(404, { message: "Patient not found" });
    }

    const token = await signJwt({ id: patient.id, role: patient.role });

    return { ...patient, token };
  }

  // 如果没找到，说明用户是第一次使用 Google 登录。
  // 在这种情况下，如果用户的 Google 邮箱已经存在于本平台上，
  // 就把当前的 Google 身份绑定到本平台的这个邮箱上。
  // 然后，还是以本平台的身份登录。
  const existingPatient = await patientRepository.findOneByEmail(
    idTokenPayload.email,
  );
  if (existingPatient) {
    await googleIdentityRepository.insertOne({
      id: existingPatient.id,
      googleId: idTokenPayload.sub,
    });

    const token = await signJwt({
      id: existingPatient.id,
      role: existingPatient.role,
    });
    return { ...existingPatient, token };
  }

  // 如果 Google 邮箱也不在本平台，那么我们就无从知晓用户是否使用过本平台了。
  // 我们只能为其创建新账户，然后将 Google 身份与其绑定。
  // 然后，以这个新身份登录。
  const user = await userRepository.insertOne({
    role: "patient",
    email: idTokenPayload.email,
    passwordHash: null,
  });
  const patient = await patientRepository.insertOne({
    id: user.id,
    nickname: idTokenPayload.name,
    avatarUrl: idTokenPayload.picture,
  });
  await googleIdentityRepository.insertOne({
    id: patient.id,
    googleId: idTokenPayload.sub,
  });

  // 发布事件。
  await publishPatientCreatedEvent(patient);

  const token = await signJwt({ id: user.id, role: user.role });
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
