import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { GoogleIdentity } from "@/utils/types";
import { sql } from "bun";

export async function findOneByGoogleId(googleId: string) {
  const [row] = await sql`
    select id, google_id
    from google_identities
    where google_id = ${googleId}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as GoogleIdentity;
}

export async function createOne(data: GoogleIdentity) {
  const [row] = await sql`
    insert into google_identities ${sql(camelToSnakeJson(data))}
    returning id, google_id
  `;

  if (!row) {
    throw new Error("failed to create google identity");
  }

  return snakeToCamelJson(row) as GoogleIdentity;
}
