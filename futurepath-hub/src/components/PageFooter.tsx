import type { ReactNode } from 'react'

type Props = {
  children?: ReactNode
  className?: string
}

export function PageFooter({ children, className = '' }: Props) {
  return (
    <footer
      className={`border-t border-gray-200 bg-white/80 py-6 text-center text-sm text-gray-500 ${className}`}
    >
      {children ?? (
        <p>© 2024 UniFlow. Empowering the next generation of tech leaders.</p>
      )}
    </footer>
  )
}
