import type {
  Appointment,
  AppointmentStatus,
  FullAppointment,
  PartiallyRequired,
} from "@/utils/types";
import { sql } from "bun";
import decamelize from "decamelize";
import decamelizeKeys from "decamelize-keys";

type FullRow = {
  id: string;
  start_at: Date;
  end_at: Date;
  remark: string;
  status: AppointmentStatus;
  created_at: Date;
  patient_id: string;
  patient_nickname: string | null;
  patient_avatar_url: string | null;
  doctor_id: string;
  doctor_first_name: string;
  doctor_last_name: string;
  doctor_avatar_url: string | null;
  clinic_id: string;
};

function normalizeFullRow(row: FullRow): FullAppointment {
  return {
    id: row.id,
    startAt: row.start_at.toISOString(),
    endAt: row.end_at.toISOString(),
    remark: row.remark,
    status: row.status,
    createdAt: row.created_at.toISOString(),
    patient: {
      id: row.patient_id,
      nickname: row.patient_nickname,
      avatarUrl: row.patient_avatar_url,
    },
    doctor: {
      id: row.doctor_id,
      firstName: row.doctor_first_name,
      lastName: row.doctor_last_name,
      avatarUrl: row.doctor_avatar_url,
    },
    clinicId: row.clinic_id,
  };
}

export async function selectManyFull(query: {
  patientId?: string;
  doctorId?: string;
  clinicId?: string;
  status?: AppointmentStatus[];
  sortBy: "startAt" | "endAt";
  sortOrder: "asc" | "desc";
  limit: number;
  cursor?: string;
}) {
  const rows = (await sql`
    select id, start_at, end_at, remark, status, created_at, patient_id, patient_nickname, patient_avatar_url, doctor_id, doctor_first_name, doctor_last_name, doctor_avatar_url, clinic_id
    from full_appointments
    where true
    ${query.patientId ? sql`and patient_id = ${query.patientId}` : sql``}
    ${query.doctorId ? sql`and doctor_id = ${query.doctorId}` : sql``}
    ${query.clinicId ? sql`and clinic_id = ${query.clinicId}` : sql``}
    ${query.status ? sql`and status in (${sql.unsafe(query.status.map((s) => `'${s}'`).join(","))})` : sql``}
    ${!query.cursor ? sql`` : query.sortOrder === "asc" ? sql`and ${sql.unsafe(decamelize(query.sortBy))} > ${query.cursor}` : sql`and ${sql.unsafe(decamelize(query.sortBy))} < ${query.cursor}`}
    order by ${sql.unsafe(decamelize(query.sortBy))} ${sql.unsafe(query.sortOrder)}
    limit ${query.limit}
  `) as FullRow[];

  return rows.map(normalizeFullRow);
}

export async function selectOneFull(query: { id?: string }) {
  const [row] = await sql`
    select id, start_at, end_at, remark, status, created_at, patient_id, patient_nickname, patient_avatar_url, doctor_id, doctor_first_name, doctor_last_name, doctor_avatar_url, clinic_id
    from appointments
    where true
    ${query.id ? sql`and id = ${query.id}` : sql``}
  `;

  if (!row) {
    return null;
  }

  return normalizeFullRow(row);
}

export async function insertOne(
  data: PartiallyRequired<
    Appointment,
    "patientId" | "doctorId" | "startAt" | "endAt" | "remark"
  >,
) {
  const [insertedRow] = (await sql`
    insert into appointments ${sql(decamelizeKeys(data))}
    returning id
  `) as { id: string }[];

  if (!insertedRow) {
    throw new Error("failed to insert appointment");
  }

  const [row] = (await sql`
    select id, start_at, end_at, remark, status, created_at, patient_id, patient_nickname, patient_avatar_url, doctor_id, doctor_first_name, doctor_last_name, doctor_avatar_url, clinic_id
    from full_appointments
    where id = ${insertedRow.id}
  `) as FullRow[];

  if (!row) {
    throw new Error("failed to insert appointment");
  }

  return normalizeFullRow(row);
}

export async function updateOneById(
  id: string,
  data: Partial<
    Pick<Appointment, "doctorId" | "startAt" | "endAt" | "remark" | "status">
  >,
) {
  const [updatedRow] = (await sql`
    update appointments
    set ${sql(decamelizeKeys(data))}
    where id = ${id}
    returning id
  `) as { id: string }[];

  if (!updatedRow) {
    throw new Error("failed to update appointment");
  }

  const [row] = (await sql`
    select id, start_at, end_at, remark, status, created_at, patient_id, patient_nickname, patient_avatar_url, doctor_id, doctor_first_name, doctor_last_name, doctor_avatar_url, clinic_id
    from full_appointments
    where id = ${updatedRow.id}
  `) as FullRow[];

  if (!row) {
    throw new Error("failed to update appointment");
  }

  return normalizeFullRow(row);
}
