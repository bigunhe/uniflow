import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Rocket, Search } from 'lucide-react'
import { listMentorUsers } from '../lib/authStore'
import { getThreadSummaries } from '../lib/messagesStore'

export function Mentors() {
  const navigate = useNavigate()
  const location = useLocation()
  const ctx = location.state as
    | { specId?: string; specName?: string; roleTitle?: string }
    | undefined

  const mentors = listMentorUsers()
  const threadSummary = new Map(getThreadSummaries().map((s) => [s.mentorId, s]))

  function avatarGradient(seed: string) {
    const gradients = [
      'from-blue-500 to-indigo-600',
      'from-violet-500 to-purple-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-sky-500 to-cyan-600',
      'from-fuchsia-500 to-pink-600',
    ]
    let h = 0
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
    return gradients[h % gradients.length]
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5] text-white">
              <Rocket className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold text-gray-900">
              UniFlow
            </span>
          </div>
          <nav className="hidden flex-1 items-center justify-center gap-6 md:flex">
            <Link
              to="/specializations"
              className="text-sm font-medium text-gray-600 hover:text-[#4F46E5]"
            >
              Dashboard
            </Link>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-[#4F46E5]">
              Mentors
            </span>
            <span className="text-sm font-medium text-gray-400">Resources</span>
            <span className="text-sm font-medium text-gray-400">Community</span>
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search mentors..."
                className="w-52 rounded-full border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-xs outline-none ring-[#4F46E5] focus:ring-2"
              />
            </div>
            <button
              type="button"
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <span className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 ring-2 ring-white" />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Mentors
          </h1>
          {ctx?.roleTitle ? (
            <p className="mt-2 text-sm text-gray-600">
              Showing mentors aligned with{' '}
              <span className="font-semibold text-gray-800">
                {ctx.roleTitle}
              </span>
              {ctx.specName ? (
                <>
                  {' '}
                  · <span className="text-[#4F46E5]">{ctx.specName}</span>
                </>
              ) : null}
            </p>
          ) : ctx?.specName ? (
            <p className="mt-2 text-sm text-gray-600">
              Showing mentors for{' '}
              <span className="font-semibold text-[#4F46E5]">
                {ctx.specName}
              </span>
              {ctx.specId ? (
                <span className="text-gray-500"> ({ctx.specId})</span>
              ) : null}
            </p>
          ) : (
            <p className="mt-2 text-sm text-gray-600">
              Choose a mentor and open a conversation to keep the guidance
              going.
            </p>
          )}
        </div>

        {mentors.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {mentors.map((m) => {
              const summary = threadSummary.get(m.mentorId)
              const initials = m.fullName
                .split(' ')
                .map((p) => p[0])
                .join('')
              const subtitle =
                [m.jobTitle, m.company].filter(Boolean).join(' · ') || 'Mentor'
              const lastText =
                summary?.lastText ?? 'Open a chat to ask your questions.'
              return (
                <article
                  key={m.mentorId}
                  className="flex flex-col rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-lg font-bold text-white ${avatarGradient(
                        m.mentorId,
                      )}`}
                    >
                      {initials}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{m.fullName}</h2>
                      <p className="text-sm text-gray-500">{subtitle}</p>
                      <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                        {lastText}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex shrink-0 flex-col items-stretch gap-2 sm:mt-0 sm:ml-4 sm:items-end">
                    <button
                      type="button"
                      onClick={() => navigate(`/messages/${m.mentorId}`)}
                      className="rounded-full bg-[#4F46E5] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
                    >
                      Message
                    </button>
                    <span className="text-center text-xs text-gray-400 sm:text-right">
                      {summary ? 'Continue the conversation' : 'Start a conversation'}
                    </span>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">No mentors yet</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create a mentor account first, then mentors will show up here.
            </p>
            <Link
              to="/mentor-register?role=mentor"
              className="mt-6 inline-flex rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
            >
              Mentor sign up
            </Link>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-gray-500">
          Want a different pool?{' '}
          <Link
            to="/specializations"
            className="font-semibold text-[#4F46E5] hover:underline"
          >
            Change specialization
          </Link>{' '}
          or{' '}
          <Link
            to={ctx?.specId ? `/roles/${ctx.specId}` : '/roles/SE'}
            className="font-semibold text-[#4F46E5] hover:underline"
          >
            browse related roles
          </Link>
          .
        </p>
      </main>
    </div>
  )
}
