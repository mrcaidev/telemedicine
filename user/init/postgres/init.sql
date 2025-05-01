create type user_role as enum (
  'platform_admin',
  'clinic_admin',
  'doctor',
  'patient'
);

create type gender as enum (
  'male',
  'female'
);

create table users (
  id uuid default gen_random_uuid() primary key,
  role user_role not null,
  email text not null,
  password_hash text default null,
  created_at timestamptz default now() not null,
  deleted_at timestamptz default null
);

create table platform_admins (
  id uuid primary key references users(id)
);

create table clinics (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now() not null,
  created_by uuid not null references platform_admins(id),
  deleted_at timestamptz default null,
  deleted_by uuid default null references platform_admins(id)
);

create table clinic_admins (
  id uuid primary key references users(id),
  clinic_id uuid not null references clinics(id),
  first_name text not null,
  last_name text not null,
  created_by uuid not null references platform_admins(id),
  deleted_by uuid default null references platform_admins(id)
);

create table doctors (
  id uuid primary key references users(id),
  clinic_id uuid not null references clinics(id),
  first_name text not null,
  last_name text not null,
  avatar_url text default null,
  gender gender not null,
  description text default '' not null,
  specialties text[] default '{}' not null,
  created_by uuid not null references clinic_admins(id),
  deleted_by uuid default null references clinic_admins(id)
);

create table patients (
  id uuid primary key references users(id),
  nickname text default null,
  avatar_url text default null,
  gender gender default null,
  birth_date date default null
);

create table otp_verifications (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  otp text not null,
  sent_at timestamptz default now() not null,
  verified_at timestamptz default null
);

create table google_identities (
  id uuid primary key references patients(id),
  google_id text not null unique,
  linked_at timestamptz default now() not null
);
