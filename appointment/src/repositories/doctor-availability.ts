import { camelToSnakeJson } from "@/utils/case";
import type { DoctorAvailability, PartiallyRequired } from "@/utils/types";
import { sql } from "bun";

type Row = {
  id: string;
  doctor_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  created_at: Date;
};

function normalizeRow(row: Row): DoctorAvailability {
  return {
    id: row.id,
    doctorId: row.doctor_id,
    weekday: row.weekday,
    startTime: row.start_time,
    endTime: row.end_time,
    createdAt: row.created_at.toISOString(),
  };
}

export async function selectMany(query: { doctorId?: string }) {
  const rows = (await sql`
    select id, doctor_id, weekday, start_time, end_time, created_at
    from doctor_availabilities
    where deleted_at is null
    ${query.doctorId ? sql`and doctor_id = ${query.doctorId}` : sql``}
  `) as Row[];

  return rows.map(normalizeRow);
}

export async function selectOne(query: { id?: string }) {
  const [row] = (await sql`
    select id, doctor_id, weekday, start_time, end_time, created_at
    from doctor_availabilities
    where deleted_at is null
    ${query.id ? sql`and id = ${query.id}` : sql``}
  `) as Row[];

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function hasConflict(
  availability: Pick<
    DoctorAvailability,
    "doctorId" | "weekday" | "startTime" | "endTime"
  >,
) {
  const rows = await sql`
    select *
    from doctor_availabilities
    where deleted_at is null
      and doctor_id = ${availability.doctorId}
      and weekday = ${availability.weekday}
      and start_time < ${availability.endTime}
      and end_time > ${availability.startTime}
  `;

  return rows.length > 0;
}

export async function insertOne(
  data: PartiallyRequired<
    DoctorAvailability,
    "doctorId" | "weekday" | "startTime" | "endTime"
  >,
) {
  const [row] = (await sql`
    insert into doctor_availabilities ${sql(camelToSnakeJson(data))}
    returning id, doctor_id, weekday, start_time, end_time, created_at
  `) as Row[];

  if (!row) {
    throw new Error("failed to insert doctor availability");
  }

  return normalizeRow(row);
}

export async function deleteOneById(id: string) {
  await sql`
    update doctor_availabilities
    set deleted_at = now()
    where id = ${id}
  `;
}
