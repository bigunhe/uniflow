import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Bell,
  MoreHorizontal,
  Paperclip,
  Rocket,
  Search,
  Send,
  Smile,
} from 'lucide-react'
import { getMentorUserByMentorId, listMentorUsers } from '../lib/authStore'
import {
  appendMessage,
  getThreadSummaries,
  listMessagesForMentor,
  markMentorThreadRead,
} from '../lib/messagesStore'

export function Messages() {
  const { mentorId = '' } = useParams()
  const [searchParams] = useSearchParams()
  const mentor = getMentorUserByMentorId(mentorId)
  const mentorUsers = listMentorUsers()

  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState(() => listMessagesForMentor(mentorId))

  if (!mentor) {
    return <Navigate to="/mentors" replace />
  }

  const isMentorView = searchParams.get('as') === 'mentor'

  useEffect(() => {
    setMessages(listMessagesForMentor(mentorId))
    if (isMentorView) markMentorThreadRead(mentorId)
  }, [mentorId, isMentorView])

  const summaries = useMemo(() => {
    const map = new Map(getThreadSummaries().map((s) => [s.mentorId, s]))
    return map
  }, [messages.length])

  const initials = mentor.fullName
    .split(' ')
    .map((p) => p[0])
    .join('')

  const canSend = draft.trim().length > 0

  function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }

  function send() {
    if (!canSend) return
    appendMessage({
      mentorId,
      from: isMentorView ? 'mentor' : 'student',
      text: draft.trim(),
    })
    setMessages(listMessagesForMentor(mentorId))
    setDraft('')
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
              to={isMentorView ? '/mentor-dashboard' : '/specializations'}
              className="text-sm font-medium text-gray-600 hover:text-[#4F46E5]"
            >
              Dashboard
            </Link>
            <Link
              to="/mentors"
              className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-[#4F46E5]"
            >
              Mentors
            </Link>
            <span className="text-sm font-medium text-gray-400">Resources</span>
            <span className="text-sm font-medium text-gray-400">Community</span>
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search resources..."
                className="w-56 rounded-full border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-xs outline-none ring-[#4F46E5] focus:ring-2"
              />
            </div>
            <button
              type="button"
              className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>
            <span className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 ring-2 ring-white" />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-6 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Messages</h2>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              placeholder="Search mentors..."
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
            />
          </div>
          <ul className="mt-4 space-y-2">
            {mentorUsers.map((m) => {
              const isActive = m.mentorId === mentorId
              const summary = summaries.get(m.mentorId)
              const lastLabel = summary ? formatTime(summary.lastAt) : ''
              const lastText = summary ? summary.lastText : 'Open a conversation'
              const unread = isMentorView ? summary?.unreadForMentor ?? 0 : 0
              const initials2 = m.fullName
                .split(' ')
                .map((p) => p[0])
                .join('')
              return (
                <li key={m.mentorId}>
                  <Link
                    to={`/messages/${m.mentorId}${isMentorView ? '?as=mentor' : ''}`}
                    className={`flex gap-3 rounded-xl p-3 transition ${
                      isActive
                        ? 'bg-indigo-50 ring-2 ring-[#4F46E5]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white"
                      >
                        {initials2}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {m.fullName}{' '}
                          <span className="font-normal text-gray-500">
                            | {m.jobTitle ?? 'Mentor'}
                          </span>
                        </p>
                        <div className="flex shrink-0 items-center gap-2">
                          {unread ? (
                            <span className="rounded-full bg-[#4F46E5] px-2 py-0.5 text-[10px] font-bold text-white">
                              {unread}
                            </span>
                          ) : null}
                          {lastLabel ? (
                            <span className="text-[10px] text-gray-400">{lastLabel}</span>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                        {lastText}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </aside>

        <section className="flex min-h-[560px] flex-col rounded-2xl bg-white shadow-md ring-1 ring-gray-100">
          <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {mentor.fullName}
                </h3>
                <span className="text-sm text-gray-500">
                  · {mentor.jobTitle ?? 'Mentor'}
                </span>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                Active
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-full border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                View Profile
              </button>
              <button
                type="button"
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="More"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
            <div className="text-center text-xs font-semibold tracking-widest text-gray-400">
              YESTERDAY
            </div>
            <div className="text-center text-xs font-semibold tracking-widest text-gray-400">
              TODAY
            </div>

            {messages.map((msg) => {
              const isMe = msg.from === (isMentorView ? 'mentor' : 'student')
              return !isMe ? (
                <div key={msg.id} className="flex gap-3">
                  <div
                    className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[10px] font-bold text-white"
                  >
                    {initials}
                  </div>
                  <div className="max-w-[75%]">
                    <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 text-sm text-gray-800">
                      {msg.text}
                    </div>
                    <div className="mt-1 text-[10px] text-gray-400">{formatTime(msg.createdAt)}</div>
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[75%]">
                    <div className="rounded-2xl rounded-tr-sm bg-[#4F46E5] px-4 py-3 text-sm text-white">
                      {msg.text}
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-2 text-[10px] text-gray-400">
                      <span>{formatTime(msg.createdAt)}</span>
                      <span className="text-sky-300">✓✓</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="border-t border-gray-100 px-5 py-4">
            <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">
              <button
                type="button"
                className="rounded-full p-2 text-gray-500 hover:bg-white"
                aria-label="Attach"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="rounded-full p-2 text-gray-500 hover:bg-white"
                aria-label="Emoji"
              >
                <Smile className="h-5 w-5" />
              </button>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder={`Write a message ${isMentorView ? 'to student' : `to ${mentor.fullName.split(' ')[0]}`}...`}
                rows={2}
                className="max-h-40 min-h-[44px] flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={send}
                disabled={!canSend}
                className="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5] text-white shadow-sm hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[11px] text-gray-400">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
