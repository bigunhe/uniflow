# UniFlow Mentor AI Architecture

## Stack
- Frontend: Next.js App Router + TypeScript + Tailwind CSS + Lucide React
- Backend: Next.js Route Handlers (`app/api/*`) + shared services
- Database/Auth/Realtime: Supabase (Postgres + Auth + Realtime)
- AI: OpenAI Chat Completions API via `app/api/ai/chat`

## Folder Structure
- `app/`: Routes and API endpoints
- `components/shared/`: Reusable UI building blocks
- `lib/supabase/`: Browser and server Supabase clients
- `models/`: Domain entities and DTO contracts
- `services/`: Business logic and data access helpers
- `sockets/`: Realtime channel contracts
- `docs/SUPABASE-SCHEMA.sql`: Database schema and indexes

## Request to Session Workflow
1. Student creates request on `/student/request` or `/student/urgent`.
2. Request is saved in `guidance_requests`.
3. Mentor sees incoming request on `/mentor/requests` through realtime updates.
4. Mentor accepts request.
5. Session row is created in `sessions` and request updated with `session_id`.
6. Mentor is redirected to `/mentor/session/[id]`.
7. Student is auto-redirected to `/student/session/[id]` on realtime request update.
8. Chat messages are persisted in `messages` and synchronized via Supabase Realtime.
9. Session completion updates duration and request status to `completed`.

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (optional, defaults to `gpt-4o-mini`)
