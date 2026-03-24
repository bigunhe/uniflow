create table user_data (
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
  created_at timestamp default now()
);