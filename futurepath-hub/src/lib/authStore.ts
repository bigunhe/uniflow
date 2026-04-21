export type UserRole = 'student' | 'mentor'

export type StoredUser = {
  id: string
  role: UserRole
  fullName: string
  email: string
  password: string
  createdAt: number
  yearSem?: string
  company?: string
  jobTitle?: string
  years?: string
  expertise?: string
  mentorId?: string
}

export type AuthSession = {
  userId: string
}

const USERS_KEY = 'uniflow.users.v1'
const SESSION_KEY = 'uniflow.session.v1'

function safeParseJson<T>(raw: string | null): T | null {
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function readUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  const parsed = safeParseJson<StoredUser[]>(window.localStorage.getItem(USERS_KEY))
  if (!Array.isArray(parsed)) return []
  return parsed.filter(
    (u) =>
      u &&
      typeof u.id === 'string' &&
      (u.role === 'student' || u.role === 'mentor') &&
      typeof u.fullName === 'string' &&
      typeof u.email === 'string' &&
      typeof u.password === 'string' &&
      typeof u.createdAt === 'number',
  )
}

function writeUsers(next: StoredUser[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(USERS_KEY, JSON.stringify(next))
}

function normEmail(email: string) {
  return email.trim().toLowerCase()
}

export function findUserByEmail(role: UserRole, email: string): StoredUser | null {
  const e = normEmail(email)
  return readUsers().find((u) => u.role === role && normEmail(u.email) === e) ?? null
}

export function registerUser(input: Omit<StoredUser, 'id' | 'createdAt'>) {
  const existing = findUserByEmail(input.role, input.email)
  if (existing) {
    return { ok: false as const, error: 'Account already exists. Please login.' }
  }
  const next: StoredUser = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    email: normEmail(input.email),
    createdAt: Date.now(),
  }
  const users = readUsers()
  writeUsers([...users, next])
  setSession({ userId: next.id })
  return { ok: true as const, user: next }
}

export function login(role: UserRole, email: string, password: string) {
  const user = findUserByEmail(role, email)
  if (!user || user.password !== password) {
    return { ok: false as const, error: 'Invalid email or password.' }
  }
  setSession({ userId: user.id })
  return { ok: true as const, user }
}

export function logout() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(SESSION_KEY)
}

export function getSession(): AuthSession | null {
  if (typeof window === 'undefined') return null
  const parsed = safeParseJson<AuthSession>(window.localStorage.getItem(SESSION_KEY))
  if (!parsed || typeof parsed.userId !== 'string') return null
  return parsed
}

export function setSession(session: AuthSession) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function getCurrentUser(): StoredUser | null {
  const session = getSession()
  if (!session) return null
  return readUsers().find((u) => u.id === session.userId) ?? null
}

export function listUsersByRole(role: UserRole): StoredUser[] {
  return readUsers()
    .filter((u) => u.role === role)
    .sort((a, b) => b.createdAt - a.createdAt)
}

export type MentorUser = StoredUser & { role: 'mentor'; mentorId: string }

export function listMentorUsers(): MentorUser[] {
  return listUsersByRole('mentor')
    .filter((u) => typeof u.mentorId === 'string' && u.mentorId.length > 0)
    .map((u) => u as MentorUser)
}

export function getMentorUserByMentorId(mentorId: string): MentorUser | null {
  return listMentorUsers().find((u) => u.mentorId === mentorId) ?? null
}

