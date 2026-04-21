import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Check, Lock, Mail, User, UserCog } from 'lucide-react'
import { Logo } from '../components/Logo'
import { getCurrentUser, login, type UserRole } from '../lib/authStore'
import { setCurrentMentorId } from '../lib/messagesStore'

export function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [error, setError] = useState<string | null>(null)

  const initialRole = useMemo<UserRole>(() => {
    const r = searchParams.get('role')
    return r === 'mentor' ? 'mentor' : 'student'
  }, [searchParams])

  useEffect(() => {
    setRole(initialRole)
  }, [initialRole])

  useEffect(() => {
    const u = getCurrentUser()
    if (!u) return
    if (u.role === 'mentor') {
      if (u.mentorId) setCurrentMentorId(u.mentorId)
      navigate('/mentor-dashboard', { replace: true })
      return
    }
    navigate('/specializations', { replace: true })
  }, [navigate])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    const res = login(role, email.trim(), password)
    if (!res.ok) {
      setError(res.error)
      return
    }
    if (res.user.role === 'mentor') {
      if (res.user.mentorId) setCurrentMentorId(res.user.mentorId)
      navigate('/mentor-dashboard', { replace: true })
      return
    }
    navigate('/specializations', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Logo to="/" />
          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 hover:text-[#4F46E5]"
            >
              Home
            </Link>
            <Link
              to="/mentors"
              className="text-sm font-medium text-gray-600 hover:text-[#4F46E5]"
            >
              Mentors
            </Link>
            <Link
              to="/specializations"
              className="text-sm font-medium text-gray-600 hover:text-[#4F46E5]"
            >
              Specializations
            </Link>
          </nav>
          <Link
            to="/mentor-register?role=mentor"
            className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-[#4F46E5] hover:bg-indigo-100"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col px-4 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 ring-1 ring-gray-100">
          <h1 className="text-center text-2xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">
            Sign in as a student or mentor
          </p>

          <div className="mt-6 flex rounded-full bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition ${
                role === 'student'
                  ? 'bg-white text-[#4F46E5] shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <User className="h-4 w-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('mentor')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition ${
                role === 'mentor'
                  ? 'bg-white text-[#4F46E5] shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              <UserCog className="h-4 w-4" />
              Mentor
            </button>
          </div>

          {error ? (
            <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-600">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#4F46E5] py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-600"
            >
              Sign In
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link
              to={`/mentor-register?role=${role}`}
              className="font-semibold text-[#4F46E5] hover:underline"
            >
              Sign up
            </Link>
          </p>

          <p className="mt-3 text-center text-xs text-gray-500">
            After you register, come back here and login using the same email and
            password.
          </p>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#4F46E5] shadow-sm">
                <Check className="h-3.5 w-3.5" />
              </span>
              <p>
                This is a local demo login (saved in your browser). Hook this up
                to a real database/Supabase later.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
