import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ChevronDown, Filter, MessageCircle, Search } from 'lucide-react'
import { Logo } from '../components/Logo'
import { ExperienceBadge } from '../components/ExperienceBadge'
import { JOB_ROLES_BY_SPEC } from '../data/jobRoles'
import { JOB_ROLES_SUBTITLE } from '../data/jobRolePageCopy'
import { SPEC_NAME_BY_ID } from '../data/specializations'
import { isSpecId } from '../types'

export function JobRoles() {
  const { specId = '' } = useParams()
  const navigate = useNavigate()
  const [sortLabel] = useState('Popular')

  const spec = isSpecId(specId) ? specId : null
  const roles = spec ? JOB_ROLES_BY_SPEC[spec] : []

  const specName = spec ? SPEC_NAME_BY_ID[spec] : 'Specialization'

  const subtitle = useMemo(() => {
    if (!spec) return ''
    return JOB_ROLES_SUBTITLE[spec]
  }, [spec])

  if (!spec) {
    return <Navigate to="/specializations" replace />
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <Logo to="/" />
          <nav className="hidden flex-1 flex-wrap items-center justify-center gap-6 lg:flex">
            <Link
              to="/specializations"
              className="text-sm font-semibold text-[#4F46E5] underline decoration-2 underline-offset-4"
            >
              Specializations
            </Link>
            <Link
              to="/mentors"
              className="text-sm font-medium text-gray-600 hover:text-[#4F46E5]"
            >
              Mentors
            </Link>
            <span className="text-sm font-medium text-gray-400">Roadmaps</span>
            <span className="text-sm font-medium text-gray-400">Community</span>
          </nav>
          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none lg:flex-1">
            <div className="relative hidden min-w-[200px] sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                placeholder="Search roles..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none ring-[#4F46E5] focus:ring-2"
              />
            </div>
            <Link
              to="/login"
              className="rounded-full bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
            >
              Sign In
            </Link>
            <span className="hidden h-9 w-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 ring-2 ring-white sm:inline-block" />
          </div>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:py-10">
        <nav className="text-sm text-gray-500">
          <Link to="/specializations" className="hover:text-[#4F46E5]">
            Specializations
          </Link>
          <span className="mx-2">›</span>
          <span className="font-medium text-gray-800">{specName}</span>
        </nav>

        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              {specName} Roles
            </h1>
            <p className="mt-3 text-gray-600">{subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm"
            >
              Sort: {sortLabel}
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {roles.map((role) => {
            const Icon = role.Icon
            return (
              <article
                key={role.title}
                className="group flex flex-col rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${role.iconWrapClass}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="font-semibold text-gray-900">{role.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                  {role.description}
                </p>
                <div className="mt-4 flex items-end justify-between gap-2">
                  <ExperienceBadge level={role.level} />
                  <button
                    type="button"
                    onClick={() =>
                      navigate('/mentors', {
                        state: {
                          specId: spec,
                          specName,
                          roleTitle: role.title,
                        },
                      })
                    }
                    className="text-sm font-semibold text-[#4F46E5] hover:underline"
                  >
                    View Mentors →
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <section className="mt-16 rounded-2xl bg-white p-8 text-center shadow-md ring-1 ring-gray-100">
          <p className="font-medium text-gray-800">
            Didn&apos;t find what you were looking for?
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              className="w-full rounded-full bg-[#4F46E5] px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-600 sm:w-auto"
            >
              Request New Role
            </button>
            <button
              type="button"
              onClick={() => navigate('/specializations')}
              className="w-full rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 hover:border-[#4F46E5] hover:text-[#4F46E5] sm:w-auto"
            >
              Explore Other Specializations
            </button>
          </div>
        </section>
      </main>

      <button
        type="button"
        onClick={() => navigate('/mentors')}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#4F46E5] text-white shadow-lg hover:bg-indigo-600"
        aria-label="Open messages"
      >
        <MessageCircle className="h-7 w-7" />
      </button>
    </div>
  )
}
