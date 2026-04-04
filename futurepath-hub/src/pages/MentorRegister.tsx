import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  IdCard,
  Lock,
  Mail,
  RefreshCw,
  Rocket,
  Star,
  User,
  UserCog,
} from 'lucide-react'
import { Logo } from '../components/Logo'
import { SPECIALIZATIONS } from '../data/specializations'
import type { SpecId } from '../types'

type RoleTab = 'student' | 'mentor'

export function MentorRegister() {
  const navigate = useNavigate()
  const [roleTab, setRoleTab] = useState<RoleTab>('student')

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [yearSem, setYearSem] = useState('')
  const [agreedStudent, setAgreedStudent] = useState(false)

  const [company, setCompany] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [years, setYears] = useState('')
  const [expertise, setExpertise] = useState<SpecId | ''>('')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (roleTab === 'student') {
      if (!agreedStudent) return
      navigate('/login', { replace: false })
      return
    }
    navigate('/login', { replace: false })
  }

  const heading =
    roleTab === 'student' ? 'Student Registration' : 'Mentor Registration'
  const subheading =
    roleTab === 'student'
      ? 'Create your student account and start your journey with UniFlow.'
      : 'Tell us about your professional journey.'

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5F5] via-white to-[#FAFAFA]">
      <header className="border-b border-gray-200/80 bg-white/90 backdrop-blur">
        <div className="relative mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo to="/" />
            <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-10 md:flex">
              <a
                href="#mentor-hero"
                className="text-sm font-medium text-gray-600 transition hover:text-[#4F46E5]"
              >
                Expertise
              </a>
              <a
                href="#mentor-form"
                className="text-sm font-medium text-gray-600 transition hover:text-[#4F46E5]"
              >
                Process
              </a>
              <Link
                to="/mentors"
                className="text-sm font-medium text-gray-600 transition hover:text-[#4F46E5]"
              >
                Network
              </Link>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 transition hover:text-[#4F46E5]"
              >
                Support
              </Link>
            </nav>
            <Link
              to="/login"
              className="rounded-full bg-[#4F46E5] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600"
            >
              Sign In
            </Link>
          </div>
          <nav className="mt-4 flex justify-center gap-8 border-t border-gray-100 pt-4 md:hidden">
            <a href="#mentor-hero" className="text-sm font-medium text-gray-600">
              Expertise
            </a>
            <a href="#mentor-form" className="text-sm font-medium text-gray-600">
              Process
            </a>
            <Link to="/mentors" className="text-sm font-medium text-gray-600">
              Network
            </Link>
            <Link to="/login" className="text-sm font-medium text-gray-600">
              Support
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-10 lg:flex lg:items-stretch lg:gap-12 lg:py-14">
        <section
          id="mentor-hero"
          className="mb-10 flex flex-1 flex-col justify-center lg:mb-0 lg:max-w-xl lg:pr-4"
        >
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-200/80 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-violet-700 shadow-sm">
            <Rocket className="h-3.5 w-3.5" />
            Shape the future
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 md:text-5xl">
            Empower Aspiration. Ignite{' '}
            <span className="bg-gradient-to-r from-[#6366f1] via-[#4F46E5] to-[#9333EA] bg-clip-text text-transparent">
              Impact
            </span>
            .
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">
            Join an elite network of industry leaders. Share your journey, guide
            the next generation, and leave a lasting professional legacy.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100">
              <p className="text-4xl font-bold text-[#4F46E5]">500+</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Active mentors
              </p>
            </div>
            <div className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100">
              <p className="text-4xl font-bold text-[#4F46E5]">12k</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Lives impacted
              </p>
            </div>
          </div>
        </section>

        <section id="mentor-form" className="flex flex-1 items-start justify-center lg:min-w-0">
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.12)] ring-1 ring-gray-100 sm:p-8 md:p-10">
            <h2 className="text-xl font-bold text-gray-900 md:text-2xl">{heading}</h2>
            <p className="mt-1 text-sm text-gray-500">{subheading}</p>

            {roleTab === 'mentor' ? (
              <p className="mt-2 text-sm text-gray-600">
                <Link
                  to="/register"
                  className="font-semibold text-[#4F46E5] hover:underline"
                >
                  Student register here
                </Link>
              </p>
            ) : (
              <p className="mt-2 text-sm text-gray-600">
                Want to mentor instead?{' '}
                <button
                  type="button"
                  onClick={() => setRoleTab('mentor')}
                  className="font-semibold text-[#4F46E5] hover:underline"
                >
                  Switch to Mentor
                </button>
              </p>
            )}

            <div className="mt-6 flex rounded-full bg-gray-100 p-1">
              <button
                type="button"
                onClick={() => setRoleTab('student')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition ${
                  roleTab === 'student'
                    ? 'bg-white text-[#4F46E5] shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                <User className="h-4 w-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setRoleTab('mentor')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition ${
                  roleTab === 'mentor'
                    ? 'bg-white text-[#4F46E5] shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                <UserCog className="h-4 w-4" />
                Mentor
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {roleTab === 'student' ? (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Full Name
                      </label>
                      <div className="relative">
                        <IdCard className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                        <input
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="John Doe"
                          autoComplete="name"
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          autoComplete="email"
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Year and Semester
                    </label>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                      <select
                        value={yearSem}
                        onChange={(e) => setYearSem(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-800 outline-none ring-[#4F46E5] focus:ring-2"
                        required
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
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-gray-600">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                        <input
                          type="password"
                          value={confirm}
                          onChange={(e) => setConfirm(e.target.value)}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-600">
                    <button
                      type="button"
                      onClick={() => setAgreedStudent(!agreedStudent)}
                      className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition ${
                        agreedStudent
                          ? 'border-[#4F46E5] bg-[#4F46E5] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                      aria-pressed={agreedStudent}
                    >
                      {agreedStudent ? (
                        <Check className="h-3 w-3" strokeWidth={3} />
                      ) : null}
                    </button>
                    <span className="leading-snug">
                      I agree to the{' '}
                      <a
                        href="#"
                        className="font-semibold text-[#4F46E5] hover:underline"
                      >
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a
                        href="#"
                        className="font-semibold text-[#4F46E5] hover:underline"
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                </>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Company/Organization
                    </label>
                    <div className="relative">
                      <Building2 className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                      <input
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="FutureTech Inc."
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Job Title
                    </label>
                    <div className="relative">
                      <IdCard className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                      <input
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Senior Product Lead"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Years of Experience
                    </label>
                    <div className="relative">
                      <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                      <input
                        inputMode="numeric"
                        value={years}
                        onChange={(e) =>
                          setYears(e.target.value.replace(/\D/g, ''))
                        }
                        placeholder="8"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Primary Area of Expertise
                    </label>
                    <div className="relative">
                      <Star className="pointer-events-none absolute left-3 top-1/2 z-10 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                      <select
                        value={expertise}
                        onChange={(e) => setExpertise(e.target.value as SpecId)}
                        className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-800 outline-none ring-[#4F46E5] focus:ring-2"
                        required
                      >
                        <option value="">Select Specialty</option>
                        {SPECIALIZATIONS.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.shortLabel} — {s.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-gray-600">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <RefreshCw className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={roleTab === 'student' && !agreedStudent}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] via-[#4F46E5] to-[#9333EA] py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {roleTab === 'mentor' ? 'Become a Mentor' : 'Continue as Student'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-center text-[11px] leading-relaxed text-gray-500">
                {roleTab === 'student' ? (
                  <>
                    By joining, you agree to our{' '}
                    <a
                      href="#"
                      className="font-medium text-[#4F46E5] hover:underline"
                    >
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                      href="#"
                      className="font-medium text-[#4F46E5] hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </>
                ) : (
                  <>
                    By joining, you agree to our{' '}
                    <a
                      href="#"
                      className="font-medium text-[#4F46E5] hover:underline"
                    >
                      Mentor Guidelines
                    </a>{' '}
                    and{' '}
                    <a
                      href="#"
                      className="font-medium text-[#4F46E5] hover:underline"
                    >
                      Terms of Service
                    </a>
                    .
                  </>
                )}
              </p>
            </form>
          </div>
        </section>
      </div>

      <footer className="border-t border-gray-200 bg-white/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo to="/" />
            <p className="mt-3 text-xs text-gray-500">
              © 2024 UniFlow. Empowering the next generation of industry leaders.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-600">
            <a href="#" className="hover:text-[#4F46E5]">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#4F46E5]">
              Terms of Service
            </a>
            <a
              href="#"
              className="font-semibold text-[#4F46E5] underline underline-offset-2"
            >
              Mentor Guidelines
            </a>
            <Link to="/login" className="hover:text-[#4F46E5]">
              Help Center
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
