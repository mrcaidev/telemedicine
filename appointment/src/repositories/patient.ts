import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { Patient } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, nickname, avatar_url
    from patients
    where id = ${id}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as Patient;
}

export async function findOneWithEmailById(id: string) {
  const [row] = await sql`
    select id, email, nickname, avatar_url
    from patients
    where id = ${id}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as Patient & { email: string };
}

export async function createOne(data: Patient & { email: string }) {
  await sql`insert into patients ${sql(camelToSnakeJson(data))}`;
}

export async function updateOneById(
  id: string,
  data: Partial<Pick<Patient, "nickname" | "avatarUrl">> & { email?: string },
) {
  await sql`
    update patients
    set ${sql(camelToSnakeJson(data))}
    where id = ${id}
  `;
}
