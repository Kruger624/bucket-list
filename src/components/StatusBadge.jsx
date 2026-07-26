import { statusLabel } from '../lib/status'

export default function StatusBadge({ status }) {
  return (
    <span className="inline-flex items-center rounded-full border border-borderSoft bg-tan px-2.5 py-0.5 text-xs font-medium text-ink">
      {statusLabel(status)}
    </span>
  )
}
