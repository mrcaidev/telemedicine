import { camelToSnakeJson } from "@/utils/case";
import type { PlatformAdmin, PlatformAdminProfile, Role } from "@/utils/types";
import { sql } from "bun";

type ProfileRow = {
  id: string;
};

function normalizeProfileRow(row: ProfileRow): PlatformAdminProfile {
  return { id: row.id };
}

type Row = {
  id: string;
  role: Role;
  email: string;
  created_at: Date;
};

function normalizeRow(row: Row): PlatformAdmin {
  return {
    id: row.id,
    role: row.role,
    email: row.email,
    createdAt: row.created_at.toISOString(),
  };
}

export async function selectOneProfileById(id: string) {
  const [row] = (await sql`
    select id
    from platform_admin_profiles
    where id = ${id}
  `) as ProfileRow[];

  if (!row) {
    return null;
  }

  return normalizeProfileRow(row);
}

export async function selectOneById(id: string) {
  const [row] = (await sql`
    select id, role, email, created_at
    from platform_admins
    where id = ${id}
  `) as Row[];

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function insertOne(data: PlatformAdminProfile) {
  const [inserted] = (await sql`
    insert into platform_admin_profiles ${sql(camelToSnakeJson(data))}
    returning id
  `) as { id: string }[];

  if (!inserted) {
    throw new Error("failed to insert platform admin profile");
  }

  const [row] = (await sql`
    select id, role, email, created_at
    from platform_admins
    where id = ${inserted.id}
  `) as Row[];

  if (!row) {
    throw new Error("failed to insert platform admin profile");
  }

  return normalizeRow(row);
}
