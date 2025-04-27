import { snakeToCamelJson } from "@/utils/case";
import type { ClinicAdmin, WithFull } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select u.id, u.role, u.email, ca.first_name, ca.last_name, c.id as clinic_id, c.name as clinic_name
    from clinic_admins ca
    left outer join users u on ca.id = u.id
    left outer join clinics c on ca.clinic_id = c.id
    where u.id = ${id} and u.deleted_at is null
  `;

  if (!row) {
    return null;
  }

  const { clinicId, clinicName, ...rest } = snakeToCamelJson(row);
  return {
    ...rest,
    clinic: { id: clinicId, name: clinicName },
  } as WithFull<ClinicAdmin>;
}

export async function insertOne(data: ClinicAdmin & { createdBy: string }) {
  const [row] = await sql`
    insert into clinic_admins ${sql({
      id: data.id,
      first_name: data.firstName,
      last_name: data.lastName,
      clinic_id: data.clinic.id,
      created_by: data.createdBy,
    })}
    returning id, first_name, last_name
  `;

  if (!row) {
    throw new Error("failed to insert clinic admin");
  }

  return { ...snakeToCamelJson(row), clinic: data.clinic } as ClinicAdmin;
}
