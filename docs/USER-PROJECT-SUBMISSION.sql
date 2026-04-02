alter table public.user_project_submission enable row level security;

drop policy if exists "user_project_submission_public_read" on public.user_project_submission;
drop policy if exists "user_project_submission_insert_own" on public.user_project_submission;
drop policy if exists "user_project_submission_update_own" on public.user_project_submission;
drop policy if exists "user_project_submission_delete_own" on public.user_project_submission;

-- Public portfolio pages need read access for submissions.
create policy "user_project_submission_public_read"
  on public.user_project_submission
  for select
  to anon, authenticated
  using (true);

-- Signed-in users can only insert their own submissions.
create policy "user_project_submission_insert_own"
  on public.user_project_submission
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Signed-in users can only update their own submissions.
create policy "user_project_submission_update_own"
  on public.user_project_submission
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional: allow users to delete their own submissions.
create policy "user_project_submission_delete_own"
  on public.user_project_submission
  for delete
  to authenticated
  using (auth.uid() = user_id);
