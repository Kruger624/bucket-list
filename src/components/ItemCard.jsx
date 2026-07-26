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
  commentCount = 0,
  currentName,
  onToggleInterest,
  onStatusChange,
  onOpenDetail,
  onEdit,
  onDelete
}) {
  return (
    <div
      className="rounded-card border-2 bg-card p-4"
      style={{ borderColor: color.accent }}
    >
      <div className="flex items-start gap-3">
        <div
          className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2"
          style={{ borderColor: color.accent, backgroundColor: color.badgeBg }}
        >
          {item.icon_image ? (
            <img src={item.icon_image} alt="" className="h-full w-full object-cover" />
          ) : (
            <span
              className="flex h-full w-full items-center justify-center font-serif text-xl"
              style={{ color: color.badgeText }}
            >
              {item.title.trim().charAt(0).toUpperCase() || '✦'}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
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

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-borderSoft pt-3">
        <InterestButton
          people={interestPeople}
          currentName={currentName}
          onToggle={onToggleInterest}
        />
        <button
          type="button"
          onClick={onOpenDetail}
          className="inline-flex items-center gap-1.5 rounded-full border border-borderSoft bg-card px-3 py-1 text-xs font-medium text-inkMuted hover:border-ink hover:text-ink"
        >
          💬 {commentCount > 0 ? commentCount : 'Comment'}
        </button>
      </div>
    </div>
  )
}
