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

    insert into appointments (id, patient_id, doctor_id, start_at, end_at, remark, status, created_at) values
    ('538152d5-130b-4c0b-8cf9-0a54a73ba12d', '8b41503d-92fd-4325-8032-df5dca24ab10', '4504abab-58c2-4fa7-ab05-ec5ac687625f', '2024-01-06T01:00:00.000Z', '2024-01-06T02:00:00.000Z', 'appointment1', 'normal', '2025-05-02T12:47:01.230Z'),
    ('d0c3e158-53d3-43cc-956e-0c9f947df452', '8b41503d-92fd-4325-8032-df5dca24ab10', '4504abab-58c2-4fa7-ab05-ec5ac687625f', '2030-01-07T01:00:00.000Z', '2030-01-07T02:00:00.000Z', 'appointment2', 'to_be_rescheduled', '2025-05-02T12:47:01.230Z'),
    ('9a66efbd-0c18-4c09-bafd-9b78cb6e9f7b', '8b41503d-92fd-4325-8032-df5dca24ab10', '4504abab-58c2-4fa7-ab05-ec5ac687625f', '2030-01-14T01:00:00.000Z', '2030-01-14T02:00:00.000Z', 'appointment3', 'cancelled', '2025-05-02T12:47:01.230Z');
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
