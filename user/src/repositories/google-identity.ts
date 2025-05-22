import { camelToSnakeJson } from "@/utils/case";
import type { GoogleIdentity, PartiallyRequired } from "@/utils/types";
import { sql } from "bun";

type Row = {
  id: string;
  user_id: string;
  google_id: string;
  created_at: Date;
};

function normalizeRow(row: Row): GoogleIdentity {
  return {
    id: row.id,
    userId: row.user_id,
    googleId: row.google_id,
    createdAt: row.created_at.toISOString(),
  };
}

export async function selectOneByGoogleId(googleId: string) {
  const [row] = await sql`
    select id, user_id, google_id, created_at
    from google_identities
    where google_id = ${googleId}
  `;

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function insertOne(
  data: PartiallyRequired<GoogleIdentity, "userId" | "googleId">,
) {
  const [row] = await sql`
    insert into google_identities ${sql(camelToSnakeJson(data))}
    returning id, user_id, google_id, created_at
  `;

  if (!row) {
    throw new Error("failed to insert google identity");
  }

  return normalizeRow(row);
}
