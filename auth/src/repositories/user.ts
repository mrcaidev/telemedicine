import type { User } from "@/types";
import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [user] = await sql`
    select *
    from users
    where id = ${id} and deleted_at is null
    limit 1
  `;
  return snakeToCamelJson(user) as User | undefined;
}

export async function findOneByEmail(email: string) {
  const [user] = await sql`
    select *
    from users
    where email = ${email} and deleted_at is null
    limit 1
  `;
  return snakeToCamelJson(user) as User | undefined;
}

export async function insertOne(
  data: Pick<User, "role" | "email"> & Partial<Omit<User, "role" | "email">>,
) {
  const [user] = await sql`
    insert into users ${sql(camelToSnakeJson(data))}
    returning *
  `;
  return snakeToCamelJson(user) as User;
}
