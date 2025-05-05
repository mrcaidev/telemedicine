import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { DoctorAvailability, PartiallyRequired } from "@/utils/types";
import { sql } from "bun";

export async function findAllByDoctorId(doctorId: string) {
  const rows = await sql`
    select id, weekday, start_time, end_time
    from doctor_availabilities
    where doctor_id = ${doctorId}
  `;

  return snakeToCamelJson(rows) as DoctorAvailability[];
}

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, doctor_id, weekday, start_time, end_time
    from doctor_availabilities
    where id = ${id}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as DoctorAvailability & { doctorId: string };
}

export async function hasConflict(
  availability: Pick<
    DoctorAvailability,
    "weekday" | "startTime" | "endTime"
  > & { doctorId: string },
) {
  const rows = await sql`
    select *
    from doctor_availabilities
    where doctor_id = ${availability.doctorId}
      and weekday = ${availability.weekday}
      and start_time < ${availability.endTime}
      and end_time > ${availability.startTime}
  `;
  return rows.length > 0;
}

export async function createOne(
  data: PartiallyRequired<
    DoctorAvailability,
    "weekday" | "startTime" | "endTime"
  > & { doctorId: string; createdBy: string },
) {
  const [row] = await sql`
    insert into doctor_availabilities ${sql(camelToSnakeJson(data))}
    returning id, weekday, start_time, end_time
  `;

  if (!row) {
    throw new Error("failed to create doctor availability");
  }

  return snakeToCamelJson(row) as DoctorAvailability;
}
