import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { PartiallyRequired, PatientProfile } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, nickname, avatar_url, gender, birth_date
    from patient_profiles
    where id = ${id}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as PatientProfile;
}

export async function createOne(data: PartiallyRequired<PatientProfile, "id">) {
  const [row] = await sql`
    insert into patient_profiles ${sql(camelToSnakeJson(data))}
    returning id, nickname, avatar_url, gender, birth_date
  `;

  if (!row) {
    throw new Error("failed to create patient profile");
  }

  return snakeToCamelJson(row) as PatientProfile;
}
