export interface Mentor {
  id: string
  name: string
  title: string
  lastMessage: string
  timeLabel: string
  online: boolean
  avatarGradient: string
}

export const MENTORS: Mentor[] = [
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    title: 'Cloud Architect',
    lastMessage: 'Check out these AWS resources I found for your roadmap…',
    timeLabel: '10:24 AM',
    online: true,
    avatarGradient: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'jordan-kim',
    name: 'Jordan Kim',
    title: 'Senior Frontend Engineer',
    lastMessage: 'Happy to review your portfolio this weekend.',
    timeLabel: 'Yesterday',
    online: true,
    avatarGradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'sam-ortiz',
    name: 'Sam Ortiz',
    title: 'DevOps Lead',
    lastMessage: 'Let’s sync on CI/CD best practices.',
    timeLabel: 'Tue',
    online: false,
    avatarGradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'riley-patel',
    name: 'Riley Patel',
    title: 'Security Engineer',
    lastMessage: 'Here’s a checklist for threat modeling.',
    timeLabel: 'Oct 12',
    online: false,
    avatarGradient: 'from-amber-500 to-orange-600',
  },
]

export function getMentorById(id: string): Mentor | undefined {
  return MENTORS.find((m) => m.id === id)
}
