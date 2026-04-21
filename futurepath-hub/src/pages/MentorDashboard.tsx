import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Settings, User, Users } from 'lucide-react'
import { Logo } from '../components/Logo'
import {
  getThreadSummaries,
} from '../lib/messagesStore'
import { getCurrentUser, logout } from '../lib/authStore'

export function MentorDashboard() {
  const navigate = useNavigate()
  const me = getCurrentUser()
  const currentMentorId = me?.role === 'mentor' ? me.mentorId : null
  const currentMentorName = me?.role === 'mentor' ? me.fullName : 'Mentor'

  if (!currentMentorId) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
            <Logo to="/" />
            <Link
              to="/login?role=mentor"
              className="rounded-full bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
            >
              Mentor login
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please login</h1>
          <p className="mt-2 text-gray-600">
            You need to login as a mentor to view the mentor dashboard.
          </p>
        </main>
      </div>
    )
  }

  const summaries = getThreadSummaries()
  const mySummary = summaries.find((s) => s.mentorId === currentMentorId)
  const unread = mySummary?.unreadForMentor ?? 0
  const total = mySummary?.total ?? 0
  const conversations = summaries.filter((s) => s.mentorId === currentMentorId).length

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Logo to="/" />
          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <Link
              to="/mentor-dashboard"
              className="text-sm font-semibold text-[#4F46E5] underline decoration-2 underline-offset-4"
            >
              Dashboard
            </Link>
            <Link
              to={`/messages/${currentMentorId}?as=mentor`}
              className="text-sm font-medium text-gray-600 hover:text-[#4F46E5]"
            >
              Messages
            </Link>
            <Link
              to="/mentors"
              className="text-sm font-medium text-gray-600 hover:text-[#4F46E5]"
            >
              Mentors
            </Link>
            <span className="text-sm font-medium text-gray-400">Sessions</span>
          </nav>
          <button
            type="button"
            onClick={() => {
              logout()
              navigate('/', { replace: true })
            }}
            className="rounded-full bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Mentor workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Mentor Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              View your inbox and reply to student messages.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm">
                {currentMentorName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/mentor-register?role=mentor')}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm hover:border-[#4F46E5] hover:text-[#4F46E5]"
            >
              <Settings className="h-4 w-4" />
              Edit profile
            </button>
          </div>
        </div>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Unread messages</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">{unread}</p>
                <p className="mt-2 text-sm text-gray-500">New messages from students</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                <MessageCircle className="h-6 w-6" />
              </span>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversations</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">{conversations}</p>
                <p className="mt-2 text-sm text-gray-500">Total active threads</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                <Users className="h-6 w-6" />
              </span>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages in thread</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">{total}</p>
                <p className="mt-2 text-sm text-gray-500">For {currentMentorName}</p>
              </div>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-[#4F46E5]">
                <MessageCircle className="h-6 w-6" />
              </span>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Quick actions</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => navigate(`/messages/${currentMentorId}?as=mentor`)}
                className="rounded-2xl bg-[#4F46E5] px-5 py-3 text-left text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
              >
                Open messages
                <p className="mt-1 text-xs font-medium text-indigo-100">
                  Reply to your mentees
                </p>
              </button>
              <button
                type="button"
                onClick={() => navigate('/mentors')}
                className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-left text-sm font-semibold text-gray-900 shadow-sm hover:border-[#4F46E5]"
              >
                Browse mentors
                <p className="mt-1 text-xs font-medium text-gray-500">
                  See who&apos;s active today
                </p>
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Inbox</h2>
            <p className="mt-1 text-sm text-gray-600">
              Select a conversation and reply to the student.
            </p>
            <div className="mt-5 space-y-2">
              {mySummary ? (
                <Link
                  to={`/messages/${currentMentorId}?as=mentor`}
                  className="flex items-start justify-between gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 transition hover:bg-gray-50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      Students
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-gray-600">
                      {mySummary.lastText}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    {mySummary.unreadForMentor ? (
                      <span className="rounded-full bg-[#4F46E5] px-2 py-0.5 text-[10px] font-bold text-white">
                        {mySummary.unreadForMentor}
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-gray-400">
                        Read
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">
                      {new Date(mySummary.lastAt).toLocaleTimeString([], {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
                  No messages yet. Ask a student to message you from the Mentors
                  page.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

