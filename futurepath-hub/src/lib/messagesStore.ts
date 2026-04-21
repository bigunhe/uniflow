export type ChatRole = 'student' | 'mentor'

export type StoredMessage = {
  id: string
  mentorId: string
  from: ChatRole
  text: string
  createdAt: number
}

type ReadState = Record<string, number | undefined>

const MESSAGES_KEY = 'uniflow.messages.v1'
const READ_KEY = 'uniflow.messages.read.v1'
const CURRENT_MENTOR_KEY = 'uniflow.currentMentorId.v1'

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function readAllMessages(): StoredMessage[] {
  if (typeof window === 'undefined') return []
  const parsed = safeParseJson<StoredMessage[]>(window.localStorage.getItem(MESSAGES_KEY))
  if (!Array.isArray(parsed)) return []
  return parsed
    .filter(
      (m) =>
        m &&
        typeof m.id === 'string' &&
        typeof m.mentorId === 'string' &&
        (m.from === 'student' || m.from === 'mentor') &&
        typeof m.text === 'string' &&
        typeof m.createdAt === 'number',
    )
    .sort((a, b) => a.createdAt - b.createdAt)
}

function writeAllMessages(next: StoredMessage[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(next))
}

export function listMessagesForMentor(mentorId: string): StoredMessage[] {
  return readAllMessages().filter((m) => m.mentorId === mentorId)
}

export function appendMessage(input: Omit<StoredMessage, 'id' | 'createdAt'> & { id?: string; createdAt?: number }) {
  const next: StoredMessage = {
    id: input.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    mentorId: input.mentorId,
    from: input.from,
    text: input.text,
    createdAt: input.createdAt ?? Date.now(),
  }
  const all = readAllMessages()
  writeAllMessages([...all, next])
  return next
}

export function getReadState(): ReadState {
  if (typeof window === 'undefined') return {}
  const parsed = safeParseJson<ReadState>(window.localStorage.getItem(READ_KEY))
  return parsed && typeof parsed === 'object' ? parsed : {}
}

export function markMentorThreadRead(mentorId: string) {
  if (typeof window === 'undefined') return
  const last = listMessagesForMentor(mentorId).at(-1)?.createdAt ?? Date.now()
  const state = getReadState()
  state[mentorId] = last
  window.localStorage.setItem(READ_KEY, JSON.stringify(state))
}

export type ThreadSummary = {
  mentorId: string
  lastText: string
  lastAt: number
  unreadForMentor: number
  total: number
}

export function getThreadSummaries(): ThreadSummary[] {
  const all = readAllMessages()
  const readState = getReadState()

  const byMentor = new Map<string, StoredMessage[]>()
  for (const m of all) {
    const list = byMentor.get(m.mentorId) ?? []
    list.push(m)
    byMentor.set(m.mentorId, list)
  }

  const summaries: ThreadSummary[] = []
  for (const [mentorId, msgs] of byMentor.entries()) {
    msgs.sort((a, b) => a.createdAt - b.createdAt)
    const last = msgs.at(-1)
    if (!last) continue
    const lastReadAt = readState[mentorId] ?? 0
    const unreadForMentor = msgs.filter(
      (m) => m.from === 'student' && m.createdAt > lastReadAt,
    ).length
    summaries.push({
      mentorId,
      lastText: last.text,
      lastAt: last.createdAt,
      unreadForMentor,
      total: msgs.length,
    })
  }

  return summaries.sort((a, b) => b.lastAt - a.lastAt)
}

export function getCurrentMentorId(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(CURRENT_MENTOR_KEY)
}

export function setCurrentMentorId(mentorId: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(CURRENT_MENTOR_KEY, mentorId)
}

