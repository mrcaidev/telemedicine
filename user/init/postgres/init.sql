-- 用户的四种角色：平台管理员、诊所管理员、医生、病人。
create type user_role as enum (
  'platform_admin',
  'clinic_admin',
  'doctor',
  'patient'
);

-- 用户基表，包括了所有用户的账号基本信息。
-- 定义术语：用户 = 账号 + 资料。
create table accounts (
  id uuid default gen_random_uuid() primary key,
  role user_role not null,
  email text not null,
  password_hash text default null,
  created_at timestamptz default now() not null,
  deleted_at timestamptz default null
);

-- 对于所有未删除的账号，邮箱必须唯一。
-- 账号被删除后，邮箱仍然可以重复使用。
create unique index accounts_email_key
on accounts(email)
where deleted_at is null;

-- 平台管理员的资料。
create table platform_admin_profiles (
  id uuid primary key references accounts(id)
);

-- 平台管理员的完整用户视图。
create view platform_admins as (
  select
    a.id,
    a.role,
    a.email,
    a.created_at
  from platform_admin_profiles pap
  left outer join accounts a on pap.id = a.id
);

-- 诊所。
-- 由平台管理员管理。
create table clinics (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamptz default now() not null,
  created_by uuid not null references platform_admin_profiles(id),
  deleted_at timestamptz default null,
  deleted_by uuid default null references platform_admin_profiles(id)
);

-- 诊所管理员的资料。
-- 由平台管理员管理。
create table clinic_admin_profiles (
  id uuid primary key references accounts(id),
  clinic_id uuid not null references clinics(id),
  first_name text not null,
  last_name text not null,
  created_by uuid not null references platform_admin_profiles(id),
  deleted_by uuid default null references platform_admin_profiles(id)
);

-- 诊所管理员的完整资料视图。
create view clinic_admin_full_profiles as (
  select
    cap.id,
    cap.first_name,
    cap.last_name,
    c.id as clinic_id,
    c.name as clinic_name,
    c.created_at as clinic_created_at
  from clinic_admin_profiles cap
  left outer join clinics c on cap.clinic_id = c.id
);

-- 诊所管理员的完整用户视图。
create view clinic_admins as (
  select
    a.id,
    a.role,
    a.email,
    a.created_at,
    cap.first_name,
    cap.last_name,
    c.id as clinic_id,
    c.name as clinic_name,
    c.created_at as clinic_created_at
  from clinic_admin_profiles cap
  left outer join clinics c on cap.clinic_id = c.id
  left outer join accounts a on cap.id = a.id
);

-- 性别。
create type gender as enum (
  'male',
  'female'
);

create function generate_doctor_fts(
  first_name text,
  last_name text,
  description text,
  specialties text[]
)
returns tsvector
language sql
immutable
as $$
select
  to_tsvector('english', first_name) ||
  to_tsvector('english', last_name) ||
  to_tsvector('english', description) ||
  to_tsvector('english', array_to_string(specialties, ' '));
$$;

-- 医生的资料。
-- 由所在诊所的诊所管理员管理。
create table doctor_profiles (
  id uuid primary key references accounts(id),
  clinic_id uuid not null references clinics(id),
  first_name text not null,
  last_name text not null,
  avatar_url text default null,
  gender gender default 'male' not null,
  description text default '' not null,
  specialties text[] default '{}' not null,
  fts tsvector generated always as (generate_doctor_fts(first_name, last_name, description, specialties)) stored,
  embedding vector(384) default null,
  created_by uuid not null references clinic_admin_profiles(id),
  deleted_by uuid default null references clinic_admin_profiles(id)
);

-- 检索字段索引。
create index on doctor_profiles using gin(fts);
create index on doctor_profiles using hnsw(embedding vector_cosine_ops);

-- 医生的完整资料视图。
create view doctor_full_profiles as (
  select
    dp.id,
    dp.first_name,
    dp.last_name,
    dp.avatar_url,
    dp.gender,
    dp.description,
    dp.specialties,
    c.id as clinic_id,
    c.name as clinic_name,
    c.created_at as clinic_created_at
  from doctor_profiles dp
  left outer join clinics c on dp.clinic_id = c.id
);

-- 医生的完整用户视图。
create view doctors as (
  select
    a.id,
    a.role,
    a.email,
    a.created_at,
    dp.first_name,
    dp.last_name,
    dp.avatar_url,
    dp.gender,
    dp.description,
    dp.specialties,
    c.id as clinic_id,
    c.name as clinic_name,
    c.created_at as clinic_created_at
  from doctor_profiles dp
  left outer join clinics c on dp.clinic_id = c.id
  left outer join accounts a on dp.id = a.id
);

-- 文本 + 向量混合搜索医生。
create type search_doctors_result as (
  id uuid,
  role text,
  email text,
  created_at timestamptz,
  first_name text,
  last_name text,
  avatar_url text,
  gender gender,
  description text,
  specialties text[],
  clinic_id uuid,
  clinic_name text,
  clinic_created_at timestamptz,
  score float
);
create function search_doctors(
  query_text text,
  query_embedding vector(384),
  match_count int,
  max_score float default 10000,
  min_score float default 0,
  fts_weight float = 1,
  embedding_weight float = 1,
  rrf_k int = 3
)
returns setof search_doctors_result
language sql
as $$
with fts_results as (
  select id, row_number() over (order by ts_rank_cd(fts, to_tsquery('english', query_text)) desc) as rank
  from doctor_profiles
  where fts @@ to_tsquery('english', query_text)
  order by rank
  limit match_count * 2
),
embedding_results as (
  select id, row_number() over (order by embedding <=> query_embedding) as rank
  from doctor_profiles
  where embedding is not null
  order by rank
  limit match_count * 2
)
select
  doctors.*,
  coalesce(1.0 / (rrf_k + fts_results.rank), 0.0) * fts_weight
  + coalesce(1.0 / (rrf_k + embedding_results.rank), 0.0) * embedding_weight
  as score
from fts_results
full outer join embedding_results on fts_results.id = embedding_results.id
left outer join doctors on coalesce(fts_results.id, embedding_results.id) = doctors.id
where score between min_score and max_score
order by score desc
limit match_count
$$;

-- 病人的资料。
-- 由自己管理。
create table patient_profiles (
  id uuid primary key references accounts(id),
  nickname text default null,
  avatar_url text default null,
  gender gender default null,
  birth_date text default null
);

-- 病人的完整用户视图。
create view patients as (
  select
    a.id,
    a.role,
    a.email,
    a.created_at,
    pp.nickname,
    pp.avatar_url,
    pp.gender,
    pp.birth_date
  from patient_profiles pp
  left outer join accounts a on pp.id = a.id
);

-- 验证码记录。
create table otp_verifications (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  otp text not null,
  sent_at timestamptz default now() not null,
  verified_at timestamptz default null
);

-- 复合索引，用于快速查找指定邮箱的最后一条验证码记录。
create index otp_verifications_email_sent_at_key
on otp_verifications(email, sent_at desc);

-- Google 账号到平台账号的映射。
create table google_identities (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references accounts(id),
  google_id text not null unique,
  created_at timestamptz default now() not null
);

-- 安全操作的审计日志。
create table audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references accounts(id),
  action text not null,
  created_at timestamptz default now() not null
);
