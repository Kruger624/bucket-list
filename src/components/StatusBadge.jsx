import { STATUS_MAP } from '../lib/status'

export default function StatusBadge({ status }) {
  const info = STATUS_MAP[status]
  if (!info) return null

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${info.className}`}
    >
      {info.label}
    </span>
  )
}
