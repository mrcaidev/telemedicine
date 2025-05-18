import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { PartiallyRequired, Patient, PatientProfile } from "@/utils/types";
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

export async function updateOneById(
  id: string,
  data: Partial<Pick<PatientProfile, "nickname" | "gender" | "birthDate">>,
) {
  const [row] = await sql`
    with updated as (
      update patient_profiles
      set ${sql(camelToSnakeJson(data))}
      where id = ${id}
      returning id, nickname, avatar_url, gender, birth_date
    )
    select u.id, u.nickname, u.avatar_url, u.gender, u.birth_date, a.role, a.email
    from updated u
    left join accounts a on u.id = a.id
  `;

  if (!row) {
    throw new Error("failed to update patient profile");
  }

  return snakeToCamelJson(row) as Patient;
}
