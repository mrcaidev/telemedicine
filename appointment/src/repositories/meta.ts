import { sql } from "bun";

export async function countAppointments() {
  const rows = await sql`
    select count(*)::integer as total
    from appointments
  `;
  return rows[0]?.total ?? 0;
}

export async function countClinicAppointmentsByMonth(clinicId: string) {
  const rows = (await sql`
    select
      to_char(created_at, 'YYYY-MM') as month,
      count(*)::integer as count
    from full_appointments
    where clinic_id = ${clinicId}
    group by to_char(created_at, 'YYYY-MM')
    order by month
  `) as { month: string; count: number }[];
  return rows;
}

export async function countDoctorAppointmentsByMonth(doctorId: string) {
  const rows = (await sql`
    select
      to_char(created_at, 'YYYY-MM') as month,
      count(*)::integer as count
    from appointments
    where doctor_id = ${doctorId}
    group by to_char(created_at, 'YYYY-MM')
    order by month
  `) as { month: string; count: number }[];
  return rows;
}

export async function selectClinicStats(clinicId: string) {
  const now = new Date();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD format

  // 获取总预约数量 (status = 'normal' 且 start_at > 当前时间)
  const [totalAppointmentsRow] = (await sql`
    select count(*)::integer as count
    from full_appointments
    where clinic_id = ${clinicId}
      and status = 'normal'
      and start_at > ${now.toISOString()}
  `) as { count: number }[];

  // 获取今日预约数量 (start_at 在今天)
  const [todayAppointmentsRow] = (await sql`
    select count(*)::integer as count
    from full_appointments
    where clinic_id = ${clinicId}
      and date(start_at) = ${today}
  `) as { count: number }[];

  // 获取待重新安排的预约数量 (status = 'to_be_rescheduled')
  const [pendingDoctorRequestRow] = (await sql`
    select count(*)::integer as count
    from full_appointments
    where clinic_id = ${clinicId}
      and status = 'to_be_rescheduled'
  `) as { count: number }[];

  // 获取医生总数
  const [doctorCountRow] = (await sql`
    select count(*)::integer as count
    from doctors
    where clinic_id = ${clinicId}
  `) as { count: number }[];

  // 获取今日无预约的医生数量
  const [doctorAvailableCountRow] = (await sql`
    select count(*)::integer as count
    from doctors d
    where d.clinic_id = ${clinicId}
      and not exists (
        select 1
        from appointments a
        where a.doctor_id = d.id
          and date(a.start_at) = ${today}
      )
  `) as { count: number }[];

  return {
    totalAppointments: Number(totalAppointmentsRow?.count ?? 0),
    todayAppointments: Number(todayAppointmentsRow?.count ?? 0),
    pendingDoctorRequest: Number(pendingDoctorRequestRow?.count ?? 0),
    doctorCount: Number(doctorCountRow?.count ?? 0),
    doctorAvailableCount: Number(doctorAvailableCountRow?.count ?? 0),
  };
}

export async function selectDoctorStats(doctorId: string) {
  const now = new Date();
  const today = now.toISOString().split("T")[0]; // YYYY-MM-DD format

  // 获取总预约数量 (status = 'normal' 且 start_at > 当前时间)
  const [totalAppointmentsRow] = (await sql`
    select count(*)::integer as count
    from appointments
    where doctor_id = ${doctorId}
      and status = 'normal'
      and start_at > ${now.toISOString()}
  `) as { count: number }[];

  // 获取今日预约数量 (start_at 在今天)
  const [todayAppointmentsRow] = (await sql`
    select count(*)::integer as count
    from appointments
    where doctor_id = ${doctorId}
      and date(start_at) = ${today}
  `) as { count: number }[];

  // 获取待重排的预约数量
  const [pendingDoctorRequestRow] = (await sql`
    select count(*)::integer as count
    from appointments
    where doctor_id = ${doctorId}
      and status = 'to_be_rescheduled'
  `) as { count: number }[];

  // 获取今日待重排的预约数量
  const [todayPendingDoctorRequestRow] = (await sql`
    select count(*)::integer as count
    from appointments
    where doctor_id = ${doctorId}
      and status = 'to_be_rescheduled'
      and date(start_at) = ${today}
  `) as { count: number }[];

  return {
    totalAppointments: Number(totalAppointmentsRow?.count ?? 0),
    todayAppointments: Number(todayAppointmentsRow?.count ?? 0),
    pendingDoctorRequest: Number(pendingDoctorRequestRow?.count ?? 0),
    todayPendingDoctorRequest: Number(todayPendingDoctorRequestRow?.count ?? 0),
  };
}

export async function selectClinicAppointmentsGroupByDoctors(clinicId: string) {
  const rows = (await sql`
    select
      to_char(created_at, 'YYYY-MM') as month,
      doctor_id,
      concat(doctor_first_name, ' ', doctor_last_name) as doctor_name,
      count(*)::integer as appointments
    from full_appointments
    where clinic_id = ${clinicId}
    group by to_char(created_at, 'YYYY-MM'), doctor_id, doctor_first_name, doctor_last_name
    order by month, doctor_name
  `) as {
    month: string;
    doctor_id: string;
    doctor_name: string;
    appointments: number;
  }[];

  // 将数据按月份分组
  const monthlyData = new Map<
    string,
    { doctorName: string; appointments: number }[]
  >();

  for (const row of rows) {
    if (!monthlyData.has(row.month)) {
      monthlyData.set(row.month, []);
    }
    monthlyData.get(row.month)?.push({
      doctorName: row.doctor_name,
      appointments: Number(row.appointments),
    });
  }

  // 转换为最终格式
  return Array.from(monthlyData.entries()).map(
    ([month, doctorAppointments]) => ({
      month,
      doctorAppointments,
    }),
  );
}

export async function rankDoctorsByAppointmentCount(clinicId: string) {
  const rows = (await sql`
    select
      row_number() over (order by count(*) desc) as rank,
      concat(doctor_first_name, ' ', doctor_last_name) as doctorName,
      count(*)::integer as count
    from full_appointments
    where clinic_id = ${clinicId}
    group by doctor_id, doctor_first_name, doctor_last_name
    order by rank
  `) as {
    rank: number;
    doctorName: string;
    count: number;
  }[];
  return rows;
}
