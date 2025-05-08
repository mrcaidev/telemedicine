import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type {
  DoctorFullProfile,
  DoctorProfile,
  PartiallyRequired,
} from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, clinic_id, first_name, last_name, avatar_url, gender, description, specialties
    from doctor_profiles
    where id = ${id}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as DoctorProfile;
}

export async function findOneFullById(id: string) {
  const [row] = await sql`
    select dp.id, dp.first_name, dp.last_name, dp.avatar_url, dp.gender, dp.description, dp.specialties, c.id as clinic_id, c.name as clinic_name
    from doctor_profiles dp
    left outer join clinics c on dp.clinic_id = c.id
    where dp.id = ${id}
  `;

  if (!row) {
    return null;
  }

  const { clinicId, clinicName, ...rest } = snakeToCamelJson(row);
  return {
    ...rest,
    clinic: { id: clinicId, name: clinicName },
  } as DoctorFullProfile;
}

export async function createOne(
  data: PartiallyRequired<
    DoctorProfile,
    "id" | "clinicId" | "firstName" | "lastName"
  > & { createdBy: string },
) {
  const [row] = await sql`
    insert into doctor_profiles ${sql(camelToSnakeJson(data))}
    returning id, clinic_id, first_name, last_name, avatar_url, gender, description, specialties
  `;

  if (!row) {
    throw new Error("failed to create doctor profile");
  }

  return snakeToCamelJson(row) as DoctorProfile;
}

export async function searchManyFull(query: {
  q: string;
  limit: number;
  maxSimilarity: number;
}) {
  const rows = await sql`
    with matched_doctor_profiles as (
      select *, ts_rank_cd(fts, plainto_tsquery('english', ${query.q})) as similarity
      from doctor_profiles
      where fts @@ plainto_tsquery('english', ${query.q})
      and ts_rank_cd(fts, plainto_tsquery('english', ${query.q})) < ${query.maxSimilarity}
      order by similarity desc
      limit ${query.limit}
    )
    select mdp.similarity, mdp.id, mdp.first_name, mdp.last_name, mdp.avatar_url, mdp.gender, mdp.description, mdp.specialties, c.id as clinic_id, c.name as clinic_name
    from matched_doctor_profiles mdp
    left outer join clinics c on mdp.clinic_id = c.id
  `;

  // @ts-ignore
  return snakeToCamelJson(rows).map((row) => {
    const { clinicId, clinicName, ...rest } = row;
    return { ...rest, clinic: { id: clinicId, name: clinicName } };
  }) as (DoctorFullProfile & { similarity: number })[];
}
