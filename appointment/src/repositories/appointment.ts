import {
  camelToSnakeJson,
  camelToSnakeString,
  snakeToCamelJson,
} from "@/utils/case";
import type { Appointment, AppointmentStatus } from "@/utils/types";
import { sql } from "bun";

export async function findAll(options: {
  patientId?: string;
  doctorId?: string;
  status?: AppointmentStatus;
  sortBy: "startAt" | "endAt";
  sortOrder: "asc" | "desc";
  limit: number;
  cursor: string | null;
}) {
  const rows = await sql`
    select id, patient_id, doctor_id, start_at, end_at, remark, status, created_at
    from appointments
    where true
    ${options.patientId ? sql`and patient_id = ${options.patientId}` : sql``}
    ${options.doctorId ? sql`and doctor_id = ${options.doctorId}` : sql``}
    ${options.status ? sql`and status = ${options.status}` : sql``}
    ${!options.cursor ? sql`` : options.sortOrder === "asc" ? sql`and ${sql(camelToSnakeString(options.sortBy))} > ${options.cursor}` : sql`and ${sql(camelToSnakeString(options.sortBy))} < ${options.cursor}`}
    order by ${sql.unsafe(camelToSnakeString(options.sortBy))} ${sql.unsafe(options.sortOrder)}
    limit ${options.limit}
  `;
  return rows.map(snakeToCamelJson) as Appointment[];
}

export async function findOneById(id: string) {
  const [row] = await sql`
    select id, patient_id, doctor_id, start_at, end_at, remark, status, created_at
    from appointments
    where id = ${id}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as Appointment;
}

export async function insertOne(
  data: Pick<
    Appointment,
    "patientId" | "doctorId" | "startAt" | "endAt" | "remark"
  >,
) {
  const [row] = await sql`
    insert into appointments ${sql(camelToSnakeJson(data))}
    returning id, patient_id, doctor_id, start_at, end_at, remark, status, created_at
  `;

  if (!row) {
    throw new Error("Failed to insert appointment");
  }

  return snakeToCamelJson(row) as Appointment;
}
