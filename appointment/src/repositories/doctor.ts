import type { Doctor } from "@/utils/types";
import { sql } from "bun";
import decamelizeKeys from "decamelize-keys";

type Row = {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};

function normalizeRow(row: Row): Doctor {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    avatarUrl: row.avatar_url,
  };
}

export async function selectOne(query: { id?: string }) {
  const [row] = (await sql`
    select id, first_name, last_name, avatar_url
    from doctors
    where true
    ${query.id ? sql`and id = ${query.id}` : sql``}
  `) as Row[];

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function insertOne(data: Doctor & { clinicId: string }) {
  await sql`insert into doctors ${sql(decamelizeKeys(data))}`;
}

export async function updateOneById(
  id: string,
  data: Partial<
    Pick<Doctor, "firstName" | "lastName" | "avatarUrl"> & { clinicId: string }
  >,
) {
  await sql`
    update doctors
    set ${sql(decamelizeKeys(data))}
    where id = ${id}
  `;
}
