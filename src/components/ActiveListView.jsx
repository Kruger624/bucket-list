import { useMemo, useState } from 'react'
import SearchFilterBar from './SearchFilterBar'
import CategoryGroup from './CategoryGroup'
import { ACTIVE_SORT_OPTIONS, filterItems, sortItems, groupByCategory } from '../lib/filterSort'

export default function ActiveListView({
  items,
  categories,
  currentName,
  interestByItem,
  onToggleInterest,
  onStatusChange,
  onEdit,
  onDelete
}) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('date_desc')

  const activeItems = useMemo(() => items.filter((i) => i.status !== 'done'), [items])

  const visible = useMemo(() => {
    const filtered = filterItems(activeItems, {
      search,
      categoryId: categoryFilter,
      status: statusFilter
    })
    return sortItems(filtered, sortBy, interestByItem)
  }, [activeItems, search, categoryFilter, statusFilter, sortBy, interestByItem])

  const groups = useMemo(() => groupByCategory(visible, categories), [visible, categories])

  return (
    <div className="flex flex-col gap-4">
      <SearchFilterBar
        search={search}
        onSearchChange={setSearch}
        categories={categories}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOptions={ACTIVE_SORT_OPTIONS}
      />

      {visible.length === 0 && (
        <p className="py-12 text-center text-sm text-slate-400">
          Nothing here yet. Add something you want to do together!
        </p>
      )}

      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <CategoryGroup
            key={group.category.id ?? 'uncategorized'}
            title={group.category.name}
            items={group.items}
            variant="active"
            currentName={currentName}
            interestByItem={interestByItem}
            onToggleInterest={onToggleInterest}
            onStatusChange={onStatusChange}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}
