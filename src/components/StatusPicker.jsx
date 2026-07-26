import { STATUSES } from '../lib/status'

export default function StatusPicker({ status, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {STATUSES.map((s) => {
        const active = s.value === status
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              active
                ? 'border-ink bg-ink text-parchment'
                : 'border-borderSoft bg-card text-inkMuted hover:border-ink hover:text-ink'
            }`}
          >
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
