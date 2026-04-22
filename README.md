# UniFlow - SLIIT Year 3 Project -- this README is temporary... have to change later...

Welcome to the UniFlow Monorepo! We are using a strict "Feature Silo" architecture to prevent Git merge conflicts and keep our code clean. 

## 🛑 The Golden Rules
1. **Stay in your Silo:** Only write code inside your assigned folder. 
2. **Never push to `main`:** You must create a branch for your feature, push it, and open a Pull Request (PR).
3. **The Danger Zone:** NEVER edit `package.json`, `layout.tsx`, or the database schema without asking the group chat first.

## 📂 Who Works Where? 
##....this is critical....
* **Bewan (Auth):** `uniflow-web/app/(auth)` & `pulse/`
* **Shyni / Ridmi (Networking/ mentoring):** `uniflow-web/app/(networking)`
* **Bigun (AI & Learning):** `uniflow-web/app/(learning)`, `uniflow-python/`, & `uniflow-extension/`

## 🔑 Getting Started (Day 1 Setup)
1. Clone this repository.
2. Open the terminal, `cd uniflow-web`, and run `npm install`.
3. Duplicate the `.env.example` file, rename the copy to `.env.local`, and paste the Supabase keys from our group chat.
4. Create your branch: `git checkout -b feature/your-feature-name`
5. Start the server: `npm run dev` (runs on http://localhost:5174)





# UniFlow Monorepo

Feature-silo monorepo for the UniFlow university project. Do not cross-import between route groups; use `components/shared` and `lib` only for shared code.

## Full file structure

```
uniflow-monorepo/
├── .env.example
├── .cursorrules
├── .cursorignore          ← Create manually if missing (see below)
├── .gitignore
├── README.md
│
├── uniflow-web/                    # Next.js 14 App Router
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/                 # Member 4
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── profile-setup/page.tsx
│   │   ├── pulse/[username]/       # Member 4
│   │   │   └── page.tsx
│   │   ├── (networking)/           # Members 2 & 3
│   │   │   ├── mentors/page.tsx
│   │   │   ├── alumni/page.tsx
│   │   │   └── actions.ts
│   │   └── (learning)/             # Bigun
│   │       ├── modules/page.tsx
│   │       ├── projects/page.tsx
│   │       └── actions.ts
│   ├── components/
│   │   ├── ui/                     # shadcn/ui only
│   │   │   └── .gitkeep
│   │   └── shared/
│   │       └── ChatWindow.tsx      # Shared: Members 2 & 3
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── auth.ts                 # ONLY Member 4
│   │   └── types.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── postcss.config.mjs
│   └── tailwind.config.ts
│
├── uniflow-python/                 # FastAPI microservice
│   ├── main.py
│   ├── requirements.txt
│   └── ai_models/
│       └── .gitkeep
│
└── uniflow-extension/              # Chrome Manifest V3
    ├── manifest.json
    └── background.js
```

## Run

- **Web:** `cd uniflow-web && npm install && npm run dev` (runs on http://localhost:5174)
- **Python:** 
`cd uniflow-python`
`python3 -m venv venv`
`source venv/bin/activate`
`pip install -r requirements.txt`