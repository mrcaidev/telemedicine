import type { User } from "@/types";
import { sign, verify } from "hono/jwt";

type Payload = Pick<User, "id" | "role">;

const JWT_SECRET = Bun.env.JWT_SECRET;

export async function signJwt(payload: Payload) {
  return await sign(payload, JWT_SECRET);
}

export async function verifyJwt(token: string) {
  const { id, role } = await verify(token, JWT_SECRET);
  return { id, role } as Payload;
}
