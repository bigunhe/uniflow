-- user_data: single profile table for UniFlow (Bewan / shared auth).
-- Run in Supabase SQL Editor. If you already created an older version of this table,
-- use the ALTER snippets at the bottom instead of re-running CREATE.

create table if not exists public.user_data (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique,
  display_name text,
  username text unique,
  avatar_url text,
  is_mentor boolean default false,
  mentor_subjects text[] default '{}',
  learning_subjects text[] default '{}',
  job_role text,
  university text,
  year_of_study text,
  specialization text,
  pulse_score int default 0,
  onboarding_complete boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_data enable row level security;

drop policy if exists "Allow all for user_data" on public.user_data;
drop policy if exists "user_data_public_read" on public.user_data;
drop policy if exists "user_data_insert_own" on public.user_data;
drop policy if exists "user_data_update_own" on public.user_data;
drop policy if exists "user_data_delete_own" on public.user_data;

create policy "user_data_public_read"
  on public.user_data
  for select
  to anon, authenticated
  using (true);

create policy "user_data_insert_own"
  on public.user_data
  for insert
  to authenticated
  with check (auth.uid() = id);

create policy "user_data_update_own"
  on public.user_data
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "user_data_delete_own"
  on public.user_data
  for delete
  to authenticated
  using (auth.uid() = id);

-- --- Existing projects: add missing columns ---
-- alter table public.user_data add column if not exists learning_subjects text[] default '{}';
-- alter table public.user_data add column if not exists specialization text;
-- alter table public.user_data add column if not exists onboarding_complete boolean default false;
-- alter table public.user_data add column if not exists updated_at timestamptz default now();
