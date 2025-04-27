import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
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

export async function insertOne(data: Pick<PlatformAdmin, "id">) {
  const [row] = await sql`
    insert into platform_admins ${sql(camelToSnakeJson(data))}
    returning id
  `;

  if (!row) {
    throw new Error("failed to insert platform admin");
  }

  return snakeToCamelJson(row) as PlatformAdmin;
}
