import { camelToSnakeJson, camelToSnakeString } from "@/utils/case";
import type {
  Doctor,
  DoctorFullProfile,
  DoctorProfile,
  Gender,
  PartiallyRequired,
  Role,
} from "@/utils/types";
import { sql } from "bun";

type ProfileRow = {
  id: string;
  clinic_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  gender: Gender;
  description: string;
  specialties: string[];
};

function normalizeProfileRow(row: ProfileRow): DoctorProfile {
  return {
    id: row.id,
    clinicId: row.clinic_id,
    firstName: row.first_name,
    lastName: row.last_name,
    avatarUrl: row.avatar_url,
    gender: row.gender,
    description: row.description,
    specialties: row.specialties,
  };
}

type FullProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  gender: Gender;
  description: string;
  specialties: string[];
  clinic_id: string;
  clinic_name: string;
  clinic_created_at: Date;
};

function normalizeFullProfileRow(row: FullProfileRow): DoctorFullProfile {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    avatarUrl: row.avatar_url,
    gender: row.gender,
    description: row.description,
    specialties: row.specialties,
    clinic: {
      id: row.clinic_id,
      name: row.clinic_name,
      createdAt: row.clinic_created_at.toISOString(),
    },
  };
}

type Row = {
  id: string;
  role: Role;
  email: string;
  created_at: Date;
  first_name: string;
  last_name: string;
  avatar_url: string;
  gender: Gender;
  description: string;
  specialties: string[];
  clinic_id: string;
  clinic_name: string;
  clinic_created_at: Date;
};

function normalizeRow(row: Row): Doctor {
  return {
    id: row.id,
    role: row.role,
    email: row.email,
    createdAt: row.created_at.toISOString(),
    firstName: row.first_name,
    lastName: row.last_name,
    avatarUrl: row.avatar_url,
    gender: row.gender,
    description: row.description,
    specialties: row.specialties,
    clinic: {
      id: row.clinic_id,
      name: row.clinic_name,
      createdAt: row.clinic_created_at.toISOString(),
    },
  };
}

export async function selectMany(query: {
  clinicId?: string;
  sortBy: "createdAt";
  sortOrder: "asc" | "desc";
  limit: number;
  cursor?: string;
}) {
  const rows = (await sql`
    select id, role, email, created_at, first_name, last_name, avatar_url, gender, description, specialties, clinic_id, clinic_name, clinic_created_at
    from doctors
    where true
    ${query.clinicId ? sql`and clinic_id = ${query.clinicId}` : sql``}
    ${!query.cursor ? sql`` : query.sortOrder === "asc" ? sql`and ${sql.unsafe(camelToSnakeString(query.sortBy))} > ${query.cursor}` : sql`and ${sql.unsafe(camelToSnakeString(query.sortBy))} < ${query.cursor}`}
    order by ${sql.unsafe(camelToSnakeString(query.sortBy))} ${sql.unsafe(query.sortOrder)}
    limit ${query.limit}
  `) as Row[];

  return rows.map(normalizeRow);
}

export async function searchMany(query: {
  text: string;
  embedding: string;
  limit: number;
  cursor: number;
}) {
  const rows = (await sql`
    select * from search_doctors(${query.text}, ${query.embedding}, ${query.limit}, ${query.cursor})
  `) as (Row & { score: number })[];

  return rows.map((row) => {
    const { score, ...rest } = row;
    return { ...normalizeRow(rest), score };
  });
}

export async function selectManyRandomly(query: { limit: number }) {
  const rows = (await sql`
    select id, role, email, created_at, first_name, last_name, avatar_url, gender, description, specialties, clinic_id, clinic_name, clinic_created_at
    from doctors
    order by random()
    limit ${query.limit}
  `) as Row[];

  return rows.map(normalizeRow);
}

export async function selectOneProfileById(id: string) {
  const [row] = (await sql`
    select id, clinic_id, first_name, last_name, avatar_url, gender, description, specialties
    from doctor_profiles
    where id = ${id}
  `) as ProfileRow[];

  if (!row) {
    return null;
  }

  return normalizeProfileRow(row);
}

export async function selectOneFullProfileById(id: string) {
  const [row] = (await sql`
    select id, first_name, last_name, avatar_url, gender, description, specialties, clinic_id, clinic_name, clinic_created_at
    from doctor_full_profiles
    where id = ${id}
  `) as FullProfileRow[];

  if (!row) {
    return null;
  }

  return normalizeFullProfileRow(row);
}

export async function selectOneById(id: string) {
  const [row] = (await sql`
    select id, role, email, created_at, first_name, last_name, avatar_url, gender, description, specialties, clinic_id, clinic_name, clinic_created_at
    from doctors
    where id = ${id}
  `) as Row[];

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function insertOne(
  data: PartiallyRequired<
    DoctorProfile,
    "id" | "clinicId" | "firstName" | "lastName"
  > & { createdBy: string },
) {
  const [inserted] = (await sql`
    insert into doctor_profiles ${sql(camelToSnakeJson(data))}
    returning id
  `) as { id: string }[];

  if (!inserted) {
    throw new Error("failed to insert doctor profile");
  }

  const [row] = (await sql`
    select id, role, email, created_at, first_name, last_name, avatar_url, gender, description, specialties, clinic_id, clinic_name, clinic_created_at
    from doctors
    where id = ${inserted.id}
  `) as Row[];

  if (!row) {
    throw new Error("failed to insert doctor profile");
  }

  return normalizeRow(row);
}

export async function updateOneById(
  id: string,
  data: Partial<
    Pick<
      DoctorProfile,
      "firstName" | "lastName" | "description" | "gender" | "specialties"
    > & { embedding: string }
  >,
) {
  const [updated] = (await sql`
    update doctor_profiles
    set ${sql(camelToSnakeJson(data))}
    where id = ${id}
    returning id
  `) as { id: string }[];

  if (!updated) {
    throw new Error("failed to update doctor profile");
  }

  const [row] = (await sql`
    select id, role, email, created_at, first_name, last_name, avatar_url, gender, description, specialties, clinic_id, clinic_name, clinic_created_at
    from doctors
    where id = ${updated.id}
  `) as Row[];

  if (!row) {
    throw new Error("failed to update doctor profile");
  }

  return normalizeRow(row);
}

export async function deleteOneById(id: string, deletedBy: string) {
  await sql`
    update doctor_profiles
    set deleted_by = ${deletedBy}
    where id = ${id}
  `;
}
