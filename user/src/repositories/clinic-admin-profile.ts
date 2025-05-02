import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { ClinicAdminFullProfile, ClinicAdminProfile } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, clinic_id, first_name, last_name
    from clinic_admin_profiles
    where id = ${id}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as ClinicAdminProfile;
}

export async function findOneFullById(id: string) {
  const [row] = await sql`
    select cap.id, cap.first_name, cap.last_name, c.id as clinic_id, c.name as clinic_name
    from clinic_admin_profiles cap
    left outer join clinics c on cap.clinic_id = c.id
    where cap.id = ${id}
  `;

  if (!row) {
    return null;
  }

  const { clinicId, clinicName, ...rest } = snakeToCamelJson(row);
  return {
    ...rest,
    clinic: { id: clinicId, name: clinicName },
  } as ClinicAdminFullProfile;
}

export async function createOne(
  data: ClinicAdminProfile & { createdBy: string },
) {
  const [row] = await sql`
    insert into clinic_admin_profiles ${sql(camelToSnakeJson(data))}
    returning id, clinic_id, first_name, last_name
  `;

  if (!row) {
    throw new Error("failed to create clinic admin profile");
  }

  return snakeToCamelJson(row) as ClinicAdminProfile;
}
