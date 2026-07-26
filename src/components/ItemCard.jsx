import StatusBadge from './StatusBadge'
import StatusPicker from './StatusPicker'
import InterestButton from './InterestButton'
import CategoryBadge from './CategoryBadge'
import { formatDate, formatDateRange } from '../lib/format'
import { downloadIcs } from '../lib/ics'

export default function ItemCard({
  item,
  color,
  interestPeople,
  currentName,
  onToggleInterest,
  onStatusChange,
  onEdit,
  onDelete
}) {
  return (
    <div
      className="rounded-card border-2 bg-card p-4"
      style={{ borderColor: color.accent }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-lg text-ink">{item.title}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <CategoryBadge name={item.category?.name} color={color} />
            <StatusBadge status={item.status} />
          </div>
          <div className="mt-1.5 text-xs text-inkMuted">
            Added {formatDate(item.created_at)}
            {item.added_by && <span> by {item.added_by}</span>}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg p-1.5 text-inkMuted hover:bg-tan hover:text-ink"
            aria-label="Edit"
          >
            ✏️
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg p-1.5 text-inkMuted hover:bg-tan hover:text-ink"
            aria-label="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {item.description && <p className="mt-3 text-sm text-ink">{item.description}</p>}

      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-block break-all text-sm font-medium text-inkMuted underline decoration-borderSoft hover:text-ink"
        >
          🔗 {item.link}
        </a>
      )}

      {item.status === 'booked' && item.planned_start_date && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-tan px-3 py-2">
          <span className="text-sm font-medium text-ink">
            📅 {formatDateRange(item.planned_start_date, item.planned_end_date)}
          </span>
          <button
            type="button"
            onClick={() => downloadIcs(item)}
            className="rounded-lg border border-borderSoft bg-card px-2 py-1 text-xs font-medium text-ink hover:bg-parchment"
          >
            Add to calendar
          </button>
        </div>
      )}

      <div className="mt-3">
        <StatusPicker status={item.status} onChange={onStatusChange} />
      </div>

      <div className="mt-3 border-t border-borderSoft pt-3">
        <InterestButton
          people={interestPeople}
          currentName={currentName}
          onToggle={onToggleInterest}
        />
      </div>
    </div>
  )
}
