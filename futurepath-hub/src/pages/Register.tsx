import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  IdCard,
  Lock,
  Mail,
  Rocket,
  ShieldCheck,
  User,
  UserCog,
} from 'lucide-react'
import { Logo } from '../components/Logo'

type RoleChoice = 'student' | 'mentor'

export function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState<RoleChoice>('student')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [yearSem, setYearSem] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agreed, setAgreed] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (role === 'mentor') {
      navigate('/mentor-register', { state: { role: 'mentor' as const } })
      return
    }
    navigate('/specializations', { replace: false })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F5] via-violet-50/40 to-indigo-50/30">
      <header className="border-b border-gray-200/80 bg-white">
        <div className="relative mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo to="/" />
            <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 md:flex">
              <Link
                to="/"
                className="text-sm font-medium text-gray-600 transition hover:text-[#4F46E5]"
              >
                Home
              </Link>
              <Link
                to="/mentors"
                className="text-sm font-medium text-gray-600 transition hover:text-[#4F46E5]"
              >
                Mentors
              </Link>
              <Link
                to="/specializations"
                className="text-sm font-medium text-gray-600 transition hover:text-[#4F46E5]"
              >
                About
              </Link>
            </nav>
            <Link
              to="/register"
              className="rounded-full bg-[#EEF2FF] px-5 py-2 text-sm font-semibold text-[#4F46E5] transition hover:bg-indigo-100"
            >
              Register
            </Link>
          </div>
          <nav className="mt-4 flex justify-center gap-8 border-t border-gray-100 pt-4 md:hidden">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 transition hover:text-[#4F46E5]"
            >
              Home
            </Link>
            <Link
              to="/mentors"
              className="text-sm font-medium text-gray-600 transition hover:text-[#4F46E5]"
            >
              Mentors
            </Link>
            <Link
              to="/specializations"
              className="text-sm font-medium text-gray-600 transition hover:text-[#4F46E5]"
            >
              About
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)] ring-1 ring-gray-100/80 md:flex md:min-h-[560px]">
          {/* Left — indigo marketing panel */}
          <div className="flex w-full flex-col justify-between bg-[#4F46E5] p-8 text-white md:w-[42%] md:rounded-l-2xl md:p-10">
            <div>
              <h1 className="text-2xl font-bold leading-tight tracking-tight md:text-[1.75rem]">
                Start your IT journey today.
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-indigo-100">
                Join over 10,000+ students and mentors in the most advanced IT
                career guidance ecosystem.
              </p>
            </div>
            <ul className="mt-10 space-y-4 text-sm font-medium md:mt-0">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="pt-0.5">Industry Certified Mentors</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
                  <Rocket className="h-4 w-4" strokeWidth={2} />
                </span>
                <span className="pt-0.5">Personalized Career Roadmaps</span>
              </li>
            </ul>
          </div>

          {/* Right — student registration form */}
          <div className="flex flex-1 flex-col justify-center border-t border-gray-100 bg-white p-8 md:border-t-0 md:border-l md:border-gray-100 md:p-10">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
              Student Register Here
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Fill in your details to get started with UniFlow.
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
                <User className="h-4 w-4" strokeWidth={2} />
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
                <UserCog className="h-4 w-4" strokeWidth={2} />
                Mentor
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div className="relative">
                <IdCard className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={role === 'mentor'}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#4F46E5] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 disabled:cursor-not-allowed disabled:opacity-50"
                  required={role === 'student'}
                />
              </div>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@university.edu"
                  autoComplete="email"
                  disabled={role === 'mentor'}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#4F46E5] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 disabled:cursor-not-allowed disabled:opacity-50"
                  required={role === 'student'}
                />
              </div>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                <select
                  value={yearSem}
                  onChange={(e) => setYearSem(e.target.value)}
                  disabled={role === 'mentor'}
                  className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-10 text-sm text-gray-900 outline-none transition focus:border-[#4F46E5] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 disabled:cursor-not-allowed disabled:opacity-50"
                  required={role === 'student'}
                >
                  <option value="">Select year and semester</option>
                  <option value="y1s1">Year 1 — Semester 1</option>
                  <option value="y1s2">Year 1 — Semester 2</option>
                  <option value="y2s1">Year 2 — Semester 1</option>
                  <option value="y2s2">Year 2 — Semester 2</option>
                  <option value="y3s1">Year 3 — Semester 1</option>
                  <option value="y3s2">Year 3 — Semester 2</option>
                  <option value="y4s1">Year 4 — Semester 1</option>
                  <option value="y4s2">Year 4 — Semester 2</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={role === 'mentor'}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#4F46E5] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 disabled:cursor-not-allowed disabled:opacity-50"
                    required={role === 'student'}
                  />
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    disabled={role === 'mentor'}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#4F46E5] focus:bg-white focus:ring-2 focus:ring-[#4F46E5]/20 disabled:cursor-not-allowed disabled:opacity-50"
                    required={role === 'student'}
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  disabled={role === 'mentor'}
                  className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition disabled:opacity-50 ${
                    agreed
                      ? 'border-[#4F46E5] bg-[#4F46E5] text-white'
                      : 'border-gray-300 bg-white'
                  }`}
                  aria-pressed={agreed}
                >
                  {agreed ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
                </button>
                <span className="leading-snug">
                  I agree to the{' '}
                  <a href="#" className="font-semibold text-[#4F46E5] hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-semibold text-[#4F46E5] hover:underline">
                    Privacy Policy
                  </a>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={role === 'student' && !agreed}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#4F46E5] to-[#7c3aed] py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {role === 'mentor' ? (
                  <>
                    Continue as Mentor
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </>
                ) : (
                  <>
                    Register Now
                    <ArrowRight className="h-4 w-4" strokeWidth={2} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already registered?{' '}
              <Link
                to="/specializations"
                className="font-semibold text-[#4F46E5] hover:underline"
              >
                Continue
              </Link>
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-gray-500">
          © 2024 UniFlow. All rights reserved. Built for the next generation of IT
          professionals.
        </p>
      </main>
    </div>
  )
}
