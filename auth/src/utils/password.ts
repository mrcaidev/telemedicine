import { randomBytes, scrypt } from "node:crypto";

export function generatePasswordSalt() {
  return randomBytes(16).toString("hex");
}

export async function hashPassword(password: string, salt: string) {
  return await new Promise<string>((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
      } else {
        resolve(derivedKey.toString("hex"));
      }
    });
  });
}

export async function verifyPassword(
  attempt: string,
  salt: string,
  target: string,
) {
  const attemptHash = await hashPassword(attempt, salt);
  return attemptHash === target;
}
