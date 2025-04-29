import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { DoctorAvailability } from "@/utils/types";
import { sql } from "bun";

export async function findAllByDoctorId(doctorId: string) {
  const rows = await sql`
    select id, weekday, start_time, end_time
    from doctor_availabilities
    where doctor_id = ${doctorId}
  `;
  return rows.map(snakeToCamelJson) as DoctorAvailability[];
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
  > & {
    doctorId: string;
  },
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

export async function insertOne(
  data: Pick<DoctorAvailability, "weekday" | "startTime" | "endTime"> & {
    doctorId: string;
    createdBy: string;
  },
) {
  const [row] = await sql`
    insert into doctor_availabilities ${sql(camelToSnakeJson(data))}
    returning id, weekday, start_time, end_time
  `;

  if (!row) {
    throw new Error("Failed to create doctor availability");
  }

  return snakeToCamelJson(row) as DoctorAvailability;
}
