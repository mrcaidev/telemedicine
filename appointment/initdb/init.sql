create table doctor_availabilities (
  id uuid default gen_random_uuid() primary key,
  doctor_id uuid not null,
  weekday integer not null check (weekday >= 0 and weekday <= 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz default now() not null,
  created_by uuid not null
);

create type appointment_status as enum (
  'normal',
  'to_be_rescheduled',
  'canceled',
);

create table appointments (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid not null,
  doctor_id uuid not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  remark text not null,
  status appointment_status default 'normal' not null,
  created_at timestamptz default now() not null
);
