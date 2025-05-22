import { camelToSnakeJson } from "@/utils/case";
import type { Clinic, PartiallyRequired } from "@/utils/types";
import { sql } from "bun";

type Row = {
  id: string;
  name: string;
  created_at: Date;
};

function normalizeRow(row: Row): Clinic {
  return {
    id: row.id,
    name: row.name,
    createdAt: row.created_at.toISOString(),
  };
}

export async function selectMany() {
  const rows = (await sql`
    select id, name, created_at
    from clinics
    where deleted_at is null
  `) as Row[];

  return rows.map(normalizeRow);
}

export async function selectOneById(id: string) {
  const [row] = (await sql`
    select id, name, created_at
    from clinics
    where id = ${id} and deleted_at is null
  `) as Row[];

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function insertOne(
  data: PartiallyRequired<Clinic, "name"> & { createdBy: string },
) {
  const [row] = await sql`
    insert into clinics ${sql(camelToSnakeJson(data))}
    returning id, name, created_at
  `;

  if (!row) {
    throw new Error("failed to insert clinic");
  }

  return normalizeRow(row);
}

export async function updateOneById(
  id: string,
  data: Partial<Pick<Clinic, "name">>,
) {
  const [row] = (await sql`
    update clinics
    set ${sql(camelToSnakeJson(data))}
    where id = ${id}
    returning id, name, created_at
  `) as Row[];

  if (!row) {
    throw new Error("failed to update clinic");
  }

  return normalizeRow(row);
}

export async function deleteOneById(id: string, deletedBy: string) {
  await sql`
    update clinics
    set deleted_at = now(), deleted_by = ${deletedBy}
    where id = ${id}
  `;
}
