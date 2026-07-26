import Modal from './Modal'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import InterestButton from './InterestButton'
import CommentThread from './CommentThread'
import PersonAvatar from './PersonAvatar'
import { formatDate, formatDateRange } from '../lib/format'
import { downloadIcs } from '../lib/ics'

export default function ItemDetailModal({
  item,
  color,
  interestPeople,
  comments,
  taggedPeople = [],
  currentName,
  onToggleInterest,
  onAddComment,
  onOpenPerson,
  onEdit,
  onDelete,
  onClose
}) {
  return (
    <Modal title={item.title} onClose={onClose}>
      <div
        className="relative flex h-32 items-center justify-center overflow-hidden rounded-lg border-2"
        style={{ backgroundColor: color.badgeBg, borderColor: color.accent }}
      >
        {item.banner_image ? (
          <img src={item.banner_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="font-serif text-6xl" style={{ color: color.badgeText }}>
            {item.title.trim().charAt(0).toUpperCase() || '✦'}
          </span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <CategoryBadge name={item.category?.name} color={color} />
        <StatusBadge status={item.status} />
        <span className="text-xs text-inkMuted">
          Added {formatDate(item.created_at)}
          {item.added_by && <span> by {item.added_by}</span>}
        </span>
      </div>

      {item.description && <p className="mt-3 text-sm text-ink">{item.description}</p>}

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

      {item.status === 'done' && (
        <div className="mt-3">
          <p className="text-xs font-medium text-inkMuted">Memory</p>
          {item.memory_note ? (
            <p className="mt-1 text-sm text-ink">{item.memory_note}</p>
          ) : (
            <p className="mt-1 text-sm italic text-inkMuted">
              No memory note yet — edit this memory to add one.
            </p>
          )}
          {item.photo_link && (
            <a
              href={item.photo_link}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-borderSoft px-3 py-1.5 text-sm font-medium text-ink hover:bg-tan"
            >
              📷 View photos
            </a>
          )}

          {taggedPeople.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-inkMuted">Tagged</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {taggedPeople.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => onOpenPerson(person)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-borderSoft bg-card py-1 pl-1 pr-2.5 text-xs font-medium text-ink hover:bg-tan"
                  >
                    <PersonAvatar person={person} size="sm" />
                    {person.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 border-t border-borderSoft pt-3">
        <InterestButton
          people={interestPeople}
          currentName={currentName}
          onToggle={onToggleInterest}
        />
      </div>

      <div className="mt-4 border-t border-borderSoft pt-3">
        <CommentThread
          comments={comments}
          currentName={currentName}
          onAddComment={(name, body) => onAddComment(item.id, name, body)}
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
