import { camelToSnakeJson } from "@/utils/case";
import type {
  Account,
  PartiallyRequired,
  PrivateAccount,
  Role,
} from "@/utils/types";
import { sql } from "bun";

type Row = {
  id: string;
  role: Role;
  email: string;
  created_at: Date;
};

function normalizeRow(row: Row): Account {
  return {
    id: row.id,
    role: row.role,
    email: row.email,
    createdAt: row.created_at.toISOString(),
  };
}

type PrivateRow = Row & { password_hash: string | null };

function normalizePrivateRow(row: PrivateRow): PrivateAccount {
  return {
    ...normalizeRow(row),
    passwordHash: row.password_hash,
  };
}

export async function selectOneById(id: string) {
  const [row] = (await sql`
    select id, role, email, created_at
    from accounts
    where id = ${id} and deleted_at is null
  `) as Row[];

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function selectOneByEmail(email: string) {
  const [row] = (await sql`
    select id, role, email, created_at
    from accounts
    where email = ${email} and deleted_at is null
  `) as Row[];

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function selectOnePrivateById(id: string) {
  const [row] = (await sql`
    select id, role, email, password_hash, created_at
    from accounts
    where id = ${id} and deleted_at is null
  `) as PrivateRow[];

  if (!row) {
    return null;
  }

  return normalizePrivateRow(row);
}

export async function selectOnePrivateByEmail(email: string) {
  const [row] = (await sql`
    select id, role, email, password_hash, created_at
    from accounts
    where email = ${email} and deleted_at is null
  `) as PrivateRow[];

  if (!row) {
    return null;
  }

  return normalizePrivateRow(row);
}

export async function insertOne(
  data: PartiallyRequired<PrivateAccount, "role" | "email">,
) {
  const [row] = (await sql`
    insert into accounts ${sql(camelToSnakeJson(data))}
    returning id, role, email, created_at
  `) as Row[];

  if (!row) {
    throw new Error("failed to insert account");
  }

  return normalizeRow(row);
}

export async function updateOneById(
  id: string,
  data: Partial<Pick<PrivateAccount, "email" | "passwordHash">>,
) {
  const [row] = (await sql`
    update accounts
    set ${sql(camelToSnakeJson(data))}
    where id = ${id}
    returning id, role, email, created_at
  `) as Row[];

  if (!row) {
    throw new Error("failed to update account");
  }

  return normalizeRow(row);
}

export async function deleteOneById(id: string) {
  await sql`
    update accounts
    set deleted_at = now()
    where id = ${id}
  `;
}
