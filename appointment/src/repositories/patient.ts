import { camelToSnakeJson } from "@/utils/case";
import type { Patient } from "@/utils/types";
import { sql } from "bun";

type Row = {
  id: string;
  nickname: string | null;
  avatar_url: string | null;
};

function normalizeRow(row: Row): Patient {
  return {
    id: row.id,
    nickname: row.nickname,
    avatarUrl: row.avatar_url,
  };
}

export async function selectOne(query: { id?: string }) {
  const [row] = (await sql`
    select id, nickname, avatar_url
    from patients
    where true
    ${query.id ? sql`and id = ${query.id}` : sql``}
  `) as Row[];

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function selectOneWithEmail(query: { id?: string }) {
  const [row] = (await sql`
    select id, email, nickname, avatar_url
    from patients
    where true
    ${query.id ? sql`and id = ${query.id}` : sql``}
  `) as (Row & { email: string })[];

  if (!row) {
    return null;
  }

  return { ...normalizeRow(row), email: row.email };
}

export async function insertOne(data: Patient & { email: string }) {
  await sql`insert into patients ${sql(camelToSnakeJson(data))}`;
}

export async function updateOneById(
  id: string,
  data: Partial<Pick<Patient, "nickname" | "avatarUrl"> & { email: string }>,
) {
  await sql`
    update patients
    set ${sql(camelToSnakeJson(data))}
    where id = ${id}
  `;
}
