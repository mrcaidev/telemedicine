import { camelToSnakeJson } from "@/utils/case";
import type { AuditLog, PartiallyRequired } from "@/utils/types";
import { sql } from "bun";

export async function insertOne(
  data: PartiallyRequired<AuditLog, "userId" | "action">,
) {
  await sql`insert into audit_logs ${sql(camelToSnakeJson(data))}`;
}

export async function insertMany(
  data: PartiallyRequired<AuditLog, "userId" | "action">[],
) {
  await sql`insert into audit_logs ${sql(camelToSnakeJson(data))}`;
}
