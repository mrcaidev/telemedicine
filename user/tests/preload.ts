import { afterAll, beforeAll } from "bun:test";
import { producer } from "@/events/kafka";
import { sql } from "bun";

beforeAll(async () => {
  await sql`
    insert into accounts (id, role, email, password_hash) values
    ('e4c315ef-0f8d-4456-a69e-c971b5e25ebc', 'platform_admin', 'platform-admin@example.com', '$argon2id$v=19$m=65536,t=2,p=1$IU1kGZ0LDClgThVcElMHcL/JynOGI5c8KPS8hM2nD6w$ea7uvhh5FDBwo16RvZJOwzu/6Ex2LJ17UAuT2HZfzXo'),
    ('b7aa316d-d7ef-4b35-8075-a5440922b030', 'clinic_admin', 'clinic-admin@example.com', '$argon2id$v=19$m=65536,t=2,p=1$N32xgQsvBThNH5SxqcBGNHwEKMk7yTsvmSWJUo7cSVw$eC6l8eJBRtxhtfWXpYEf/tfJDaU1wN1f65dHOvBiYU0'),
    ('4504abab-58c2-4fa7-ab05-ec5ac687625f', 'doctor', 'doctor@example.com', '$argon2id$v=19$m=65536,t=2,p=1$9odw/G06GxMoWNzCfgKCk9zpSO1f72rix1JicYZPiZE$M4hpfUC3aFbqfxQmQoqgYb1laYKUQIRJXjcr5rcoC0o'),
    ('df9ffcca-1415-4837-95fa-83288e199d99', 'doctor', 'christa@gmail.com', '$argon2id$v=19$m=65536,t=2,p=1$xaY/2Vb3JiwZltld2mKRe12kY8PC9v92QZ7gKzxROVw$RivrTojN3HXV+5NozJExKzRLMWmkoRtG3URv0UfWObk'),
    ('04cd46f0-c785-48cc-bde1-898aac54c425', 'doctor', 'rory@gmail.com', '$argon2id$v=19$m=65536,t=2,p=1$y+9lSg+y5XY5gcKEtuNtkcocDrFG5qFw7XwF6l7Aehk$vYJQtO6fpq65og5KjAya9abMx7KsKF0HoAcSpIjX8cI'),
    ('8b41503d-92fd-4325-8032-df5dca24ab10', 'patient', 'patient@example.com', '$argon2id$v=19$m=65536,t=2,p=1$uE7NAQTVldZFwIA3OIfshFBQDtBjun4jIu0F9nnD6Wo$wFLk+4YdSV8hhSY0mzGJlfe/b7riyH5cKmvVPbkq24s');

    insert into platform_admin_profiles (id) values
    ('e4c315ef-0f8d-4456-a69e-c971b5e25ebc');

    insert into clinics (id, name, created_by) values
    ('f5dc8bbb-079b-41a0-8f52-8e25b5c71401', 'Test Clinic', 'e4c315ef-0f8d-4456-a69e-c971b5e25ebc');

    insert into clinic_admin_profiles (id, clinic_id, first_name, last_name, created_by) values
    ('b7aa316d-d7ef-4b35-8075-a5440922b030', 'f5dc8bbb-079b-41a0-8f52-8e25b5c71401', 'Charlie', 'Avery', 'e4c315ef-0f8d-4456-a69e-c971b5e25ebc');

    insert into doctor_profiles (id, clinic_id, first_name, last_name, description, specialties, created_by) values
    ('4504abab-58c2-4fa7-ab05-ec5ac687625f', 'f5dc8bbb-079b-41a0-8f52-8e25b5c71401', 'David', 'Tan', '', '{}', 'b7aa316d-d7ef-4b35-8075-a5440922b030'),
    ('df9ffcca-1415-4837-95fa-83288e199d99', 'f5dc8bbb-079b-41a0-8f52-8e25b5c71401', 'Christa', 'Conn', 'Very good at Surgery', '{"surgery"}', 'b7aa316d-d7ef-4b35-8075-a5440922b030'),
    ('04cd46f0-c785-48cc-bde1-898aac54c425', 'f5dc8bbb-079b-41a0-8f52-8e25b5c71401', 'Rory', 'Greenfelder', 'Good at both Cardiology and Surgery', '{"cardiology"}', 'b7aa316d-d7ef-4b35-8075-a5440922b030');

    insert into patient_profiles (id) values
    ('8b41503d-92fd-4325-8032-df5dca24ab10');
  `.simple();
});

afterAll(async () => {
  await producer.disconnect();
  console.log("kafka producer disconnected");

  await sql`
    delete from audit_logs;
    delete from otp_verifications;
    delete from google_identities;
    delete from patient_profiles;
    delete from doctor_profiles;
    delete from clinic_admin_profiles;
    delete from clinics;
    delete from platform_admin_profiles;
    delete from accounts;
  `.simple();
});
