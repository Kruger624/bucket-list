export const STATUSES = [
  { value: 'someday', label: 'Someday' },
  { value: 'this_year', label: 'This year' },
  { value: 'booked', label: 'Booked' },
  { value: 'done', label: 'Done' }
]

export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.value, s]))

export function statusLabel(value) {
  return STATUS_MAP[value]?.label || value
}
