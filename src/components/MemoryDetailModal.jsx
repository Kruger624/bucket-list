import Modal from './Modal'
import CategoryBadge from './CategoryBadge'
import InterestButton from './InterestButton'
import { formatDate } from '../lib/format'

export default function MemoryDetailModal({
  item,
  color,
  interestPeople,
  currentName,
  onToggleInterest,
  onEdit,
  onDelete,
  onClose
}) {
  return (
    <Modal title={item.title} onClose={onClose}>
      <div
        className="flex h-32 items-center justify-center rounded-lg border-2"
        style={{ backgroundColor: color.badgeBg, borderColor: color.accent }}
      >
        <span className="font-serif text-6xl" style={{ color: color.badgeText }}>
          {item.title.trim().charAt(0).toUpperCase() || '✦'}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <CategoryBadge name={item.category?.name} color={color} />
        <span className="text-xs text-inkMuted">
          Added {formatDate(item.created_at)}
          {item.added_by && <span> by {item.added_by}</span>}
        </span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-inkMuted">Memory</p>
        {item.memory_note ? (
          <p className="mt-1 text-sm text-ink">{item.memory_note}</p>
        ) : (
          <p className="mt-1 text-sm italic text-inkMuted">
            No memory note yet — edit this memory to add one.
          </p>
        )}
      </div>

      {item.photo_link && (
        <a
          href={item.photo_link}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-borderSoft px-3 py-1.5 text-sm font-medium text-ink hover:bg-tan"
        >
          📷 View photos
        </a>
      )}

      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block break-all text-sm font-medium text-inkMuted underline decoration-borderSoft hover:text-ink"
        >
          🔗 {item.link}
        </a>
      )}

      <div className="mt-4 border-t border-borderSoft pt-3">
        <InterestButton
          people={interestPeople}
          currentName={currentName}
          onToggle={onToggleInterest}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-lg border border-borderSoft px-4 py-2 text-sm font-medium text-ink hover:bg-tan"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex-1 rounded-lg border border-borderSoft px-4 py-2 text-sm font-medium text-inkMuted hover:border-[#D85A30] hover:text-[#D85A30]"
        >
          Delete
        </button>
      </div>
    </Modal>
  )
}
