import { useMemo, useState } from 'react'
import SearchFilterBar from './SearchFilterBar'
import CategoryGroup from './CategoryGroup'
import ItemCard from './ItemCard'
import { MEMORY_SORT_OPTIONS, filterItems, sortItems, groupByCategory } from '../lib/filterSort'

export default function MemoriesView({
  items,
  categories,
  currentName,
  interestByItem,
  onToggleInterest,
  onEdit,
  onDelete
}) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')
  const [groupBy, setGroupBy] = useState('date')

  const doneItems = useMemo(() => items.filter((i) => i.status === 'done'), [items])

  const visible = useMemo(() => {
    const filtered = filterItems(doneItems, { search, categoryId: categoryFilter, status: '' })
    return sortItems(filtered, sortBy, interestByItem)
  }, [doneItems, search, categoryFilter, sortBy, interestByItem])

  const groups = useMemo(
    () => (groupBy === 'category' ? groupByCategory(visible, categories) : null),
    [groupBy, visible, categories]
  )

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-500">
        A look back at everything we've actually done together. 🎉
      </p>

      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        showStatusFilter={false}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={MEMORY_SORT_OPTIONS}
      />

      <div className="flex gap-1 text-sm">
        <span className="mr-1 self-center text-slate-500">Group by:</span>
        {[
          { value: 'date', label: 'Date' },
          { value: 'category', label: 'Category' }
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setGroupBy(opt.value)}
            className={`rounded-full px-3 py-1 font-medium transition ${
              groupBy === opt.value
                ? 'bg-brand-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-400">
          No memories yet — mark something "Done" once you've done it!
        </p>
      )}

      {groupBy === 'category' && groups && (
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <CategoryGroup
              key={group.category.id ?? 'uncategorized'}
              title={group.category.name}
              items={group.items}
              variant="memory"
              currentName={currentName}
              interestByItem={interestByItem}
              onToggleInterest={onToggleInterest}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {groupBy === 'date' && (
        <div className="flex flex-col gap-3">
          {visible.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              variant="memory"
              currentName={currentName}
              interestPeople={interestByItem.get(item.id) || []}
              onToggleInterest={() => onToggleInterest(item.id)}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
