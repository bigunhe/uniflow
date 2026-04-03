# How to pull from `integration` and work on your own branch

Use this if you are **Shyni (mentoring / networking)** or **Ridmi (alumni)**—or any member who owns a **feature silo** under `uniflow-web/app/`.

---

## 1. One-time setup

```bash
# Clone (if you do not have the repo yet)
git clone https://github.com/bigunhe/uniflow.git
cd uniflow

# Make sure you see the integration branch
git fetch origin
git branch -a
```

Your shared integration line is: **`origin/integration`**.

---

## 2. Suggested branch names (create your own work branch)

Create a **new branch from `integration`** so you start from the latest merged code (Bewan + mentoring merge + fixes).

| Who | Suggested branch name | Your silo (approx.) |
|-----|------------------------|----------------------|
| **Shyni** | `feat/mentoring-shyni` | `uniflow-web/app/(networking)/…` (mentors, mentoring flows) |
| **Ridmi** | `feat/alumni-ridmi` | `uniflow-web/app/(networking)/…` (alumni) |

You can swap the suffix (`-shyni` / `-ridmi`) for something like `feat/mentoring-ui` if the lead prefers—**but keep one branch per person per topic** so PRs stay reviewable.

**Create and switch to your branch:**

```bash
git fetch origin
git checkout integration
git pull origin integration
git checkout -b feat/mentoring-shyni    # Shyni — or use your agreed name
# OR
git checkout -b feat/alumni-ridmi       # Ridmi — or use your agreed name
```

From here, **only edit files inside your silo** (and shared `lib/`, `components/shared` when truly shared—coordinate in chat first). See repo **`README.md`** for “who works where”.

---

## 3. Web app location (where you run `npm run dev`)

The Next.js app lives at:

```bash
cd uniflow-web
npm install --legacy-peer-deps   # first time, or after package.json changes
npm run dev
```

Open `http://localhost:3000`. **Do not** use an old path like `uniflow-monorepo/uniflow-web`—in this repo the app is **`uniflow-web/`** at the **root** of the clone.

---

## 4. Staying up to date while you work

Other people will push to **`integration`**. Before you open a PR (and anytime you need the latest):

```bash
git fetch origin
git checkout integration
git pull origin integration
git checkout feat/mentoring-shyni    # your branch name

# Option A — merge integration into your branch (simple, preserves history)
git merge origin/integration

# Option B — rebase your commits on top of integration (linear history; only if you know rebase)
# git rebase origin/integration
```

Resolve any conflicts **only in files you own** when possible; ask in group chat for shared files (`layout.tsx`, `package.json`, etc.).

---

## 5. Saving your work and opening a PR

```bash
git status
git add <paths-you-changed>
git commit -m "feat(mentoring): short description of what you did"
git push -u origin feat/mentoring-shyni   # first push for this branch
```

Then on **GitHub** → **Pull requests** → **New pull request**:

- **Base:** `integration`  
- **Compare:** `feat/mentoring-shyni` (or your branch)

Ask the lead for review. **Do not merge into `main`** unless the team agrees.

---

## 6. If you only need to “get the files” without branching yet

```bash
git fetch origin
git checkout integration
git pull origin integration
```

You now have everyone’s merged work on **`integration`** locally. Create your work branch when you are ready to commit (step 2).

---

## 7. Style and product rules (for AI + humans)

Before writing a lot of UI, read **`docs/UI_STYLE_GUIDE.md`** and add it to your editor AI context so new screens match the **dark shell**, fonts, and **real auth** rules.

---

## Quick reference

| Step | Command / target |
|------|------------------|
| Latest shared code | `git pull origin integration` (on `integration`) |
| Your branch | `feat/mentoring-shyni` or `feat/alumni-ridmi` (or names your lead confirms) |
| PR target | **`integration`** |
| Run app | `cd uniflow-web && npm run dev` |

---

*If branch names change, your lead should update this file in one commit so everyone stays aligned.*
