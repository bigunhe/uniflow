-- UniFlow Mentor AI platform schema for Supabase Postgres.
-- Run in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null default '',
  role text check (role in ('student','mentor')),
  headline text,
  subject_tags text[] not null default '{}',
  goals text,
  availability text,
  rating numeric(3,2) not null default 4.50,
  sessions_completed integer not null default 0,
  avg_response_seconds integer not null default 120,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentor_profiles (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  expertise text not null,
  experience_years integer not null default 0,
  availability text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  user_id uuid primary key references public.user_profiles(id) on delete cascade,
  education_level text not null,
  subjects text not null,
  goals text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.guidance_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.user_profiles(id) on delete cascade,
  mentor_id uuid references public.user_profiles(id) on delete set null,
  topic text not null,
  description text not null,
  urgency text not null check (urgency in ('low','medium','high','urgent')),
  preferred_time text,
  status text not null default 'open' check (status in ('open','pending','accepted','rejected','completed')),
  subject_tags text[] not null default '{}',
  session_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references public.user_profiles(id) on delete cascade,
  student_id uuid not null references public.user_profiles(id) on delete cascade,
  request_id uuid not null references public.guidance_requests(id) on delete cascade,
  start_time timestamptz not null,
  end_time timestamptz,
  duration_minutes integer,
  notes text,
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.guidance_requests
  add constraint if not exists guidance_requests_session_id_fkey
  foreign key (session_id) references public.sessions(id) on delete set null;

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  sender_id uuid not null references public.user_profiles(id) on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

alter publication supabase_realtime add table public.guidance_requests;
alter publication supabase_realtime add table public.sessions;
alter publication supabase_realtime add table public.messages;

create index if not exists idx_guidance_requests_student on public.guidance_requests(student_id);
create index if not exists idx_guidance_requests_mentor on public.guidance_requests(mentor_id);
create index if not exists idx_sessions_student on public.sessions(student_id);
create index if not exists idx_sessions_mentor on public.sessions(mentor_id);
create index if not exists idx_messages_session on public.messages(session_id);
