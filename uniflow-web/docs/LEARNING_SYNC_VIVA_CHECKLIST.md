# Learning Sync Viva Checklist

## One-time setup
- Run the new SQL migration in Supabase.
- Confirm bucket `learning-sync` exists and is private.
- Confirm RLS is enabled on `learning_modules` and `learning_files`.

## Happy-path demo flow
1. Log in with a test user.
2. Open `/sync`.
3. Upload one valid ZIP (`IT3010_UniFlow_Sync.zip`).
4. Verify success toast appears.
5. Verify redirect to `/learning/IT3010`.
6. Verify `/learning` shows the synced module card with updated resource count.
7. Verify module page shows real uploaded file names in Lecture Files accordion.

## Unknown module demo
1. Upload ZIP with unknown code in first six characters.
2. Verify modal appears with detected module code read-only.
3. Enter module name and continue.
4. Verify new module card is created and visible in `/learning`.

## Error-path checks
- Upload invalid/non-zip file -> proper error toast.
- Upload empty ZIP -> proper error toast.
- Upload duplicate names in ZIP -> sync completes without crashing.
- Simulate partial upload failure -> warning toast appears with partial sync message.

## Navigation + readability checks
- On `/learning`, `/sync`, `/learning/[moduleId]`, and `/learning/projects`, confirm compact back + hamburger menu is visible.
- Open drawer menu and jump between feature pages; confirm no visual overlap/clutter.
- Repeatedly click the same nav destination and verify browser Back does not loop through duplicate entries.
- Confirm heading typography is more readable (Inter) on learning/sync/dashboard surfaces.

## Viva talking points
- Real files are persisted in Supabase Storage per user path: `userId/moduleCode/fileName`.
- Metadata is persisted in DB (`learning_modules`, `learning_files`) with RLS.
- AI insights are intentionally mocked for now; file ingestion and module creation are real.
