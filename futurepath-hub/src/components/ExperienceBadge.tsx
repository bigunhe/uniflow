import type { ExperienceLevel } from '../types'

const styles: Record<ExperienceLevel, string> = {
  'Entry Level':
    'bg-violet-50 text-indigo-800 ring-1 ring-violet-100/80',
  Intermediate: 'bg-gray-100 text-gray-700 ring-1 ring-gray-200',
  Senior: 'bg-gray-200 text-gray-900 ring-1 ring-gray-300',
}

export function ExperienceBadge({ level }: { level: ExperienceLevel }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[level]}`}
    >
      {level}
    </span>
  )
}
