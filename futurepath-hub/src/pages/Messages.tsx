import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  Bell,
  MoreHorizontal,
  Paperclip,
  Rocket,
  Search,
  Send,
  Smile,
} from 'lucide-react'
import { getMentorById, MENTORS } from '../data/mentors'

export function Messages() {
  const { mentorId = '' } = useParams()
  const mentor = getMentorById(mentorId)

  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<
    { id: string; from: 'me' | 'them'; text: string; time: string }[]
  >([
    {
      id: '1',
      from: 'them',
      text: 'Hey! I saw your roadmap — want me to share a few AWS study resources?',
      time: '4:10 PM',
    },
    {
      id: '2',
      from: 'me',
      text: 'Yes please — especially around IAM and VPC basics.',
      time: '4:22 PM',
    },
    {
      id: '3',
      from: 'them',
      text: 'Attached a PDF with best-practice checklists. Skim the first 10 pages today.',
      time: '4:24 PM',
    },
  ])

  if (!mentor) {
    return <Navigate to="/mentors" replace />
  }

  const initials = mentor.name
    .split(' ')
    .map((p) => p[0])
    .join('')

  const canSend = draft.trim().length > 0

  function send() {
    if (!canSend) return
    const now = new Date()
    const time = now.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })
    setMessages((prev) => [
      ...prev,
      {
        id: `${Date.now()}`,
        from: 'me',
        text: draft.trim(),
        time,
      },
    ])
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
              to="/specializations"
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
            {MENTORS.map((m) => {
              const isActive = m.id === mentorId
              return (
                <li key={m.id}>
                  <Link
                    to={`/messages/${m.id}`}
                    className={`flex gap-3 rounded-xl p-3 transition ${
                      isActive
                        ? 'bg-indigo-50 ring-2 ring-[#4F46E5]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="relative">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white ${m.avatarGradient}`}
                      >
                        {m.name
                          .split(' ')
                          .map((p) => p[0])
                          .join('')}
                      </div>
                      {m.online ? (
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {m.name}{' '}
                          <span className="font-normal text-gray-500">
                            | {m.title}
                          </span>
                        </p>
                        <span className="shrink-0 text-[10px] text-gray-400">
                          {m.timeLabel}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                        {m.lastMessage}
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
                  {mentor.name}
                </h3>
                <span className="text-sm text-gray-500">· {mentor.title}</span>
              </div>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                {mentor.online ? 'Online' : 'Away'}
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

            {messages.map((msg) =>
              msg.from === 'them' ? (
                <div key={msg.id} className="flex gap-3">
                  <div
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ${mentor.avatarGradient}`}
                  >
                    {initials}
                  </div>
                  <div className="max-w-[75%]">
                    <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-4 py-3 text-sm text-gray-800">
                      {msg.text}
                    </div>
                    {msg.id === '3' ? (
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-xs font-bold text-red-600 shadow-sm">
                            PDF
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              AWS_Best_Practices_2024.pdf
                            </p>
                            <p className="text-xs text-gray-500">
                              2.4 MB · PDF Document
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="text-[#4F46E5] hover:underline"
                        >
                          Download
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[75%]">
                    <div className="rounded-2xl rounded-tr-sm bg-[#4F46E5] px-4 py-3 text-sm text-white">
                      {msg.text}
                    </div>
                    <div className="mt-1 flex items-center justify-end gap-2 text-[10px] text-gray-400">
                      <span>{msg.time}</span>
                      <span className="text-sky-300">✓✓</span>
                    </div>
                  </div>
                </div>
              ),
            )}
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
                placeholder={`Write a message to ${mentor.name.split(' ')[0]}...`}
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
