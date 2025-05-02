import { sign, verify } from "hono/jwt";
import type { Account } from "./types";

type Payload = Account;

const JWT_SECRET = Bun.env.JWT_SECRET;

export async function signJwt(payload: Payload) {
  return await sign(payload, JWT_SECRET);
}

export async function verifyJwt(token: string) {
  const { id, role, email } = await verify(token, JWT_SECRET);
  return { id, role, email } as Payload;
}
