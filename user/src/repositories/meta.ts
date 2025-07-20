import type { Role } from "@/utils/types";
import { sql } from "bun";

export async function countUsers() {
  const rows = (await sql`
    select role, count(*) as total
    from accounts
    group by role
  `) as { role: Role; total: number }[];

  return rows;
}

export async function countClinics() {
  const [row] = (await sql`
    select count(*) as total
    from clinics
  `) as { total: number }[];
  return row?.total || 0;
}

export async function countClinicsAndDoctorsByMonth() {
  const rows = (await sql`
    select
      to_char(months.month, 'YYYY-MM') as month,
      coalesce(clinic_count, 0) as "clinicCount",
      coalesce(doctor_count, 0) as "doctorCount"
    from (
      select
        date_trunc('month', gs)::date as month
      from generate_series(
        (select min(created_at) from clinics),
        (select max(created_at) from clinics),
        interval '1 month'
      ) gs
    ) months
    left join (
      select
        date_trunc('month', created_at)::date as month,
        count(*) as clinic_count
      from clinics
      where deleted_at is null
      group by month
    ) c on months.month = c.month
    left join (
      select
        date_trunc('month', a.created_at)::date as month,
        count(*) as doctor_count
      from doctor_profiles dp
      left join accounts a on dp.id = a.id
      where dp.deleted_by is null
      group by month
    ) d on months.month = d.month
    order by months.month asc;
  `) as { month: string; clinicCount: number; doctorCount: number }[];

  return rows;
}

export async function rankClinics() {
  const rows = (await sql`
    select
      row_number() over (order by count(dp.id) desc) as rank,
      c.name as "clinicName",
      count(dp.id) as "doctorCount"
    from clinics c
    left join doctor_profiles dp on c.id = dp.clinic_id and dp.deleted_by is null
    where c.deleted_at is null
    group by c.id, c.name
    order by "doctorCount" desc, c.name asc
  `) as { rank: number; clinicName: string; doctorCount: number }[];

  return rows;
}
