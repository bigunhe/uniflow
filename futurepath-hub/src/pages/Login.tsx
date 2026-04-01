import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Lock, Mail } from 'lucide-react'
import { Logo } from '../components/Logo'

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
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
            to="/register"
            className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-[#4F46E5] hover:bg-indigo-100"
          >
            Register
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col px-4 py-16">
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-gray-200/50 ring-1 ring-gray-100">
          <h1 className="text-center text-2xl font-bold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-gray-500">
            Sign in to continue to UniFlow
          </p>
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
              to="/register"
              className="font-semibold text-[#4F46E5] hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
