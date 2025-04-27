import type { UserCommon } from "@/utils/types";
import { sql } from "bun";

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
