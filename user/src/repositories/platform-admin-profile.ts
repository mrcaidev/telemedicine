import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { PlatformAdminProfile } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select id
    from platform_admin_profiles
    where id = ${id}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as PlatformAdminProfile;
}

export async function createOne(data: PlatformAdminProfile) {
  const [row] = await sql`
    insert into platform_admin_profiles ${sql(camelToSnakeJson(data))}
    returning id
  `;

  if (!row) {
    throw new Error("failed to create platform admin profile");
  }

  return snakeToCamelJson(row) as PlatformAdminProfile;
}
