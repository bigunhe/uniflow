create extension if not exists "pgcrypto";

do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'mentorship_request_status'
  ) then
    create type public.mentorship_request_status as enum (
      'pending',
      'accepted',
      'rejected'
    );
  end if;
end $$;

create table if not exists public.student_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  university text,
  program text,
  year_level integer,
  learning_goals text,
  skills text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentor_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  expertise text[] not null default '{}',
  years_experience integer,
  current_role text,
  company text,
  mentoring_topics text[] not null default '{}',
  bio text,
  availability jsonb not null default '{}'::jsonb,
  session_mode text,
  rating double precision not null default 0,
  total_sessions integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete cascade,
  mentor_id uuid not null references auth.users(id) on delete cascade,
  status public.mentorship_request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  accepted_at timestamptz,
  meeting_link text,
  constraint mentorship_requests_student_mentor_unique unique (student_id, mentor_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  receiver_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null references public.mentorship_requests(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.mentor_badges (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references auth.users(id) on delete cascade,
  badge_name text not null,
  criteria text,
  created_at timestamptz not null default now(),
  constraint mentor_badges_mentor_name_unique unique (mentor_id, badge_name)
);

create index if not exists student_profiles_university_idx
  on public.student_profiles (university);

create index if not exists mentor_profiles_rating_idx
  on public.mentor_profiles (rating desc);

create index if not exists mentor_profiles_expertise_gin_idx
  on public.mentor_profiles using gin (expertise);

create index if not exists mentorship_requests_student_status_idx
  on public.mentorship_requests (student_id, status, created_at desc);

create index if not exists mentorship_requests_mentor_status_idx
  on public.mentorship_requests (mentor_id, status, created_at desc);

create index if not exists messages_request_created_idx
  on public.messages (request_id, created_at asc);

create or replace function public.set_updated_at_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_student_profiles_updated_at on public.student_profiles;
create trigger set_student_profiles_updated_at
before update on public.student_profiles
for each row
execute procedure public.set_updated_at_timestamp();

drop trigger if exists set_mentor_profiles_updated_at on public.mentor_profiles;
create trigger set_mentor_profiles_updated_at
before update on public.mentor_profiles
for each row
execute procedure public.set_updated_at_timestamp();

drop trigger if exists set_mentorship_requests_updated_at on public.mentorship_requests;
create trigger set_mentorship_requests_updated_at
before update on public.mentorship_requests
for each row
execute procedure public.set_updated_at_timestamp();

alter table public.student_profiles enable row level security;
alter table public.mentor_profiles enable row level security;
alter table public.mentorship_requests enable row level security;
alter table public.messages enable row level security;
alter table public.mentor_badges enable row level security;

drop policy if exists "student profiles select authenticated" on public.student_profiles;
create policy "student profiles select authenticated"
  on public.student_profiles
  for select
  to authenticated
  using (true);

drop policy if exists "student profiles insert own" on public.student_profiles;
create policy "student profiles insert own"
  on public.student_profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "student profiles update own" on public.student_profiles;
create policy "student profiles update own"
  on public.student_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "mentor profiles select authenticated" on public.mentor_profiles;
create policy "mentor profiles select authenticated"
  on public.mentor_profiles
  for select
  to authenticated
  using (true);

drop policy if exists "mentor profiles insert own" on public.mentor_profiles;
create policy "mentor profiles insert own"
  on public.mentor_profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "mentor profiles update own" on public.mentor_profiles;
create policy "mentor profiles update own"
  on public.mentor_profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "requests select participants" on public.mentorship_requests;
create policy "requests select participants"
  on public.mentorship_requests
  for select
  to authenticated
  using (auth.uid() = student_id or auth.uid() = mentor_id);

drop policy if exists "requests insert student" on public.mentorship_requests;
create policy "requests insert student"
  on public.mentorship_requests
  for insert
  to authenticated
  with check (auth.uid() = student_id);

drop policy if exists "requests update participants" on public.mentorship_requests;
create policy "requests update participants"
  on public.mentorship_requests
  for update
  to authenticated
  using (auth.uid() = student_id or auth.uid() = mentor_id)
  with check (auth.uid() = student_id or auth.uid() = mentor_id);

drop policy if exists "messages select participants" on public.messages;
create policy "messages select participants"
  on public.messages
  for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "messages insert sender" on public.messages;
create policy "messages insert sender"
  on public.messages
  for insert
  to authenticated
  with check (auth.uid() = sender_id);

drop policy if exists "mentor badges select authenticated" on public.mentor_badges;
create policy "mentor badges select authenticated"
  on public.mentor_badges
  for select
  to authenticated
  using (true);

drop policy if exists "mentor badges manage mentor" on public.mentor_badges;
create policy "mentor badges manage mentor"
  on public.mentor_badges
  for all
  to authenticated
  using (auth.uid() = mentor_id)
  with check (auth.uid() = mentor_id);

do $$
begin
  begin
    alter publication supabase_realtime add table public.mentorship_requests;
  exception
    when duplicate_object then null;
  end;

  begin
    alter publication supabase_realtime add table public.messages;
  exception
    when duplicate_object then null;
  end;
end $$;
