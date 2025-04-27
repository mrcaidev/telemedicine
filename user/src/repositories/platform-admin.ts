import { snakeToCamelJson } from "@/utils/case";
import type { PlatformAdmin, WithFull } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select u.id, u.role, u.email
    from platform_admins pa
    left outer join users u on pa.id = u.id
    where u.id = ${id} and u.deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as WithFull<PlatformAdmin>;
}
