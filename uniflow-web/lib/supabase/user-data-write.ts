/**
 * PostgREST PGRST204 means the JSON body names a column that does not exist on
 * `public.user_data`. Apply `docs/migrations/recreate_user_data_fresh.sql` (clean slate)
 * or `docs/migrations/consolidate_profiles_into_user_data.sql` (merge-only), or
 * `docs/PROFILES-TABLE.sql` for new projects. Keep USER_DATA_KEYS_DEFERRED_UNTIL_MIGRATION
 * empty once the table matches the app.
 */
export const USER_DATA_KEYS_DEFERRED_UNTIL_MIGRATION = [] as const satisfies readonly string[];

/** Use for every `user_data` insert/upsert body (not for partial `update`). */
export function userDataWriteBody<T extends Record<string, unknown>>(row: T): T {
  const out = { ...row };
  for (const key of USER_DATA_KEYS_DEFERRED_UNTIL_MIGRATION) {
    delete out[key];
  }
  return out;
}
