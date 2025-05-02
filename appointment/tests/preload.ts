import { afterAll, beforeAll } from "bun:test";
import { consumer, producer } from "@/events/kafka";
import { sql } from "bun";

beforeAll(async () => {
  await sql`
    insert into patients (id, email, nickname, avatar_url) values
    ('8b41503d-92fd-4325-8032-df5dca24ab10', 'patient@example.com', null, null);

    insert into doctors (id, first_name, last_name, avatar_url) values
    ('4504abab-58c2-4fa7-ab05-ec5ac687625f', 'David', 'Tan', null);

    insert into doctor_availabilities (id, doctor_id, weekday, start_time, end_time, created_by) values
    ('103de33f-52e5-460d-a18f-a90b4837b982', '4504abab-58c2-4fa7-ab05-ec5ac687625f', 1, '09:00', '10:00', 'f4a169a6-3b5f-4876-a711-a69db1a81d72');
  `.simple();
});

afterAll(async () => {
  await producer.disconnect();
  console.log("kafka producer disconnected");
  await consumer.disconnect();
  console.log("kafka consumer disconnected");

  await sql`
    delete from email_schedules;
    delete from appointments;
    delete from doctor_availabilities;
    delete from doctors;
    delete from patients;
  `.simple();
});
