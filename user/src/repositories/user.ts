import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { User } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, role, email, password_hash
    from users
    where id = ${id} and deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as User;
}

export async function findOneByEmail(email: string) {
  const [row] = await sql`
    select id, role, email, password_hash
    from users
    where email = ${email} and deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as User;
}

export async function insertOne(
  data: Pick<User, "role" | "email" | "passwordHash">,
) {
  const [row] = await sql`
    insert into users ${sql(camelToSnakeJson(data))}
    returning id, role, email, password_hash
  `;

  if (!row) {
    throw new Error("Failed to insert user");
  }

  return snakeToCamelJson(row) as User;
}
