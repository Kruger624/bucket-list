export const STATUSES = [
  { value: 'someday', label: 'Someday', className: 'bg-slate-100 text-slate-700 border-slate-300' },
  { value: 'this_year', label: 'This Year', className: 'bg-amber-100 text-amber-800 border-amber-300' },
  { value: 'booked', label: 'Booked', className: 'bg-sky-100 text-sky-800 border-sky-300' },
  { value: 'done', label: 'Done', className: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
]

export const STATUS_MAP = Object.fromEntries(STATUSES.map((s) => [s.value, s]))

export function statusLabel(value) {
  return STATUS_MAP[value]?.label || value
}
