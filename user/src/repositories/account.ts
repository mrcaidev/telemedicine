import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { Account, PartiallyRequired } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, role, email
    from accounts
    where id = ${id} and deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as Account;
}

export async function findOneByEmail(email: string) {
  const [row] = await sql`
    select id, role, email
    from accounts
    where email = ${email} and deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as Account;
}

export async function findOneWithPasswordHashByEmail(email: string) {
  const [row] = await sql`
    select id, role, email, password_hash
    from accounts
    where email = ${email} and deleted_at is null
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as Account & { passwordHash: string };
}

export async function createOne(
  data: PartiallyRequired<Account, "role" | "email"> & {
    passwordHash?: string;
  },
) {
  const [row] = await sql`
    insert into accounts ${sql(camelToSnakeJson(data))}
    returning id, role, email
  `;

  if (!row) {
    throw new Error("failed to create account");
  }

  return snakeToCamelJson(row) as Account;
}
