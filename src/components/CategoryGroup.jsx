import ItemCard from './ItemCard'

export default function CategoryGroup({
  title,
  items,
  variant,
  currentName,
  interestByItem,
  onToggleInterest,
  onStatusChange = () => {},
  onEdit,
  onDelete
}) {
  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-2 text-sm font-bold uppercase tracking-wide text-slate-500">
        {title} <span className="font-normal text-slate-400">({items.length})</span>
      </h2>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            variant={variant}
            currentName={currentName}
            interestPeople={interestByItem.get(item.id) || []}
            onToggleInterest={() => onToggleInterest(item.id)}
            onStatusChange={(status) => onStatusChange(item, status)}
            onEdit={() => onEdit(item)}
            onDelete={() => onDelete(item)}
          />
        ))}
      </div>
    </section>
  )
}
