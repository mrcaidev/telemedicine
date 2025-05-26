import { camelToSnakeJson } from "@/utils/case";
import type { AppointmentReminderEmail } from "@/utils/types";
import { sql } from "bun";

type Row = {
  appointment_id: string;
  email_id: string;
  scheduled_at: Date;
};

function normalizeRow(row: Row): AppointmentReminderEmail {
  return {
    appointmentId: row.appointment_id,
    emailId: row.email_id,
    scheduledAt: row.scheduled_at.toISOString(),
  };
}

export async function selectOne(query: { appointmentId?: string }) {
  const [row] = await sql`
    select appointment_id, email_id, scheduled_at
    from appointment_reminder_emails
    where true
    ${query.appointmentId ? sql`and appointment_id = ${query.appointmentId}` : sql``}
  `;

  if (!row) {
    return null;
  }

  return normalizeRow(row);
}

export async function insertOne(data: AppointmentReminderEmail) {
  const [row] = (await sql`
    insert into appointment_reminder_emails ${sql(camelToSnakeJson(data))}
    returning appointment_id, email_id, scheduled_at
  `) as Row[];

  if (!row) {
    throw new Error("failed to insert appointment reminder email");
  }

  return normalizeRow(row);
}
