import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { Clinic, PartiallyRequired } from "@/utils/types";
import { sql } from "bun";

export async function findAll() {
  const rows = await sql`
    select id, name
    from clinics
    where deleted_at is null
  `;

  return rows.map(snakeToCamelJson) as Clinic[];
}

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, name
    from clinics
    where id = ${id} and deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as Clinic;
}

export async function createOne(
  data: PartiallyRequired<Clinic, "name"> & { createdBy: string },
) {
  const [row] = await sql`
    insert into clinics ${sql(camelToSnakeJson(data))}
    returning id, name
  `;

  if (!row) {
    throw new Error("failed to create clinic");
  }

  return snakeToCamelJson(row) as Clinic;
}
