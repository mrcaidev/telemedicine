import { afterAll, beforeAll, mock } from "bun:test";
import { sql } from "bun";

mock.module("@/utils/request", () => ({
  requestUser: {
    get: async () => {},
    post: async () => {},
    put: async () => {},
    patch: async () => {},
    delete: async () => {},
  },
  requestNotification: {
    get: async () => {},
    post: async () => {},
    put: async () => {},
    patch: async () => {},
    delete: async () => {},
  },
}));

if (Bun.env.UNIT_TEST) {
  mock.module("bun", () => ({
    sql: async () => {},
  }));

  mock.module("kafkajs", () => ({
    Kafka: class {
      producer() {
        return {
          connect: async () => {},
          disconnect: async () => {},
        };
      }
      consumer() {
        return {
          connect: async () => {},
          disconnect: async () => {},
          subscribe: async () => {},
          run: async () => {},
        };
      }
    },
    logLevel: {
      ERROR: 1,
    },
  }));
}

if (Bun.env.INTEGRATION_TEST) {
  const { producer, consumer } = await import("@/events/kafka");

  beforeAll(async () => {
    await sql`
      insert into patients (id, email, nickname, avatar_url) values
      ('0d342d37-fe96-45ff-97f8-629e40b823a6', 'Jasper_Ferry77@gmail.com', 'Lennie_Bednar', null),
      ('aacdc7fb-bdb6-449e-a6ce-03f335927d45', 'Michale1@yahoo.com', 'Harold_Senger', null),
      ('d568ab85-f95d-47ea-a9d2-cfd1314af840', 'Danyka36@yahoo.com', 'Berneice95', null);

      insert into doctors (id, clinic_id, first_name, last_name, avatar_url) values
      ('757eb510-e8ed-4304-958d-b881232e2632', '8c18f073-683e-42a7-9dc8-7805df80fd3b', 'Ahmed', 'Hyatt', null),
      ('38dddfc7-c956-4e2a-ba3a-6c4ef032914f', '8c18f073-683e-42a7-9dc8-7805df80fd3b', 'Marisa', 'Quigley', null),
      ('c1f28821-523b-439a-970f-ed613e10255e', '9c81b1f4-f9a7-4b72-a962-e48ba9883724', 'Cheyanne', 'Hammes', null);

      insert into doctor_availabilities (id, doctor_id, weekday, start_time, end_time, created_at) values
      ('0043fdc0-f8e0-45f4-9bf1-feb8c7e55bb0', '757eb510-e8ed-4304-958d-b881232e2632', 1, '09:00', '10:00', '2025-01-01T00:00:00.000Z'),
      ('5ad20a94-dd14-4cc5-94d7-91a0d206aabc', '757eb510-e8ed-4304-958d-b881232e2632', 2, '10:00', '11:00', '2025-01-01T00:00:00.000Z'),
      ('1a60e3af-974d-4f0d-bfec-734639bf2fd2', '38dddfc7-c956-4e2a-ba3a-6c4ef032914f', 3, '11:00', '12:00', '2025-01-01T00:00:00.000Z'),
      ('6e68ce63-6b11-4019-8105-81bafcb9c845', 'c1f28821-523b-439a-970f-ed613e10255e', 4, '12:00', '13:00', '2025-01-01T00:00:00.000Z');

      insert into appointments (id, patient_id, doctor_id, start_at, end_at, remark, status, created_at) values
      ('ef9e8b01-9385-4338-8ad4-3d19f473b07f', '0d342d37-fe96-45ff-97f8-629e40b823a6', '757eb510-e8ed-4304-958d-b881232e2632', '2025-01-06T01:00:00.000Z', '2025-01-06T02:00:00.000Z', 'appointment1', 'normal', '2025-01-04T01:00:00.000Z'),
      ('3785021e-d4c6-40ce-841b-4230bb417c93', '0d342d37-fe96-45ff-97f8-629e40b823a6', '38dddfc7-c956-4e2a-ba3a-6c4ef032914f', '2030-12-04T03:00:00.000Z', '2030-12-04T04:00:00.000Z', 'appointment2', 'to_be_rescheduled', '2030-12-02T03:00:00.000Z'),
      ('4ca2283e-a33f-466c-9c8b-63096fa8c53a', 'aacdc7fb-bdb6-449e-a6ce-03f335927d45', 'c1f28821-523b-439a-970f-ed613e10255e', '2030-12-05T04:00:00.000Z', '2030-12-05T05:00:00.000Z', 'appointment3', 'cancelled', '2030-12-03T04:00:00.000Z'),
      ('7195ca4e-b20f-4017-b1a0-7b1752ef225f', 'd568ab85-f95d-47ea-a9d2-cfd1314af840', '757eb510-e8ed-4304-958d-b881232e2632', '2030-12-03T02:00:00.000Z', '2030-12-03T03:00:00.000Z', 'appointment4', 'cancelled', '2030-12-01T02:00:00.000Z');

      insert into appointment_reminder_emails (appointment_id, email_id, scheduled_at) values
      ('ef9e8b01-9385-4338-8ad4-3d19f473b07f', 'cf995bbc-158b-4bde-baed-27e8ad275a2e', '2025-01-05T01:00:00.000Z'),
      ('3785021e-d4c6-40ce-841b-4230bb417c93', 'd8d0d36d-ffaf-4854-baac-7cffed014698', '2030-12-03T03:00:00.000Z'),
      ('4ca2283e-a33f-466c-9c8b-63096fa8c53a', '9e92310b-e4b9-47cb-9e24-c4e1a5c58562', '2030-12-04T04:00:00.000Z'),
      ('7195ca4e-b20f-4017-b1a0-7b1752ef225f', '568c34eb-e08a-4017-9b60-23c77ac7837a', '2030-12-02T02:00:00.000Z');
    `.simple();
  });

  afterAll(async () => {
    await sql`
      delete from appointment_reminder_emails;
      delete from appointments;
      delete from doctor_availabilities;
      delete from doctors;
      delete from patients;
    `.simple();

    await producer.disconnect();
    console.log("kafka producer disconnected");
    await consumer.disconnect();
    console.log("kafka consumer disconnected");
  });
}
