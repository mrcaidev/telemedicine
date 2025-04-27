import { snakeToCamelJson } from "@/utils/case";
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
