export type SpecId =
  | 'SE'
  | 'IM'
  | 'DS'
  | 'CS'
  | 'CSNE'
  | 'IT'
  | 'ISE'
  | 'CYBER'

export type ExperienceLevel = 'Entry Level' | 'Intermediate' | 'Senior'

export const SPEC_IDS: SpecId[] = [
  'SE',
  'IM',
  'DS',
  'CS',
  'CSNE',
  'IT',
  'ISE',
  'CYBER',
]

export function isSpecId(value: string): value is SpecId {
  return (SPEC_IDS as string[]).includes(value)
}
