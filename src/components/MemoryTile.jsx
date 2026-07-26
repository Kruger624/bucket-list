import { formatDate } from '../lib/format'
import PersonAvatar from './PersonAvatar'

export default function MemoryTile({ item, color, taggedPeople = [], onOpen }) {
  return (
    <button type="button" onClick={onOpen} className="flex flex-col gap-2 text-left">
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-card border-2"
        style={{ backgroundColor: color.badgeBg, borderColor: color.accent }}
      >
        {item.icon_image ? (
          <img src={item.icon_image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <span className="font-serif text-4xl" style={{ color: color.badgeText }}>
            {item.title.trim().charAt(0).toUpperCase() || '✦'}
          </span>
        )}

        {taggedPeople.length > 0 && (
          <div className="absolute bottom-2 left-2 z-10 flex -space-x-2">
            {taggedPeople.slice(0, 4).map((person) => (
              <PersonAvatar key={person.id} person={person} size="sm" />
            ))}
            {taggedPeople.length > 4 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-tan text-[10px] font-medium text-ink">
                +{taggedPeople.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
      <div>
        <p className="truncate font-serif text-base text-ink">{item.title}</p>
        <p className="text-xs text-inkMuted">{formatDate(item.created_at)}</p>
      </div>
    </button>
  )
}
