import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { Patient, WithFull } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select u.id, u.role, u.email, p.nickname, p.avatar_url, p.gender, p.birth_date
    from patients p
    left outer join users u on p.id = u.id
    where u.id = ${id} and u.deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as WithFull<Patient>;
}

export async function insertOne(data: Pick<Patient, "id">) {
  const [row] = await sql`
    insert into patients ${sql(camelToSnakeJson(data))}
    returning id, nickname, avatar_url, gender, birth_date
  `;

  if (!row) {
    throw new Error("failed to insert patient");
  }

  return snakeToCamelJson(row) as Patient;
}
