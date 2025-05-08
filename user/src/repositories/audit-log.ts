import { camelToSnakeJson } from "@/utils/case";
import type { AuditLog, PartiallyRequired } from "@/utils/types";
import { sql } from "bun";

export async function createOne(
  data: PartiallyRequired<AuditLog, "userId" | "action">,
) {
  await sql`insert into audit_logs ${sql(camelToSnakeJson(data))}`;
}

export async function createMany(
  data: PartiallyRequired<AuditLog, "userId" | "action">[],
) {
  await sql`insert into audit_logs ${sql(data.map(camelToSnakeJson))}`;
}
