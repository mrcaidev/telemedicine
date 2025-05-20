import { sign, verify } from "hono/jwt";
import type { Actor } from "./types";

const JWT_SECRET = Bun.env.JWT_SECRET;

export async function signJwt(payload: Actor) {
  const { id, role, email } = payload;
  return await sign({ id, role, email }, JWT_SECRET);
}

export async function verifyJwt(token: string) {
  const { id, role, email } = await verify(token, JWT_SECRET);
  return { id, role, email } as Actor;
}
