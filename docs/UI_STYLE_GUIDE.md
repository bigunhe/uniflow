# UniFlow UI style guide (for humans and AI assistants)

**Purpose:** Anyone editing UniFlow—especially **networking / mentoring**, **learning**, or **shared chrome**—should follow these rules so new screens **match the product’s dark “zen” shell**, stay **readable**, and **do not fork** fake auth or duplicate onboarding.

**How to use this doc:** Add it to your AI context (Cursor `@` file, project rules, or paste the “Rules checklist” section). When generating or refactoring UI, the model must **default to these tokens and patterns**, not arbitrary light marketing themes.

---

## 1. Product architecture (do not fight it)

- **Feature silos** (see repo `README.md`): stay inside your assigned `app/(…)` route group. **Do not** import pages from another silo; use `components/shared` and `lib/` for shared code.
- **Real auth only:** Sign-in flows use **Supabase** (`(auth)/login`, `(auth)/register`, callback). **Do not** add parallel “fake login”, **localStorage-only identity**, or duplicate **profile setup** outside `(auth)/profile-setup` and **`/p`** (profile view/edit when onboarding is complete).
- **Navigation:** Primary app navigation matches the **dashboard sidebar** (Community → `/networking`, Learning, Projects, Profile → `/p`, etc.). Standalone marketing nav is **not** the source of truth for logged-in users.

---

## 2. Dark shell (“brand dark”) — when it applies

Use the **dark shell** for any experience that sits **inside the signed-in UniFlow app** (dashboard, profile, community areas that should feel like one product).

| Token / element | Value | Usage |
|-----------------|-------|--------|
| Page background | `#080c14` | Main app background; set `body` when this shell is active. |
| Shell class | `brand-dark-shell` (often with `dash-root`) | Wrapper for full-page app layouts using dashboard-style UI. |
| CSS variables | See `uniflow-web/app/globals.css` `:root` | Prefer `--brand-dark-bg`, `--brand-dark-text`, `--brand-dark-muted`, `--brand-dark-link`, etc., when adding scoped styles. |

**Background atmosphere (optional but on-brand):**

- Subtle **grid**: teal-tinted lines at low opacity (~3%) on `#080c14`.
- Soft **glows**: radial gradients using **teal** `rgba(0,210,180,…)` and **indigo** `rgba(99,102,241,…)`—large, blurred, decorative only.

---

## 3. Typography

| Role | Font | Notes |
|------|------|--------|
| Headings / logo numerals | **Inter** (600–800) | Tight letter-spacing on large titles (`letter-spacing: -0.03em` where used on dashboard). |
| Body / UI labels | **DM Sans** (300–500) | Default reading font for shell UI. |

**Google Fonts import (pattern used on dashboard):**

`Inter:wght@600;700;800` + `DM+Sans:wght@300;400;500`

Do **not** introduce unrelated display fonts for core app screens without team agreement.

---

## 4. Color and contrast (readable, not muddy)

**Primary accent (teal):** `#00d2b4` — CTAs, active nav, key highlights.

**Secondary accent (indigo):** `#6366f1` — gradients, secondary emphasis (e.g. logo mark gradient with teal).

**Text on dark:**

- Strong headings: `#fff` / `#f0f4fb`
- Primary body: `rgba(232,238,248,0.92)` or CSS `--brand-dark-text` (`#d4dde8`)
- Secondary: `rgba(168,184,208,0.85)` to `0.9` — **must stay legible**; avoid gray that disappears on `#080c14`
- Muted labels: `rgba(255,255,255,0.38)`–`0.45` for **small** UI chrome only, not long paragraphs

**Surfaces:**

- Sidebar: `rgba(10,14,22,0.92)` with `border-right: 1px solid rgba(255,255,255,0.08)`
- Cards: `background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px` (dashboard pattern)

**Semantic:**

- Success / positive: teal family  
- Danger / logout hover: `#f87171` (light red), not pure neon on large areas

---

## 5. Components and interaction

- **Radius:** Prefer **10–12px** buttons, **20px** cards, pills **full rounded** where dashboard uses them.
- **Motion:** Short transitions (~0.18s) for hover; optional `fadeUp` for cards—keep subtle.
- **Active nav state:** Teal-tinted background + border (`rgba(0,210,180,0.1)` / `0.2`) and **teal text** `#00d2b4`.
- **Icons:** Emoji used in sidebar is acceptable in existing dashboard; if using Lucide elsewhere, keep **stroke weight and size** consistent within a page.

---

## 6. Tailwind + shadcn

- Learning and shared areas may use **Tailwind** + **shadcn/ui** tokens. For **dark app pages**, map Tailwind colors to the palette above—**do not** default to `bg-slate-50` / `text-gray-600` for main app surfaces unless the screen is explicitly a **separate** light document (rare).
- If a page is **temporarily** light (e.g. legacy marketing), plan to **either** wrap it in the dark shell **or** isolate it behind clear entry from Community with a migration path.

---

## 7. Reference implementation

The **source of truth** for the dark dashboard shell is:

- `uniflow-web/app/(bewan dashboard)/dashboard/page.tsx` — inline shell styles (sidebar, main, cards, grid).
- `uniflow-web/app/globals.css` — `--brand-dark-*` variables and `.brand-dark-shell` notes.

New work should **visually align** with these before merge.

---

## 8. Rules checklist (copy into AI instructions)

1. Use **`#080c14`** background and **teal `#00d2b4`** + **indigo `#6366f1`** accents for in-app dark UI.  
2. Use **Inter** for headings and **DM Sans** for body in app shell screens.  
3. Keep **text contrast** high; avoid low-contrast gray body copy on dark blue-black.  
4. **No fake auth**; use existing **Supabase** routes and **`/p`** / **`profile-setup`** only.  
5. **Stay in your silo**; share via **`lib/`** and **`components/shared`**.  
6. Prefer **dashboard-like** sidebar/top patterns for navigation consistency.  
7. Before PR: compare side-by-side with **`dashboard/page.tsx`** for first impression consistency.

---

## 9. Git / integration etiquette

- Target branch **`integration`** for group work; **do not push to `main`** without agreement.  
- **Do not** remove nested `.git` or restructure the repo without explicit owner approval.  
- Prefer **small commits** with clear messages; **push to GitHub only** when the lead confirms.

---

*Last updated: aligns with `integration` branch dashboard and `globals.css` brand-dark tokens.*
