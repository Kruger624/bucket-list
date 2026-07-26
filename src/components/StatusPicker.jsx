import { STATUSES } from '../lib/status'

export default function StatusPicker({ status, onChange }) {
  return (
    <div className="flex flex-wrap gap-1">
      {STATUSES.map((s) => {
        const active = s.value === status
        return (
          <button
            key={s.value}
            type="button"
            onClick={() => onChange(s.value)}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              active
                ? s.className
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            {s.label}
          </button>
        )
      })}
    </div>
  )
}
