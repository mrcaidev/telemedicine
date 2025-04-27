import type { PlatformAdmin } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select
      u.id,
      u.role,
      u.email
    from platform_admins pa
    left outer join users u on pa.id = u.id
    where u.id = ${id} and u.deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    role: row.role,
    email: row.email,
  } as PlatformAdmin;
}
