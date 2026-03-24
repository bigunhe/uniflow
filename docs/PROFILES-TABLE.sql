create table if not exists public.user_data (
  id uuid primary key,
  email text unique,
  display_name text,
  username text unique,
  avatar_url text,
  is_mentor boolean default false,
  mentor_subjects text[] default '{}',
  job_role text,
  university text,
  year_of_study text,
  pulse_score int default 0,
  created_at timestamptz default now()
);

alter table public.user_data enable row level security;

drop policy if exists "Allow all for user_data" on public.user_data;
drop policy if exists "user_data_public_read" on public.user_data;
drop policy if exists "user_data_insert_own" on public.user_data;
drop policy if exists "user_data_update_own" on public.user_data;
drop policy if exists "user_data_delete_own" on public.user_data;

-- Public portfolio pages need read access for both anonymous and signed-in users.
create policy "user_data_public_read"
  on public.user_data
  for select
  to anon, authenticated
  using (true);

-- Signed-in users can only create their own profile row.
create policy "user_data_insert_own"
  on public.user_data
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Signed-in users can only update their own profile row.
create policy "user_data_update_own"
  on public.user_data
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Optional: allow users to delete their own row.
create policy "user_data_delete_own"
  on public.user_data
  for delete
  to authenticated
  using (auth.uid() = id);