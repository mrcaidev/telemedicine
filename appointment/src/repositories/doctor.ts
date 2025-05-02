import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { Doctor } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, first_name, last_name, avatar_url
    from doctors
    where id = ${id}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as Doctor;
}

export async function createOne(data: Doctor) {
  await sql`insert into doctors ${sql(camelToSnakeJson(data))}`;
}
