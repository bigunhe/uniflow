import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import { PageFooter } from '../components/PageFooter'
import { SPECIALIZATIONS } from '../data/specializations'
import type { SpecId } from '../types'

export function Specializations() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<SpecId>('SE')

  function confirm() {
    navigate(`/roles/${selected}`)
  }

  function explore() {
    navigate(`/roles/${selected}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5]">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
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
              to="/register"
              className="text-sm font-medium text-gray-600 hover:text-[#4F46E5]"
            >
              Resources
            </Link>
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-[#4F46E5]"
            >
              Profile
            </Link>
          </nav>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-full bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600"
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:py-14">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
            Shape Your Future:{' '}
            <span className="text-[#4F46E5]">Choose a Specialization</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Select the track that best matches your strengths. You can explore
            job roles next and connect with mentors who have walked the path.
          </p>
        </div>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
          role="tablist"
          aria-label="Specialization abbreviations"
        >
          {SPECIALIZATIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={selected === s.id}
              onClick={() => setSelected(s.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selected === s.id
                  ? 'bg-[#4F46E5] text-white shadow-md'
                  : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:ring-[#4F46E5]'
              }`}
            >
              {s.shortLabel}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIALIZATIONS.map((s) => {
            const Icon = s.Icon
            const isSel = selected === s.id
            return (
              <button
                key={s.id}
                type="button"
                aria-label={`View job roles for ${s.title}`}
                onClick={() => {
                  setSelected(s.id)
                  navigate(`/roles/${s.id}`)
                }}
                className={`group flex w-full flex-col rounded-2xl bg-white p-5 text-left shadow-md ring-2 transition hover:-translate-y-0.5 hover:shadow-lg ${
                  isSel ? 'ring-[#4F46E5]' : 'ring-gray-100'
                }`}
              >
                <span
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-[#4F46E5] transition group-hover:bg-[#4F46E5] group-hover:text-white`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {s.shortLabel}
                </span>
                <span className="mt-1 font-semibold text-gray-900">
                  {s.title}
                </span>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {s.description}
                </p>
              </button>
            )
          })}
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={confirm}
            className="w-full rounded-2xl bg-[#4F46E5] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-600 sm:w-auto"
          >
            Confirm Selection
          </button>
          <button
            type="button"
            onClick={explore}
            className="w-full rounded-2xl border-2 border-[#4F46E5] bg-white px-8 py-3 text-sm font-semibold text-[#4F46E5] transition hover:bg-indigo-50 sm:w-auto"
          >
            Explore Paths First
          </button>
        </div>
      </main>

      <PageFooter />
    </div>
  )
}
