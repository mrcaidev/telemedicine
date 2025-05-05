import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type {
  DoctorFullProfile,
  DoctorProfile,
  PartiallyRequired,
} from "@/utils/types";
import { sql } from "bun";

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, clinic_id, first_name, last_name, avatar_url, gender, description, specialties
    from doctor_profiles
    where id = ${id}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as DoctorProfile;
}

export async function findOneFullById(id: string) {
  const [row] = await sql`
    select dp.id, dp.first_name, dp.last_name, dp.avatar_url, dp.gender, dp.description, dp.specialties, c.id as clinic_id, c.name as clinic_name
    from doctor_profiles dp
    left outer join clinics c on dp.clinic_id = c.id
    where dp.id = ${id}
  `;

  if (!row) {
    return null;
  }

  const { clinicId, clinicName, ...rest } = snakeToCamelJson(row);
  return {
    ...rest,
    clinic: { id: clinicId, name: clinicName },
  } as DoctorFullProfile;
}

export async function createOne(
  data: PartiallyRequired<
    DoctorProfile,
    "id" | "clinicId" | "firstName" | "lastName"
  > & { createdBy: string },
) {
  const [row] = await sql`
    insert into doctor_profiles ${sql(camelToSnakeJson(data))}
    returning id, clinic_id, first_name, last_name, avatar_url, gender, description, specialties
  `;

  if (!row) {
    throw new Error("failed to create doctor profile");
  }

  return snakeToCamelJson(row) as DoctorProfile;
}
