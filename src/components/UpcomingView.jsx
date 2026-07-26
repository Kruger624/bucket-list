import { useMemo } from 'react'
import ItemCard from './ItemCard'

export default function UpcomingView({
  items,
  colorFor,
  currentName,
  interestByItem,
  onToggleInterest,
  onStatusChange,
  onEdit,
  onDelete
}) {
  const upcoming = useMemo(() => {
    return items
      .filter((i) => i.status === 'booked' && i.planned_start_date)
      .sort((a, b) => a.planned_start_date.localeCompare(b.planned_start_date))
  }, [items])

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-inkMuted">Everything booked with a date on the calendar, soonest first.</p>

      {upcoming.length === 0 && (
        <div className="rounded-card border border-dashed border-borderSoft py-12 text-center">
          <p className="font-serif text-lg text-ink">Nothing on the calendar yet</p>
          <p className="mt-1 text-sm text-inkMuted">
            Mark something "Booked" and add a date to see it here.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {upcoming.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            color={colorFor(item.category_id)}
            currentName={currentName}
            interestPeople={interestByItem.get(item.id) || []}
            onToggleInterest={() => onToggleInterest(item.id)}
            onStatusChange={(status) => onStatusChange(item, status)}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
          />
        ))}
      </div>
    </div>
  )
}
