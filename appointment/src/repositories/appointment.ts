import { snakeToCamelJson } from "@/utils/case";
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
    ${!options.cursor ? sql`` : options.sortOrder === "asc" ? sql`and ${sql(options.sortBy)} > ${options.cursor}` : sql`and ${sql(options.sortBy)} < ${options.cursor}`}
    order by ${options.sortBy} ${sql.unsafe(options.sortOrder)}
    limit ${options.limit}
  `;
  return rows.map(snakeToCamelJson) as Appointment[];
}
