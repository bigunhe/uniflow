-- Alumni network: extended profiles for graduates (alumni mentors) and students
-- participating in the alumni mentoring flow (separate from peer mentors).
--
-- SECURITY: Row Level Security is NOT enabled on this table in this scaffold migration.
-- Ridmi (or owner): enable RLS and add policies before production (e.g. public read for
-- browseable alumni fields, insert/update scoped to auth.uid() = user_id once accounts are linked).

create extension if not exists "pgcrypto";

create table if not exists public.alumni_network_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  role text not null check (role in ('alumni', 'student')),
  full_name text not null,
  email text not null,
  phone text,
  programme text,
  graduation_year text,
  current_role text,
  company text,
  expertise text,
  bio text,
  topics_help text,
  year_level text,
  focus_areas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint alumni_network_profiles_role_email_unique unique (role, email)
);

create index if not exists alumni_network_profiles_role_idx
  on public.alumni_network_profiles (role);

create index if not exists alumni_network_profiles_user_id_idx
  on public.alumni_network_profiles (user_id)
  where user_id is not null;

comment on table public.alumni_network_profiles is
  'Profiles for alumni mentoring network (not site auth). Link user_id when mapping to Supabase Auth.';
