import { camelToSnakeJson, snakeToCamelJson } from "@/utils/case";
import type { EmailSchedule } from "@/utils/types";
import { sql } from "bun";

export async function findOneByAppointmentId(appointmentId: string) {
  const [row] = await sql`
    select appointment_id, email_id, scheduled_at
    from email_schedules
    where appointment_id = ${appointmentId}
  `;

  if (!row) {
    return null;
  }

  return snakeToCamelJson(row) as EmailSchedule;
}

export async function createOne(data: EmailSchedule) {
  await sql`insert into email_schedules ${sql(camelToSnakeJson(data))}`;
}
