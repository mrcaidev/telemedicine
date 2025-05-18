import {
  camelToSnakeJson,
  camelToSnakeString,
  snakeToCamelJson,
} from "@/utils/case";
import type {
  Doctor,
  DoctorFullProfile,
  DoctorProfile,
  PartiallyRequired,
} from "@/utils/types";
import { sql } from "bun";

export async function findManyFull(query: {
  clinicId?: string;
  sortBy: "createdAt";
  sortOrder: "asc" | "desc";
  limit: number;
  cursor?: string;
}) {
  const rows = await sql`
    select dp.id, dp.first_name, dp.last_name, dp.avatar_url, dp.gender, dp.description, dp.specialties, a.role, a.email, a.created_at, c.id as clinic_id, c.name as clinic_name
    from doctor_profiles dp
    left outer join accounts a on dp.id = a.id
    left outer join clinics c on dp.clinic_id = c.id
    where true
    ${query.clinicId ? sql`and dp.clinic_id = ${query.clinicId}` : sql``}
    ${!query.cursor ? sql`` : query.sortOrder === "asc" ? sql`and a.${sql.unsafe(camelToSnakeString(query.sortBy))} > ${query.cursor}` : sql`and a.${sql.unsafe(camelToSnakeString(query.sortBy))} < ${query.cursor}`}
    order by a.${sql.unsafe(camelToSnakeString(query.sortBy))} ${sql.unsafe(query.sortOrder)}
    limit ${query.limit}
  `;

  // @ts-ignore
  return rows.map((row) => {
    const { clinicId, clinicName, ...rest } = snakeToCamelJson(row);
    return {
      ...rest,
      clinic: { id: clinicId, name: clinicName },
    };
  }) as (Doctor & { createdAt: string })[];
}

export async function findManyFullRandom(query: { limit: number }) {
  const rows = await sql`
    select dp.id, dp.first_name, dp.last_name, dp.avatar_url, dp.gender, dp.description, dp.specialties, a.role, a.email, c.id as clinic_id, c.name as clinic_name
    from doctor_profiles dp
    left outer join accounts a on dp.id = a.id
    left outer join clinics c on dp.clinic_id = c.id
    order by random()
    limit ${query.limit}
  `;

  // @ts-ignore
  return rows.map((row) => {
    const { clinicId, clinicName, ...rest } = snakeToCamelJson(row);
    return {
      ...rest,
      clinic: { id: clinicId, name: clinicName },
    };
  }) as Doctor[];
}

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

export async function updateOneById(
  id: string,
  data: Partial<
    Pick<
      DoctorProfile,
      "firstName" | "lastName" | "description" | "gender" | "specialties"
    >
  >,
) {
  const [row] = await sql`
    with updated as (
      update doctor_profiles
      set ${sql(camelToSnakeJson(data))}
      where id = ${id}
      returning id, clinic_id, first_name, last_name, avatar_url, description, gender, specialties
    )
    select u.id, u.clinic_id, u.first_name, u.last_name, u.avatar_url, u.description, u.gender, u.specialties, a.role, a.email, c.id as clinic_id, c.name as clinic_name
    from updated u
    left outer join accounts a on u.id = a.id
    left outer join clinics c on u.clinic_id = c.id
    where a.id = ${id}
  `;

  if (!row) {
    throw new Error("failed to update doctor profile");
  }

  const { clinicId, clinicName, ...rest } = snakeToCamelJson(row);
  return {
    ...rest,
    clinic: { id: clinicId, name: clinicName },
  } as Doctor;
}

export async function deleteOneById(id: string, deletedBy: string) {
  await sql`
    update doctor_profiles
    set deleted_by = ${deletedBy}
    where id = ${id}
  `;
}
