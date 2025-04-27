import { snakeToCamelJson } from "@/utils/case";
import type { Doctor, WithFull } from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select u.id, u.role, u.email, d.first_name, d.last_name, d.avatar_url, d.gender, d.description, d.specialties, c.id as clinic_id, c.name as clinic_name
    from doctors d
    left outer join users u on d.id = u.id
    left outer join clinics c on d.clinic_id = c.id
    where u.id = ${id} and u.deleted_at is null
  `;

  if (!row) {
    return null;
  }

  const { clinicId, clinicName, ...rest } = snakeToCamelJson(row);
  return {
    ...rest,
    clinic: { id: clinicId, name: clinicName },
  } as WithFull<Doctor>;
}

export async function insertOne(
  data: Pick<Doctor, "firstName" | "lastName" | "clinic"> & {
    createdBy: string;
  },
) {
  const [row] = await sql`
    insert into doctors ${sql({
      clinic_id: data.clinic.id,
      first_name: data.firstName,
      last_name: data.lastName,
      gender: "male",
      created_by: data.createdBy,
    })}
    returning id, first_name, last_name, avatar_url, gender, description, specialties
  `;

  if (!row) {
    throw new Error("failed to insert doctor");
  }

  return { ...snakeToCamelJson(row), clinic: data.clinic } as Doctor;
}
