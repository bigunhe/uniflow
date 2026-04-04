import { Link } from 'react-router-dom'
import { Logo } from '../components/Logo'

export function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Logo to="/" />
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Plan your IT career with{' '}
          <span className="text-[#4F46E5]">UniFlow</span>
        </h1>
        <p className="mx-auto mt-6 text-lg text-gray-600">
          Register, choose a specialization, explore job roles, connect with
          mentors, and message them — all in one guided flow.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="inline-flex rounded-2xl bg-[#4F46E5] px-8 py-3 text-base font-semibold text-white shadow-md transition hover:bg-indigo-600"
          >
            Create account
          </Link>
          <Link
            to="/specializations"
            className="inline-flex rounded-2xl border border-gray-300 bg-white px-8 py-3 text-base font-semibold text-gray-800 shadow-sm transition hover:border-[#4F46E5] hover:text-[#4F46E5]"
          >
            I already have access
          </Link>
        </div>
        <p className="mt-8 text-sm text-gray-500">
          New here? Start with{' '}
          <Link to="/login" className="font-medium text-[#4F46E5] hover:underline">
            Sign in
          </Link>{' '}
          or{' '}
          <Link to="/register" className="font-medium text-[#4F46E5] hover:underline">
            Register
          </Link>
          .
        </p>

        <nav
          className="mx-auto mt-14 max-w-xl rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm"
          aria-label="Full app flow"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Navigate the full flow
          </p>
          <ol className="mt-3 space-y-2 text-sm text-gray-700">
            <li>
              <Link className="text-[#4F46E5] hover:underline" to="/login">
                1. Login
              </Link>
            </li>
            <li>
              <Link className="text-[#4F46E5] hover:underline" to="/register">
                2. Register (student)
              </Link>
            </li>
            <li>
              <Link className="text-[#4F46E5] hover:underline" to="/mentor-register">
                2b. Mentor registration
              </Link>
            </li>
            <li>
              <Link className="text-[#4F46E5] hover:underline" to="/specializations">
                3. Choose specialization
              </Link>
            </li>
            <li>
              <Link className="text-[#4F46E5] hover:underline" to="/roles/SE">
                4. Job roles (example: Software Engineering)
              </Link>
            </li>
            <li>
              <Link className="text-[#4F46E5] hover:underline" to="/mentors">
                5. Select a mentor
              </Link>
            </li>
            <li>
              <Link
                className="text-[#4F46E5] hover:underline"
                to="/messages/alex-rivera"
              >
                6. Message a mentor
              </Link>
            </li>
          </ol>
        </nav>
      </main>
    </div>
  )
}
