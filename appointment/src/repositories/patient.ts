import { camelToSnakeJson } from "@/utils/case";
import type { Patient } from "@/utils/types";
import { sql } from "bun";

export async function insertOne(data: Patient) {
  await sql`insert into patients ${sql(camelToSnakeJson(data))}`;
}
