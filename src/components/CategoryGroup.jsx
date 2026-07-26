import ItemCard from './ItemCard'

export default function CategoryGroup({
  title,
  color,
  items,
  currentName,
  interestByItem,
  commentsByItem,
  onToggleInterest,
  onStatusChange = () => {},
  onOpenDetail,
  onEdit,
  onDelete
}) {
  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-2 flex items-center gap-2 text-sm font-medium text-inkMuted">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: color.accent }}
          aria-hidden
        />
        {title} <span className="text-inkMuted/70">({items.length})</span>
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            color={color}
            currentName={currentName}
            interestPeople={interestByItem.get(item.id) || []}
            commentCount={commentsByItem?.get(item.id)?.length || 0}
            onToggleInterest={() => onToggleInterest(item.id)}
            onStatusChange={(status) => onStatusChange(item, status)}
            onOpenDetail={() => onOpenDetail(item)}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
          />
        ))}
      </div>
    </section>
  )
}
