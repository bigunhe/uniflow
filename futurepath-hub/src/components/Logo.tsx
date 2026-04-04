import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

type Props = {
  to?: string
  className?: string
}

export function Logo({ to = '/', className = '' }: Props) {
  const inner = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4F46E5] text-white shadow-sm">
        <GraduationCap className="h-5 w-5" strokeWidth={2} />
      </span>
      <span className="text-lg font-semibold tracking-tight text-gray-900">
        UniFlow
      </span>
    </span>
  )
  if (to) {
    return (
      <Link to={to} className="inline-flex shrink-0 items-center">
        {inner}
      </Link>
    )
  }
  return inner
}
