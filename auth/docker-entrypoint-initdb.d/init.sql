create type user_role as enum (
  'platform_admin',
  'clinic_admin',
  'doctor',
  'patient'
);

create table users (
  id uuid default gen_random_uuid() primary key,
  role user_role not null,
  email text not null,
  password_hash text default null,
  password_salt text default null,
  created_at timestamptz default now() not null,
  created_by uuid default null references users(id),
  deleted_at timestamptz default null,
  deleted_by uuid default null references users(id)
);

create table otp_verifications (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  otp text not null,
  sent_at timestamptz default now() not null,
  verified_at timestamptz default null
)
