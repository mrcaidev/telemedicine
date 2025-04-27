import type { UserCommon } from "@/utils/types";
import { sql } from "bun";
import { HTTPException } from "hono/http-exception";

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, role, email, password_hash
    from users
    where id = ${id} and deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    role: row.role,
    email: row.email,
    passwordHash: row.password_hash,
  } as UserCommon;
}

export async function findOneByEmail(email: string) {
  const [row] = await sql`
    select id, role, email, password_hash
    from users
    where email = ${email} and deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    role: row.role,
    email: row.email,
    passwordHash: row.password_hash,
  } as UserCommon;
}

export async function insertOne(
  data: Pick<UserCommon, "role" | "email" | "passwordHash">,
) {
  const [row] = await sql`
    insert into users ${sql({ role: data.role, email: data.email, password_hash: data.passwordHash })}
    returning id, role, email, password_hash
  `;

  if (!row) {
    throw new HTTPException(500, { message: "Failed to insert user" });
  }

  return {
    id: row.id,
    role: row.role,
    email: row.email,
    passwordHash: row.password_hash,
  } as UserCommon;
}
