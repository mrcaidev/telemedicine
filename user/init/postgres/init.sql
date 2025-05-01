create type account_role as enum (
  'platform_admin',
  'clinic_admin',
  'doctor',
  'patient'
);

create table accounts (
  id uuid default gen_random_uuid() primary key,
  role account_role not null,
  email text not null,
  password_hash text default null,
  created_at timestamptz default now() not null,
  deleted_at timestamptz default null
);

create table platform_admin_profiles (
  id uuid primary key references accounts(id)
);

create table clinics (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now() not null,
  created_by uuid not null references platform_admin_profiles(id),
  deleted_at timestamptz default null,
  deleted_by uuid default null references platform_admin_profiles(id)
);

create table clinic_admin_profiles (
  id uuid primary key references accounts(id),
  clinic_id uuid not null references clinics(id),
  first_name text not null,
  last_name text not null,
  created_by uuid not null references platform_admin_profiles(id),
  deleted_by uuid default null references platform_admin_profiles(id)
);

create type gender as enum (
  'male',
  'female'
);

create table doctor_profiles (
  id uuid primary key references accounts(id),
  clinic_id uuid not null references clinics(id),
  first_name text not null,
  last_name text not null,
  avatar_url text default null,
  gender gender default 'male' not null,
  description text default '' not null,
  specialties text[] default '{}' not null,
  created_by uuid not null references clinic_admin_profiles(id),
  deleted_by uuid default null references clinic_admin_profiles(id)
);

create table patient_profiles (
  id uuid primary key references accounts(id),
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
  id uuid primary key references patient_profiles(id),
  google_id text not null unique,
  linked_at timestamptz default now() not null
);
