import { camelToSnakeJson } from "@/utils/case";
import type {
  Gender,
  PartiallyRequired,
  Patient,
  PatientProfile,
  Role,
} from "@/utils/types";
import { sql } from "bun";

type ProfileRow = {
  id: string;
  nickname: string;
  avatar_url: string;
  gender: Gender;
  birth_date: string;
};

function normalizeProfileRow(row: ProfileRow): PatientProfile {
  return {
    id: row.id,
    nickname: row.nickname,
    avatarUrl: row.avatar_url,
    gender: row.gender,
    birthDate: row.birth_date,
  };
}

type Row = {
  id: string;
  role: Role;
  email: string;
  created_at: Date;
  nickname: string;
  avatar_url: string;
  gender: Gender;
  birth_date: string;
};

function normalizeRow(row: Row): Patient {
  return {
    id: row.id,
    role: row.role,
    email: row.email,
    createdAt: row.created_at.toISOString(),
    nickname: row.nickname,
    avatarUrl: row.avatar_url,
    gender: row.gender,
    birthDate: row.birth_date,
  };
}

export async function selectOneProfileById(id: string) {
  const [row] = (await sql`
    select id, nickname, avatar_url, gender, birth_date
    from patient_profiles
    where id = ${id}
  `) as ProfileRow[];

  if (!row) {
    return null;
  }

  return normalizeProfileRow(row);
}

export async function selectOneById(id: string) {
  const [row] = (await sql`
    select id, role, email, created_at, nickname, avatar_url, gender, birth_date
    from patients
    where id = ${id}
  `) as Row[];

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function insertOne(data: PartiallyRequired<PatientProfile, "id">) {
  const [inserted] = (await sql`
    insert into patient_profiles ${sql(camelToSnakeJson(data))}
    returning id
  `) as { id: string }[];

  if (!inserted) {
    throw new Error("failed to insert patient profile");
  }

  const [row] = (await sql`
    select id, role, email, created_at, nickname, avatar_url, gender, birth_date
    from patients p
    where id = ${inserted.id}
  `) as Row[];

  if (!row) {
    throw new Error("failed to insert patient profile");
  }

  return normalizeRow(row);
}

export async function updateOneById(
  id: string,
  data: Partial<Pick<PatientProfile, "nickname" | "gender" | "birthDate">>,
) {
  const [updated] = (await sql`
    update patient_profiles
    set ${sql(camelToSnakeJson(data))}
    where id = ${id}
    returning id
  `) as { id: string }[];

  if (!updated) {
    throw new Error("failed to update patient profile");
  }

  const [row] = (await sql`
    select id, role, email, created_at, nickname, avatar_url, gender, birth_date
    from patients
    where id = ${updated.id}
  `) as Row[];

  if (!row) {
    throw new Error("failed to update patient profile");
  }

  return normalizeRow(row);
}
