create extension if not exists "pgcrypto";

create table if not exists public.learning_modules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  module_code text not null,
  module_name text not null,
  resource_count integer not null default 0,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learning_modules_user_code_unique unique (user_id, module_code)
);

create index if not exists learning_modules_user_id_idx
  on public.learning_modules (user_id);

create index if not exists learning_modules_last_synced_idx
  on public.learning_modules (user_id, last_synced_at desc nulls last);

create table if not exists public.learning_files (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.learning_modules(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  original_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint not null default 0,
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint learning_files_module_name_unique unique (module_id, original_name),
  constraint learning_files_storage_path_unique unique (storage_path)
);

create index if not exists learning_files_module_id_idx
  on public.learning_files (module_id);

create index if not exists learning_files_user_id_idx
  on public.learning_files (user_id);

alter table public.learning_modules enable row level security;
alter table public.learning_files enable row level security;

drop policy if exists "learning modules select own" on public.learning_modules;
create policy "learning modules select own"
  on public.learning_modules
  for select
  using (auth.uid() = user_id);

drop policy if exists "learning modules insert own" on public.learning_modules;
create policy "learning modules insert own"
  on public.learning_modules
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "learning modules update own" on public.learning_modules;
create policy "learning modules update own"
  on public.learning_modules
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "learning modules delete own" on public.learning_modules;
create policy "learning modules delete own"
  on public.learning_modules
  for delete
  using (auth.uid() = user_id);

drop policy if exists "learning files select own" on public.learning_files;
create policy "learning files select own"
  on public.learning_files
  for select
  using (auth.uid() = user_id);

drop policy if exists "learning files insert own" on public.learning_files;
create policy "learning files insert own"
  on public.learning_files
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "learning files update own" on public.learning_files;
create policy "learning files update own"
  on public.learning_files
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "learning files delete own" on public.learning_files;
create policy "learning files delete own"
  on public.learning_files
  for delete
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('learning-sync', 'learning-sync', false)
on conflict (id) do nothing;

drop policy if exists "learning sync objects read own" on storage.objects;
create policy "learning sync objects read own"
  on storage.objects
  for select
  using (
    bucket_id = 'learning-sync'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "learning sync objects insert own" on storage.objects;
create policy "learning sync objects insert own"
  on storage.objects
  for insert
  with check (
    bucket_id = 'learning-sync'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "learning sync objects update own" on storage.objects;
create policy "learning sync objects update own"
  on storage.objects
  for update
  using (
    bucket_id = 'learning-sync'
    and auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'learning-sync'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "learning sync objects delete own" on storage.objects;
create policy "learning sync objects delete own"
  on storage.objects
  for delete
  using (
    bucket_id = 'learning-sync'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
