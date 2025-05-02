import {
  camelToSnakeJson,
  camelToSnakeString,
  snakeToCamelJson,
} from "@/utils/case";
import type {
  Appointment,
  AppointmentStatus,
  FullAppointment,
  PartiallyRequired,
} from "@/utils/types";
import { sql } from "bun";

export async function findAll(query: {
  patientId?: string;
  doctorId?: string;
  status?: AppointmentStatus;
  sortBy: "startAt" | "endAt";
  sortOrder: "asc" | "desc";
  limit: number;
  cursor: string | null;
}) {
  const rows = await sql`
    select a.id, a.start_at, a.end_at, a.remark, a.status, a.created_at, p.id as patient_id, p.nickname as patient_nickname, p.avatar_url as patient_avatar_url, d.id as doctor_id, d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.avatar_url as doctor_avatar_url
    from appointments a
    left outer join patients p on a.patient_id = p.id
    left outer join doctors d on a.doctor_id = d.id
    where true
    ${query.patientId ? sql`and a.patient_id = ${query.patientId}` : sql``}
    ${query.doctorId ? sql`and a.doctor_id = ${query.doctorId}` : sql``}
    ${query.status ? sql`and a.status = ${query.status}` : sql``}
    ${!query.cursor ? sql`` : query.sortOrder === "asc" ? sql`and ${sql.unsafe(camelToSnakeString(query.sortBy))} > ${query.cursor}` : sql`and ${sql.unsafe(camelToSnakeString(query.sortBy))} < ${query.cursor}`}
    order by ${sql.unsafe(camelToSnakeString(query.sortBy))} ${sql.unsafe(query.sortOrder)}
    limit ${query.limit}
  `;
  // @ts-ignore
  return rows.map((row) => ({
    id: row.id,
    startAt: row.start_at,
    endAt: row.end_at,
    remark: row.remark,
    status: row.status,
    createdAt: row.created_at,
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
  })) as FullAppointment[];
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

export async function findOneFullById(id: string) {
  const [row] = await sql`
    select a.id, a.start_at, a.end_at, a.remark, a.status, a.created_at, p.id as patient_id, p.nickname as patient_nickname, p.avatar_url as patient_avatar_url, d.id as doctor_id, d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.avatar_url as doctor_avatar_url
    from appointments a
    left outer join patients p on a.patient_id = p.id
    left outer join doctors d on a.doctor_id = d.id
    where a.id = ${id}
  `;

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    startAt: row.start_at,
    endAt: row.end_at,
    remark: row.remark,
    status: row.status,
    createdAt: row.created_at,
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
  } as FullAppointment;
}

export async function createOne(
  data: PartiallyRequired<
    Appointment,
    "patientId" | "doctorId" | "startAt" | "endAt" | "remark"
  >,
) {
  const [row] = await sql`
    with a as (
      insert into appointments ${sql(camelToSnakeJson(data))}
      returning id, patient_id, doctor_id, start_at, end_at, remark, status, created_at
    )
    select a.id, a.start_at, a.end_at, a.remark, a.status, a.created_at, p.id as patient_id, p.nickname as patient_nickname, p.avatar_url as patient_avatar_url, d.id as doctor_id, d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.avatar_url as doctor_avatar_url
    from a
    left outer join patients p on a.patient_id = p.id
    left outer join doctors d on a.doctor_id = d.id
  `;

  if (!row) {
    throw new Error("failed to create appointment");
  }

  return {
    id: row.id,
    startAt: row.start_at,
    endAt: row.end_at,
    remark: row.remark,
    status: row.status,
    createdAt: row.created_at,
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
  } as FullAppointment;
}

export async function updateOneById(
  id: string,
  data: Partial<
    Pick<Appointment, "doctorId" | "startAt" | "endAt" | "status" | "remark">
  >,
) {
  const [row] = await sql`
    with a as (
      update appointments
      set ${sql(camelToSnakeJson(data))}
      where id = ${id}
      returning id, patient_id, doctor_id, start_at, end_at, remark, status, created_at
    )
    select a.id, a.start_at, a.end_at, a.remark, a.status, a.created_at, p.id as patient_id, p.nickname as patient_nickname, p.avatar_url as patient_avatar_url, d.id as doctor_id, d.first_name as doctor_first_name, d.last_name as doctor_last_name, d.avatar_url as doctor_avatar_url
    from a
    left outer join patients p on a.patient_id = p.id
    left outer join doctors d on a.doctor_id = d.id
  `;

  if (!row) {
    throw new Error("failed to update appointment");
  }

  return {
    id: row.id,
    startAt: row.start_at,
    endAt: row.end_at,
    remark: row.remark,
    status: row.status,
    createdAt: row.created_at,
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
  } as FullAppointment;
}
