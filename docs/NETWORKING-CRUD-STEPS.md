# Networking hub + simple CRUD (one DB, one env) — step-by-step

Use this as a checklist. Do each step in order; after each step you can run the app and verify before moving on.

---

## Step 1: One Supabase connection (env + client)

**What we’re doing:** The app will talk to your **one** Supabase project using a single URL and a single anon key. We put those in `.env` and create one client in `lib/supabase.ts`. Every part of the app (including mentors and alumni CRUD) will use this same client and the same project; only the **table name** (e.g. `mentors` vs `alumni`) will change.

**Why:** One project, one set of keys. No per-member env vars.

### 1.1 Create `.env` (if it doesn’t exist)

- **Where:** `uniflow-monorepo/uniflow-web/.env` (same folder as `package.json`).
- **Do not commit** this file (it should be in `.gitignore`).

Add these two lines (replace with your real values from Supabase):

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**How to get the values:** Supabase Dashboard → your project → **Settings** → **API** → copy **Project URL** and **anon public** key.

### 1.2 Update `.env.example` (so others know which vars to set)

- **Where:** `uniflow-monorepo/.env.example` (or `uniflow-monorepo/uniflow-web/.env.example` if you keep env there).

Add or keep:

```
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
```

Teammates (Members 2 & 3) will copy this to `.env` and fill in the same URL/key from the **same** project (they use it as collaborators).

### 1.3 Implement the Supabase client in the app

- **Where:** `uniflow-monorepo/uniflow-web/lib/supabase.ts`.

**What this file does:** It creates and exports a single Supabase client using the env vars. We’ll use this client only on the **server** (in Server Components and Server Actions), not in browser-only code. That’s why we read `process.env` here.

Replace the contents of `lib/supabase.ts` with:

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
```

**Why `getSupabase()` and not a single export?** So the client is created when we actually need it (e.g. inside a server action), and we can throw a clear error if env is missing. Each call returns a client that uses the same URL/key.

**Check:** From `uniflow-web` run `npm run dev`. The app should start. We haven’t used the client in the UI yet; the next steps will do that.

---

## Step 2: Create the two tables in your Supabase project

**What we’re doing:** In your **one** Supabase project, we create two tables: `mentors` (for Member 2’s page) and `alumni` (for Member 3’s page). Members 2 & 3 will log into Supabase with their collaborator accounts and can run SQL or use the Table Editor in the same project.

**Where:** Supabase Dashboard → your project → **SQL Editor** → New query.

Run the first block, then the second.

**Table: `mentors` (for Member 2’s CRUD):**

```sql
create table if not exists public.mentors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  created_at timestamptz default now()
);

alter table public.mentors enable row level security;

create policy "Allow all for mentors table"
  on public.mentors for all
  using (true) with check (true);
```

**Table: `alumni` (for Member 3’s CRUD):**

```sql
create table if not exists public.alumni (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  created_at timestamptz default now()
);

alter table public.alumni enable row level security;

create policy "Allow all for alumni table"
  on public.alumni for all
  using (true) with check (true);
```

**Why RLS and a permissive policy?** Row Level Security is on so that later you can tighten access (e.g. by user). The policy “allow all” is only for getting the simple CRUD working; you can replace it with proper auth later.

**Check:** In Supabase, **Table Editor** should show `mentors` and `alumni` with columns `id`, `name`, `email`, `created_at`.

---

## Step 3: Common hub page (entry for Members 2 & 3)

**What we’re doing:** A single page at `/networking` that shows two links: one to the Mentors CRUD page and one to the Alumni CRUD page. This is the “common page” where both members land before going to their own area.

**Where:** `uniflow-monorepo/uniflow-web/app/(networking)/networking/page.tsx`

**Why this path?** In the App Router, `(networking)` is a route group (parentheses mean it doesn’t appear in the URL). So `app/(networking)/networking/page.tsx` corresponds to the URL `/networking`. The inner folder name `networking` is the first real segment in the path.

Replace the contents of that file with:

```tsx
import Link from "next/link";

export default function NetworkingHubPage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">Networking</h1>
      <p className="mb-4 text-gray-600">Choose an area to work on.</p>
      <div className="flex gap-4">
        <Link
          href="/networking/mentors"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Mentors
        </Link>
        <Link
          href="/networking/alumni"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Alumni
        </Link>
      </div>
    </main>
  );
}
```

**What this does:** Renders a title, short text, and two links. `Link` goes to `/networking/mentors` and `/networking/alumni` without a full page reload. Styling is minimal Tailwind.

**Check:** Open `http://localhost:3000/networking`. You should see the two buttons; clicking them should go to `/networking/mentors` and `/networking/alumni` (those pages will still be placeholder until Step 4 and 5).

---

## Step 4: Mentors — simple CRUD (Member 2’s area)

**What we’re doing:** The Mentors page will (1) list all rows from the `mentors` table, (2) show a small form to add one row (name + email), and (3) allow deleting a row. All data comes from your one Supabase project, using the same `getSupabase()` client, but we only read/write the `mentors` table. This is the pattern Member 2 can extend.

We need two things: **server actions** (the functions that run on the server and call Supabase) and **the page** (which calls those actions and renders the form and list).

### 4.1 Mentors server actions

- **Where:** `uniflow-monorepo/uniflow-web/app/(networking)/networking/mentors/actions.ts` (create this file).

**What server actions are:** Functions that run on the server. They can use `getSupabase()`, read FormData, and change data. We mark them with `"use server"`. The page will call them (e.g. from a form action or from a button that submits a form). After a mutation we call `revalidatePath` so the page refreshes its data.

**Code for `mentors/actions.ts`:**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";

export async function getMentors() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("mentors")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createMentor(formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string) || null;
  if (!name?.trim()) return;

  const supabase = getSupabase();
  await supabase.from("mentors").insert({ name: name.trim(), email: email?.trim() || null });
  revalidatePath("/networking/mentors");
}

export async function deleteMentor(id: string) {
  const supabase = getSupabase();
  await supabase.from("mentors").delete().eq("id", id);
  revalidatePath("/networking/mentors");
}
```

**Flow:**  
- `getMentors()`: used by the page to show the list.  
- `createMentor(formData)`: called when the user submits the “Add” form; we insert one row then revalidate so the list updates.  
- `deleteMentor(id)`: called when the user clicks Delete on a row; we delete that row then revalidate.

### 4.2 Mentors page (form + list + delete)

- **Where:** `uniflow-monorepo/uniflow-web/app/(networking)/networking/mentors/page.tsx`

**What this page does:** It’s a Server Component. On the server it calls `getMentors()` and renders the list. The “Add” form uses `action={createMentor}` so the form submit runs the server action. Each row has a form that calls `deleteMentor(id)` so Delete also runs on the server. No client-side state for the list; everything is server-driven and revalidated after mutations.

Replace the contents of `mentors/page.tsx` with:

```tsx
import { getMentors, createMentor, deleteMentor } from "./actions";
import Link from "next/link";

export default async function MentorsPage() {
  const mentors = await getMentors();

  return (
    <main className="p-6 max-w-lg">
      <div className="mb-4">
        <Link href="/networking" className="text-blue-600 hover:underline">
          ← Networking
        </Link>
      </div>
      <h1 className="text-xl font-semibold mb-4">Mentors</h1>

      <form action={createMentor} className="flex flex-col gap-2 mb-6">
        <input
          name="name"
          placeholder="Name"
          required
          className="border px-3 py-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded w-fit">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {mentors.map((m) => (
          <li key={m.id} className="flex items-center justify-between border-b pb-2">
            <span>{m.name} — {m.email ?? "(no email)"}</span>
            <form action={deleteMentor.bind(null, m.id)}>
              <button type="submit" className="text-red-600 text-sm hover:underline">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
      {mentors.length === 0 && <p className="text-gray-500">No mentors yet. Add one above.</p>}
    </main>
  );
}
```

**Notes:**  
- `action={createMentor}`: Next.js passes the form’s FormData to `createMentor`.  
- `deleteMentor.bind(null, m.id)`: we need to pass the row id into the action; `.bind(null, m.id)` returns a function that receives FormData and forwards the id.  
- List is rendered on the server from `getMentors()`; after add/delete, `revalidatePath` causes this page to re-run and show fresh data.

**Check:** Go to `http://localhost:3000/networking/mentors`. Add a mentor (name + email), submit. You should see the new row. Click Delete on a row; it should disappear. Confirm in Supabase Table Editor that `mentors` has the same rows.

---

## Step 5: Alumni — simple CRUD (Member 3’s area)

**What we’re doing:** Same idea as Mentors, but for the `alumni` table. One Supabase client, same env; only the table name and the file locations change. This is the pattern Member 3 can extend.

### 5.1 Alumni server actions

- **Where:** `uniflow-monorepo/uniflow-web/app/(networking)/networking/alumni/actions.ts` (create this file).

**Code for `alumni/actions.ts`:**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { getSupabase } from "@/lib/supabase";

export async function getAlumni() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("alumni")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createAlumni(formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string) || null;
  if (!name?.trim()) return;

  const supabase = getSupabase();
  await supabase.from("alumni").insert({ name: name.trim(), email: email?.trim() || null });
  revalidatePath("/networking/alumni");
}

export async function deleteAlumni(id: string) {
  const supabase = getSupabase();
  await supabase.from("alumni").delete().eq("id", id);
  revalidatePath("/networking/alumni");
}
```

Same pattern as mentors: read from `alumni`, insert into `alumni`, delete from `alumni`, revalidate the alumni page path.

### 5.2 Alumni page (form + list + delete)

- **Where:** `uniflow-monorepo/uniflow-web/app/(networking)/networking/alumni/page.tsx`

**Code for `alumni/page.tsx`:**

```tsx
import { getAlumni, createAlumni, deleteAlumni } from "./actions";
import Link from "next/link";

export default async function AlumniPage() {
  const alumni = await getAlumni();

  return (
    <main className="p-6 max-w-lg">
      <div className="mb-4">
        <Link href="/networking" className="text-blue-600 hover:underline">
          ← Networking
        </Link>
      </div>
      <h1 className="text-xl font-semibold mb-4">Alumni</h1>

      <form action={createAlumni} className="flex flex-col gap-2 mb-6">
        <input
          name="name"
          placeholder="Name"
          required
          className="border px-3 py-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded w-fit">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {alumni.map((a) => (
          <li key={a.id} className="flex items-center justify-between border-b pb-2">
            <span>{a.name} — {a.email ?? "(no email)"}</span>
            <form action={deleteAlumni.bind(null, a.id)}>
              <button type="submit" className="text-red-600 text-sm hover:underline">
                Delete
              </button>
            </form>
          </li>
        ))}
      </ul>
      {alumni.length === 0 && <p className="text-gray-500">No alumni yet. Add one above.</p>}
    </main>
  );
}
```

**Check:** Open `http://localhost:3000/networking/alumni`. Add and delete a few alumni; confirm in Supabase that the `alumni` table updates. Mentors and alumni data are separate tables in the same project.

---

## Summary for Members 2 & 3

- **One project, one login:** They use the same Supabase project (as collaborators). Same URL and anon key in `.env`.
- **Common entry:** Go to `/networking`, then choose Mentors or Alumni.
- **Their area:** Member 2 works in `app/(networking)/networking/mentors/` (actions + page) and the `mentors` table. Member 3 works in `app/(networking)/networking/alumni/` and the `alumni` table.
- **Extending:** Add more columns in Supabase (and in the form/table), or add edit actions that `update` by id, following the same pattern: server action → `getSupabase()` → `from("mentors")` or `from("alumni")` → then `revalidatePath` for that page.
