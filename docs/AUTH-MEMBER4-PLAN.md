# Member 4: Auth & Profile — Plan and Path

Clear plan to build the auth/profile area: dummy auth pages, then profile creation (real), with an entry from the home page. No full Google auth yet; leave placeholders and start from profile creation.

---

## 1. Entry point (how users reach Member 4’s part)

**Where:** `app/page.tsx` (home page)

**Change:** Add two links so the home page is the start:

- **"Login"** → `/login` (dummy for now)
- **"Profile setup"** or **"Get started"** → `/profile-setup` (real; start here)

No separate “auth hub” page. Home is the entry; from there users go to Login (dummy) or straight to Profile setup.

---

## 2. Member 4’s routes (where his pages live)

All under the `(auth)` route group and `pulse`. URLs:

| URL | File | Purpose |
|-----|------|--------|
| `/login` | `app/(auth)/login/page.tsx` | Dummy: “Google auth coming soon” + link to profile-setup |
| `/register` | `app/(auth)/register/page.tsx` | Dummy: “Coming soon” + link to login |
| `/profile-setup` | `app/(auth)/profile-setup/page.tsx` | **Real:** profile creation form (build this first) |
| `/pulse/[username]` | `app/pulse/[username]/page.tsx` | Show profile by username (minimal for now) |

He does **not** add routes under `(networking)` or `(learning)`. New auth/profile pages go under `app/(auth)/` or `app/pulse/` (e.g. `(auth)/profile/page.tsx` later for “my profile”).

---

## 3. Build order (quick path)

1. **Dummy login and register** — so the flow exists but auth is skipped.
2. **Supabase `profiles` table** — one table for profile data.
3. **Server actions for profile** — create and read profile (same Supabase project as the rest of the app).
4. **Profile-setup page** — form that saves to `profiles` and then links to pulse.
5. **Pulse page** — load profile by `username` and show it (minimal).

No Google auth implementation yet; `lib/auth.ts` stays as-is (`getCurrentUser()` returns `null`). When you add real auth later, you’ll wire `getCurrentUser()` and optionally protect `/profile-setup` and `/profile`.

---

## 4. Step-by-step implementation

### Step 1: Entry from home

**File:** `app/page.tsx`

- Add two links: one to `/login`, one to `/profile-setup`.
- Use Next.js `Link`; style as buttons or text links so it’s clear where to go.

---

### Step 2: Dummy login page

**File:** `app/(auth)/login/page.tsx`

- Title: e.g. “Login”.
- Short text: “Google authentication coming soon.”
- One button/link: **“Continue to profile setup”** → `href="/profile-setup"`.
- So for now users “skip” auth and go straight to profile creation.

---

### Step 3: Dummy register page

**File:** `app/(auth)/register/page.tsx`

- Text: “Registration will use Google. Coming soon.”
- Link back to `/login`. No form, no logic.

---

### Step 4: Supabase `profiles` table

**Where:** Supabase Dashboard → your project → SQL Editor.

**Table:** `profiles`. Same project as mentors/alumni; same env vars. Member 4 uses `getSupabase()` from `lib/supabase.ts`.

Run:

```sql
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  email text,
  username text not null unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Allow all for profiles"
  on public.profiles for all
  using (true) with check (true);
```

Later you can add `user_id uuid references auth.users(id)` when you add real auth.

---

### Step 5: Server actions for profile (Member 4)

**File:** `app/(auth)/actions.ts` (create this file)

- `"use server"`.
- Use `getSupabase()` from `@/lib/supabase`.
- **`createProfile(formData: FormData)`**  
  Read `display_name`, `email`, `username` from form. Insert into `profiles`. Call `revalidatePath` as needed. Return something like `{ success: true, username }` or throw on error (e.g. duplicate username).
- **`getProfileByUsername(username: string)`**  
  `from("profiles").select("*").eq("username", username).single()`. Used by the pulse page.

Keep all auth/profile server logic here (or in one place under `(auth)`); do not put it in `(networking)` or `(learning)`.

---

### Step 6: Profile-setup page (real)

**File:** `app/(auth)/profile-setup/page.tsx`

- Form with fields: **display_name**, **email**, **username** (all required or email optional).
- `action={createProfile}` (from `(auth)/actions.ts`).
- On success: redirect to `/pulse/${username}` (use `redirect()` from `next/navigation` inside the action after insert), or show success and a link to `/pulse/${username}`.
- Minimal styling; same pattern as mentors/alumni (form + server action).
- No `getCurrentUser()` check for now (auth is dummy).

---

### Step 7: Pulse page (minimal)

**File:** `app/pulse/[username]/page.tsx`

- Receive `params.username`.
- Call `getProfileByUsername(params.username)` from `(auth)/actions.ts`.
- If not found, show “Profile not found”.
- If found, show `display_name`, `email`, `username` (and later avatar/bio). Optional: link back to home or to profile-setup.

---

## 5. Where Member 4 works (summary)

| He edits | He does not edit |
|----------|-------------------|
| `app/(auth)/*` (login, register, profile-setup, and later profile management) | `app/(networking)/*`, `app/(learning)/*` |
| `app/pulse/*` | Hub `networking/page.tsx` |
| `lib/auth.ts` (when adding real auth) | Other members’ actions or pages |
| `app/(auth)/actions.ts` (profile + auth-related actions) | |

---

## 6. Later (when you add real auth)

- Implement Google auth (e.g. Supabase Auth with Google provider).
- In `lib/auth.ts`, implement `getCurrentUser()` using Supabase session.
- In `/profile-setup` (and later `/profile`), call `getCurrentUser()` and redirect to `/login` if null.
- Add `user_id` to `profiles` and link rows to `auth.users`; optionally restrict RLS so users only see/edit their own profile.

Until then, the dummy login and profile-setup flow are enough to build and test the profile creation path.

---

## 7. Implementation: exact code and explanations

Below is the exact code for each file. Apply in this order: Step 1 → 2 → 3 → 4 (SQL in Supabase) → 5 → 6 → 7.

---

### Step 1: Home page — entry links to Login and Profile setup

**File:** `uniflow-web/app/page.tsx`

**What this does:** The home page is the starting point. We add two links so a visitor can go to the dummy Login page or straight to Profile setup. Both use Next.js `Link`; the URL is the only difference. Styling is minimal so Member 4 can change it later.

**Replace the entire file with:**

```tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-2">UniFlow</h1>
      <p className="mb-4 text-gray-600">Welcome.</p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          Login
        </Link>
        <Link
          href="/profile-setup"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Profile setup
        </Link>
      </div>
    </main>
  );
}
```

**Check:** Open `/`. You should see "Login" and "Profile setup". Clicking them goes to `/login` and `/profile-setup` (profile-setup will still be placeholder until Step 6).

---

### Step 2: Login page — dummy, skip to profile setup

**File:** `uniflow-web/app/(auth)/login/page.tsx`

**What this does:** This is the placeholder for Google auth. It explains that auth is coming later and gives one action: "Continue to profile setup". That link goes to `/profile-setup` so you can build and test profile creation without real login. No form, no server logic.

**Replace the entire file with:**

```tsx
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="p-6 max-w-md">
      <h1 className="text-xl font-semibold mb-2">Login</h1>
      <p className="mb-4 text-gray-600">
        Google authentication coming soon.
      </p>
      <Link
        href="/profile-setup"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Continue to profile setup
      </Link>
    </main>
  );
}
```

**Check:** Open `/login`. You should see the text and the button; the button goes to `/profile-setup`.

---

### Step 3: Register page — dummy, link back to login

**File:** `uniflow-web/app/(auth)/register/page.tsx`

**What this does:** Placeholder for future registration (e.g. with Google). No form. A link back to `/login` keeps the flow clear. Member 4 can replace this with real sign-up later.

**Replace the entire file with:**

```tsx
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="p-6 max-w-md">
      <h1 className="text-xl font-semibold mb-2">Register</h1>
      <p className="mb-4 text-gray-600">
        Registration will use Google. Coming soon.
      </p>
      <Link href="/login" className="text-blue-600 hover:underline">
        ← Back to Login
      </Link>
    </main>
  );
}
```

**Check:** Open `/register`. You should see the message and a link to `/login`.

---

### Step 4: Supabase `profiles` table (run in Supabase, not in code)

**Where:** Supabase Dashboard → your project → **SQL Editor** → New query.

**What this does:** Creates the table that stores profile data. Same Supabase project as mentors/alumni; same env vars. `username` is unique so each pulse URL is one profile. RLS is on with a permissive policy for now so the app can read/write without auth. When you add real auth, you can add a `user_id` column and stricter policies.

**Run this SQL once:**

```sql
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  email text,
  username text not null unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Allow all for profiles"
  on public.profiles for all
  using (true) with check (true);
```

**Check:** In Supabase **Table Editor**, you should see a `profiles` table with columns `id`, `display_name`, `email`, `username`, `created_at`, `updated_at`.

---

### Step 5: Auth server actions — create profile and get profile by username

**File:** `uniflow-web/app/(auth)/actions.ts` (create this file; it does not exist yet)

**What this does:** This file holds all server-side logic for the auth/profile area (Member 4 only). It uses the same Supabase client as the rest of the app (`getSupabase()`). No auth check yet.

- **`createProfile(formData)`**  
  Reads `display_name`, `email`, and `username` from the form, trims them, and inserts one row into `profiles`. If the insert fails (e.g. duplicate username), the error is thrown and the form can show it. On success it calls `redirect("/pulse/" + username)` so the user is sent to their new pulse page. In Next.js, `redirect()` throws, so the function does not return after a successful redirect.

- **`getProfileByUsername(username)`**  
  Fetches the profile whose `username` matches. Uses `.maybeSingle()` so that if no row exists we get `null` instead of an error. The pulse page uses this to show "Profile not found" or the profile data.

**Create the file with this content:**

```ts
"use server";

import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export async function createProfile(formData: FormData) {
  const display_name = (formData.get("display_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const username = (formData.get("username") as string)?.trim();

  if (!display_name || !username) {
    throw new Error("Display name and username are required.");
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("profiles").insert({
    display_name,
    email,
    username,
  });

  if (error) throw error;

  redirect("/pulse/" + encodeURIComponent(username));
}

export async function getProfileByUsername(username: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data;
}
```

**Check:** You don’t see this in the UI yet. After Step 6, submitting the profile-setup form will call `createProfile` and redirect to `/pulse/username`.

---

### Step 6: Profile-setup page — form that creates a profile and redirects to pulse

**File:** `uniflow-web/app/(auth)/profile-setup/page.tsx`

**What this does:** This is the real profile-creation screen. It’s a Server Component with a form. The form’s `action` is `createProfile`, so when the user submits, the browser sends the form data to the server, `createProfile` runs, inserts into `profiles`, and then redirects to `/pulse/username`. The link back to home is for navigation. We do not call `getCurrentUser()` here; that will be added when real auth exists.

**Replace the entire file with:**

```tsx
import Link from "next/link";
import { createProfile } from "../actions";

export default function ProfileSetupPage() {
  return (
    <main className="p-6 max-w-md">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Home
        </Link>
      </div>
      <h1 className="text-xl font-semibold mb-4">Profile setup</h1>

      <form action={createProfile} className="flex flex-col gap-3">
        <input
          name="display_name"
          placeholder="Display name"
          required
          className="border px-3 py-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border px-3 py-2 rounded"
        />
        <input
          name="username"
          placeholder="Username (for your pulse URL)"
          required
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-2 rounded w-fit"
        >
          Create profile
        </button>
      </form>
    </main>
  );
}
```

**Check:** Open `/profile-setup`. Fill in display name, email, and username and submit. You should be redirected to `/pulse/your-username`. In Supabase Table Editor, `profiles` should have the new row. If you submit a duplicate username, the action will throw and you’ll see an error (you can add error handling in the form later).

---

### Step 7: Pulse page — show one profile by username

**File:** `uniflow-web/app/pulse/[username]/page.tsx`

**What this does:** This page is shown at `/pulse/[username]`. Next.js passes the dynamic segment as `params.username`. We call `getProfileByUsername(params.username)` to load the profile. If there is no row, we show "Profile not found". If there is, we show `display_name`, `email`, and `username` and a link back to home. Later Member 4 can add avatar, bio, or edit link.

**Replace the entire file with:**

```tsx
import Link from "next/link";
import { getProfileByUsername } from "@/app/(auth)/actions";

export default async function PulsePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfileByUsername(params.username);

  if (!profile) {
    return (
      <main className="p-6">
        <p className="text-gray-600">Profile not found.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
          ← Home
        </Link>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-md">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Home
        </Link>
      </div>
      <h1 className="text-xl font-semibold mb-2">{profile.display_name}</h1>
      <p className="text-gray-600">@{profile.username}</p>
      {profile.email && (
        <p className="text-gray-600 mt-1">{profile.email}</p>
      )}
    </main>
  );
}
```

**Check:** After creating a profile in Step 6, you land on `/pulse/your-username`. You should see the display name, username, and email. Visiting `/pulse/nonexistent` should show "Profile not found".

---

## 8. Order summary

| Step | File or action | Purpose |
|------|----------------|--------|
| 1 | `app/page.tsx` | Home: links to Login and Profile setup |
| 2 | `app/(auth)/login/page.tsx` | Dummy login + "Continue to profile setup" |
| 3 | `app/(auth)/register/page.tsx` | Dummy register + link to login |
| 4 | Supabase SQL | Create `profiles` table |
| 5 | `app/(auth)/actions.ts` | `createProfile`, `getProfileByUsername` |
| 6 | `app/(auth)/profile-setup/page.tsx` | Profile form → create → redirect to pulse |
| 7 | `app/pulse/[username]/page.tsx` | Show profile by username or "not found" |

After Step 7, the flow is: Home → Login (dummy) or Profile setup → submit profile → redirect to `/pulse/username` → profile displayed. No Google auth yet; add that later in `lib/auth.ts` and protect routes as needed.
