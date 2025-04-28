create table patients (
  id uuid primary key,
  nickname text,
  avatar_url text
);

create table doctors (
  id uuid primary key,
  first_name text,
  last_name text,
  avatar_url text
);

create table doctor_availabilities (
  id uuid default gen_random_uuid() primary key,
  doctor_id uuid not null references doctors(id),
  weekday integer not null check (weekday between 0 and 6),
  start_time text not null,
  end_time text not null,
  created_at timestamptz default now() not null,
  created_by uuid not null
);

create type appointment_status as enum (
  'normal',
  'to_be_rescheduled',
  'cancelled'
);

create table appointments (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid not null references patients(id),
  doctor_id uuid not null references doctors(id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  remark text not null,
  status appointment_status default 'normal' not null,
  created_at timestamptz default now() not null
);
