import { formatDate } from '../lib/format'

export default function MemoryTile({ item, color, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex flex-col gap-2 text-left"
    >
      <div
        className="flex aspect-square items-center justify-center rounded-card border-2"
        style={{ backgroundColor: color.badgeBg, borderColor: color.accent }}
      >
        <span className="font-serif text-4xl" style={{ color: color.badgeText }}>
          {item.title.trim().charAt(0).toUpperCase() || '✦'}
        </span>
      </div>
      <div>
        <p className="truncate font-serif text-base text-ink">{item.title}</p>
        <p className="text-xs text-inkMuted">{formatDate(item.created_at)}</p>
      </div>
    </button>
  )
}
