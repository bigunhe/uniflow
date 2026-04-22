# Alumni network mentoring — handoff for Ridmi

This document describes the **starter scaffold** for the alumni mentoring flow inside **`uniflow-web`** (Next.js). It is separate from **peer student mentors** under `/networking/mentors`.

## Product goal

- **Alumni / graduates** register a **profile for this feature only** (not a replacement for main UniFlow auth). They help students with career context, interviews, and how degrees map to roles.
- **Students** register their **interest / context** so alumni know how to help.
- **Primary journey (to build):** student discovers alumni → sends a **request** → alumni accepts or responds → **chat** continues in the existing **`/messages`** experience (or a dedicated thread model later).

Peer mentoring stays under **Community → Connect with peer mentors** (`/networking/mentors`).

## Route map

| Route | Purpose |
|-------|---------|
| `/networking` | Community hub with two cards (alumni vs peer). |
| `/networking/alumni` | Alumni network **hub**; links to register and both workspaces. Uses **`AppShellSidebar`** (no `MentorHeader`). |
| `/networking/alumni/register?role=alumni` or `role=student` | **Profile form**; persists to Supabase `alumni_network_profiles`. |
| `/networking/alumni/for-students` | **Student sub-dashboard** (stub sections: browse, requests, chats). |
| `/networking/alumni/for-alumni` | **Alumni sub-dashboard** (stub sections: profile summary, incoming interest, conversations). |
| `/messages` | Existing messaging UI; link from stubs until requests map to threads. |

## Layout and UI conventions

- **Shell:** [`app/(networking)/networking/alumni/layout.tsx`](../app/(networking)/networking/alumni/layout.tsx) — same pattern as peer mentors **landing**: `brand-dark-shell`, grid background, **`AppShellSidebar`**, **no** top mentor navbar.
- **Registration UX:** [`_components/AlumniRegisterForm.tsx`](../app/(networking)/networking/alumni/_components/AlumniRegisterForm.tsx) — two-column layout inspired by Shyni’s [`mentors/start`](../app/(networking)/networking/mentors/start/page.tsx), but fields and copy are alumni-network specific.

## Database

**Migration file:** [`supabase/migrations/20260422120000_alumni_network_profiles.sql`](../supabase/migrations/20260422120000_alumni_network_profiles.sql)

**Table:** `public.alumni_network_profiles`

| Column | Notes |
|--------|--------|
| `id` | `uuid`, PK |
| `user_id` | Nullable `uuid` → `auth.users(id)`. **Link this** when a profile should match a logged-in user. |
| `role` | `'alumni'` \| `'student'` |
| `full_name`, `email`, `phone` | Core contact; **`unique (role, email)`** for upserts |
| `programme` | Shared |
| `graduation_year`, `current_role`, `company`, `expertise`, `bio`, `topics_help` | Primarily **alumni** |
| `year_level`, `focus_areas` | Primarily **student** |
| `created_at`, `updated_at` | Timestamps |

**Security (your responsibility before production):**

- RLS is **not** enabled in this migration (documented in SQL comments). **Enable RLS** and define policies—for example: public read of safe alumni fields for browsing; insert/update restricted to `auth.uid() = user_id` after accounts are linked; students may only update their own row, etc.
- Do **not** ship wide-open anon access to PII long term.

**Legacy:** the older `alumni` table + [`actions.ts`](../app/(networking)/networking/alumni/actions.ts) remain for backwards compatibility; new work should use **`alumni_network_profiles`** and [`network-actions.ts`](../app/(networking)/networking/alumni/network-actions.ts).

## Server actions

[`network-actions.ts`](../app/(networking)/networking/alumni/network-actions.ts)

- **`submitAlumniNetworkProfile(formData)`** — validates and **upserts** on `(role, email)`. Returns `{ ok, nextPath }` or `{ ok: false, error }`.
- **`getAlumniNetworkProfilesByRole(role)`** — **stub**; returns `[]`. Implement listing + RLS-safe queries here.

Env required for saves: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Run the new migration on your Supabase project.

## What is done vs stubbed

**Done (starter):**

- [x] Hub page CTAs and copy aligned to alumni vs student registration and workspaces.
- [x] Sidebar shell for all `/networking/alumni/*` routes.
- [x] Registration form (alumni + student) + server upsert.
- [x] Stub student and alumni workspace pages with section placeholders.
- [x] SQL migration for `alumni_network_profiles`.

**Stub / TODO (for you):**

- [ ] Implement **`getAlumniNetworkProfilesByRole`** and student **browse** UI (cards, filters, search).
- [ ] **Request workflow:** schema (e.g. `alumni_connection_requests` with `student_profile_id`, `alumni_profile_id`, `status`, timestamps), server actions, and UI on both dashboards.
- [ ] Link **`user_id`** on profile create/update when the user is logged in (optional email match or explicit “claim profile” flow).
- [ ] **RLS** and tests for all new tables.
- [ ] Map accepted requests to **`/messages`** (or thread IDs) if the product should open a specific conversation.
- [ ] Remove placeholder copy and wire **real** empty/loading/error states.

## Integration points

- **Community card** already points to `/networking/alumni` — no change required unless product wants a direct deep link to register.
- **Peer mentors:** keep routing to `/networking/mentors`; do not mix data models with `alumni_network_profiles`.

## Suggested implementation order

1. Apply migration; confirm insert/upsert from register in a dev project.
2. Add RLS + service patterns; switch reads to authenticated client where needed.
3. Build alumni list + profile detail for students; add request CTA.
4. Build alumni “incoming requests” inbox + accept/decline.
5. Integrate messaging and notifications.

If anything in this scaffold blocks you (naming, extra columns, split tables), adjust in consultation with the team and update this file.
