import type { LucideIcon } from 'lucide-react'
import {
  Braces,
  Cpu,
  Database,
  Network,
  BarChart3,
  ServerCog,
  Globe,
  Lock,
} from 'lucide-react'
import type { SpecId } from '../types'

export interface SpecializationCard {
  id: SpecId
  title: string
  shortLabel: string
  description: string
  Icon: LucideIcon
}

export const SPECIALIZATIONS: SpecializationCard[] = [
  {
    id: 'SE',
    shortLabel: 'SE',
    title: 'Software Engineering',
    description:
      'Design and build scalable, robust software systems and applications.',
    Icon: Cpu,
  },
  {
    id: 'IM',
    shortLabel: 'IM',
    title: 'Information Management',
    description:
      'Master the art of organizing and leveraging data for business intelligence.',
    Icon: Database,
  },
  {
    id: 'DS',
    shortLabel: 'DS',
    title: 'Data Science',
    description:
      'Extract meaningful insights from complex data sets using ML & AI.',
    Icon: BarChart3,
  },
  {
    id: 'CS',
    shortLabel: 'CS',
    title: 'Computer Science',
    description:
      'Deep dive into computing theory, algorithms, and complex logic.',
    Icon: Braces,
  },
  {
    id: 'CSNE',
    shortLabel: 'CSNE',
    title: 'CS & Networking',
    description:
      'Architect and maintain the infrastructure that connects the world.',
    Icon: Network,
  },
  {
    id: 'IT',
    shortLabel: 'IT',
    title: 'Info Technology',
    description:
      'Support and implement technology solutions for enterprise success.',
    Icon: Globe,
  },
  {
    id: 'ISE',
    shortLabel: 'ISE',
    title: 'Systems Engineering',
    description:
      'Integrate complex hardware and software systems seamlessly.',
    Icon: ServerCog,
  },
  {
    id: 'CYBER',
    shortLabel: 'CYBER',
    title: 'Cyber Security',
    description:
      'Protect critical assets and data from modern digital threats.',
    Icon: Lock,
  },
]

export const SPEC_NAME_BY_ID: Record<SpecId, string> = Object.fromEntries(
  SPECIALIZATIONS.map((s) => [s.id, s.title]),
) as Record<SpecId, string>
