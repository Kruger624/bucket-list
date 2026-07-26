import StatusBadge from './StatusBadge'
import StatusPicker from './StatusPicker'
import InterestButton from './InterestButton'
import { formatDate } from '../lib/format'

export default function ItemCard({
  item,
  variant = 'active',
  interestPeople,
  currentName,
  onToggleInterest,
  onStatusChange,
  onEdit,
  onDelete
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">{item.title}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {variant === 'memory' && item.category?.name && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5">{item.category.name}</span>
            )}
            {variant === 'active' && <StatusBadge status={item.status} />}
            <span>Added {formatDate(item.created_at)}</span>
            {item.added_by && <span>by {item.added_by}</span>}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
            aria-label="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {item.description && (
        <p className="mt-2 text-sm text-slate-600">{item.description}</p>
      )}

      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block break-all text-sm font-medium text-brand-600 hover:underline"
        >
          🔗 {item.link}
        </a>
      )}

      {variant === 'memory' && (
        <div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3">
          {item.memory_note ? (
            <p className="text-sm text-slate-700">{item.memory_note}</p>
          ) : (
            <p className="text-sm italic text-slate-400">No memory note yet — click edit to add one.</p>
          )}
          {item.photo_link && (
            <a
              href={item.photo_link}
              target="_blank"
              rel="noreferrer"
              className="inline-block break-all text-sm font-medium text-brand-600 hover:underline"
            >
              📷 View photos
            </a>
          )}
        </div>
      )}

      {variant === 'active' && (
        <div className="mt-3">
          <StatusPicker status={item.status} onChange={onStatusChange} />
        </div>
      )}

      <div className="mt-3 border-t border-slate-100 pt-3">
        <InterestButton
          people={interestPeople}
          currentName={currentName}
          onToggle={onToggleInterest}
        />
      </div>
    </div>
  )
}
