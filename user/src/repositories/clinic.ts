import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { Clinic } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, name
    from clinics
    where id = ${id}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as Clinic;
}

export async function insertOne(
  data: Pick<Clinic, "name"> & { createdBy: string },
) {
  const [row] = await sql`
    insert into clinics ${sql(camelToSnakeJson(data))}
    returning id, name
  `;

  if (!row) {
    throw new Error("failed to insert clinic");
  }

  return snakeToCamelJson(row) as Clinic;
}
