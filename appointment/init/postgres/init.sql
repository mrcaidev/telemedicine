-- 病人资料表，从用户服务同步而来。
create table patients (
  id uuid primary key,
  email text,
  nickname text,
  avatar_url text
);

-- 医生资料表，从用户服务同步而来。
create table doctors (
  id uuid primary key,
  clinic_id uuid,
  first_name text,
  last_name text,
  avatar_url text
);

-- 医生每周的空闲时间。
create table doctor_availabilities (
  id uuid default gen_random_uuid() primary key,
  doctor_id uuid not null references doctors(id),
  weekday integer not null check (weekday between 0 and 6),
  start_time text not null,
  end_time text not null,
  created_at timestamptz default now() not null,
  deleted_at timestamptz default null
);

-- 预约的状态。
create type appointment_status as enum (
  'normal',
  'to_be_rescheduled',
  'cancelled'
);

-- 病人与医生之间的预约。
create table appointments (
  id uuid default gen_random_uuid() primary key,
  patient_id uuid not null references patients(id),
  doctor_id uuid not null references doctors(id),
  start_at timestamptz not null,
  end_at timestamptz not null,
  remark text not null,
  status appointment_status default 'normal' not null,
  medical_record_id uuid default null,
  created_at timestamptz default now() not null
);

-- 预约的完整视图，联合了病人资料、医生资料（以及其中的诊所 ID）。
create view full_appointments as (
  select
    a.id,
    a.start_at,
    a.end_at,
    a.remark,
    a.status,
    a.medical_record_id,
    a.created_at,
    p.id as patient_id,
    p.nickname as patient_nickname,
    p.avatar_url as patient_avatar_url,
    d.id as doctor_id,
    d.first_name as doctor_first_name,
    d.last_name as doctor_last_name,
    d.avatar_url as doctor_avatar_url,
    d.clinic_id
  from appointments a
  left outer join patients p on a.patient_id = p.id
  left outer join doctors d on a.doctor_id = d.id
);

-- 预约的定时提醒邮件。
create table appointment_reminder_emails (
  appointment_id uuid primary key references appointments(id),
  email_id uuid not null,
  scheduled_at timestamptz not null
);
