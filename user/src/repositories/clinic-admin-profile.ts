import { camelToSnakeJson } from "@/utils/case";
import type {
  ClinicAdmin,
  ClinicAdminFullProfile,
  ClinicAdminProfile,
  Role,
} from "@/utils/types";
import { sql } from "bun";

type ProfileRow = {
  id: string;
  clinic_id: string;
  first_name: string;
  last_name: string;
};

function normalizeProfileRow(row: ProfileRow): ClinicAdminProfile {
  return {
    id: row.id,
    clinicId: row.clinic_id,
    firstName: row.first_name,
    lastName: row.last_name,
  };
}

type FullProfileRow = {
  id: string;
  first_name: string;
  last_name: string;
  clinic_id: string;
  clinic_name: string;
  clinic_created_at: Date;
};

function normalizeFullProfileRow(row: FullProfileRow): ClinicAdminFullProfile {
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    clinic: {
      id: row.clinic_id,
      name: row.clinic_name,
      createdAt: row.clinic_created_at.toISOString(),
    },
  };
}

type Row = {
  id: string;
  role: Role;
  email: string;
  created_at: Date;
  first_name: string;
  last_name: string;
  clinic_id: string;
  clinic_name: string;
  clinic_created_at: Date;
};

function normalizeRow(row: Row): ClinicAdmin {
  return {
    id: row.id,
    role: row.role,
    email: row.email,
    createdAt: row.created_at.toISOString(),
    firstName: row.first_name,
    lastName: row.last_name,
    clinic: {
      id: row.clinic_id,
      name: row.clinic_name,
      createdAt: row.clinic_created_at.toISOString(),
    },
  };
}

export async function selectMany(query: { clinicId?: string }) {
  const rows = (await sql`
    select id, role, email, created_at, first_name, last_name, clinic_id, clinic_name, clinic_created_at
    from clinic_admins
    where true
    ${query.clinicId ? sql`and clinic_id = ${query.clinicId}` : sql``}
  `) as Row[];

  return rows.map(normalizeRow);
}

export async function selectOneProfileById(id: string) {
  const [row] = (await sql`
    select id, clinic_id, first_name, last_name
    from clinic_admin_profiles
    where id = ${id}
  `) as ProfileRow[];

  if (!row) {
    return null;
  }

  return normalizeProfileRow(row);
}

export async function selectOneFullProfileById(id: string) {
  const [row] = (await sql`
    select id, first_name, last_name, clinic_id, clinic_name, clinic_created_at
    from clinic_admin_full_profiles
    where id = ${id}
  `) as FullProfileRow[];

  if (!row) {
    return null;
  }

  return normalizeFullProfileRow(row);
}

export async function selectOneById(id: string) {
  const [row] = (await sql`
    select id, role, email, created_at, first_name, last_name, clinic_id, clinic_name, clinic_created_at
    from clinic_admins
    where id = ${id}
  `) as Row[];

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function insertOne(
  data: ClinicAdminProfile & { createdBy: string },
) {
  const [inserted] = (await sql`
    insert into clinic_admin_profiles ${sql(camelToSnakeJson(data))}
    returning id
  `) as { id: string }[];

  if (!inserted) {
    throw new Error("failed to insert clinic admin profile");
  }

  const [row] = (await sql`
    select id, role, email, created_at, first_name, last_name, clinic_id, clinic_name, clinic_created_at
    from clinic_admins
    where id = ${inserted.id}
  `) as Row[];

  if (!row) {
    throw new Error("failed to insert clinic admin profile");
  }

  return normalizeRow(row);
}

export async function updateOneById(
  id: string,
  data: Partial<Pick<ClinicAdminProfile, "firstName" | "lastName">>,
) {
  const [updated] = (await sql`
    update clinic_admin_profiles
    set ${sql(camelToSnakeJson(data))}
    where id = ${id}
    returning id
  `) as { id: string }[];

  if (!updated) {
    throw new Error("failed to update clinic admin profile");
  }

  const [row] = (await sql`
    select id, role, email, created_at, first_name, last_name, clinic_id, clinic_name, clinic_created_at
    from clinic_admins
    where id = ${updated.id}
  `) as Row[];

  if (!row) {
    throw new Error("failed to update clinic admin profile");
  }

  return normalizeRow(row);
}

export async function deleteOneById(id: string, deletedBy: string) {
  await sql`
    update clinic_admin_profiles
    set deleted_by = ${deletedBy}
    where id = ${id}
  `;
}
