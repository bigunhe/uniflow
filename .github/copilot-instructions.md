# UniFlow Copilot Instructions

## Purpose
Provide Copilot/AI tools with focused, safe guidance for working in UniFlow monorepo.

## Project overview
- **UniFlow** is a feature-silo monorepo with strictly separated route groups.
- No cross-contamination between silos unless code is explicitly shared in `components/shared/` or `lib/`.
- Three sub-projects:
  - `uniflow-web/` (Next.js, primary app)
  - `uniflow-python/` (FastAPI microservice)
  - `uniflow-extension/` (Chrome extension)

## Key conventions (source: README.md + .cursorrules)
- Stay in your assigned folder. Don’t import from another route group.
- Shared helpers belong in `components/shared/` or `lib/` only.
- Auth calls must go through `uniflow-web/lib/auth.ts` and `getCurrentUser()`.
- Do not edit `package.json`, `layout.tsx`, or DB schema without team consensus.

## Ownership (as documented in README)
- **Member 4 (Bewan)**: `(auth)/`, `pulse/`, `lib/auth.ts`
- **Members 2/3 (Shyni/Ridmi)**: `(networking)/mentors`, `(networking)/alumni`
- **Member 1 (Bigun)**: `(learning)/modules`, `(learning)/projects`, `uniflow-python`, `uniflow-extension`

## Setup & run commands
### uniflow-web
- `cd uniflow-web && npm install && npm run dev`
- `npm run build`, `npm run lint`

### uniflow-python
- `cd uniflow-python`
- `python3 -m venv venv`
- `source venv/bin/activate`
- `pip install -r requirements.txt`
- `uvicorn main:app --reload`

### uniflow-extension
- No build toolchain; load unpacked extension in Chrome using `manifest.json`.

## Docs links (do not duplicate)
- `README.md`
- `docs/AUTH-MEMBER4-PLAN.md`
- `docs/NETWORKING-CRUD-STEPS.md`

## Pull request workflow
- Always branch from main: `git checkout -b feature/<name>`.
- Keep PR scope small and within one feature silo.
- Use text in PR title and description that mentions affected silo(s) and intended behavior.

## Quality & style
- Keep code modular and small in each route group.
- Use explicit Typescript types in frontend code.
- Follow existing Next.js App Router patterns for pages and actions.
- Add/adjust tests with new behavior, when applicable (UI routes, API endpoints, business logic).

## When in doubt
1. Prefer implementation in current silo over cross-folder share.
2. If a helper must be shared, propose `components/shared/` or `lib/` and document ownership.
3. Raise dependency/breaking change flags in the team channel before touching global config files.
