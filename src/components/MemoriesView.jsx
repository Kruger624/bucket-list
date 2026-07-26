import { useMemo, useState } from 'react'
import SearchFilterBar from './SearchFilterBar'
import MemoryTile from './MemoryTile'
import { MEMORY_SORT_OPTIONS, filterItems, sortItems, groupByCategory } from '../lib/filterSort'

export default function MemoriesView({ items, categories, colorFor, interestByItem, onOpenDetail }) {
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
      <p className="text-sm text-inkMuted">A look back at everything we've actually done together.</p>

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
        <span className="mr-1 self-center text-inkMuted">Group by:</span>
        {[
          { value: 'date', label: 'Date' },
          { value: 'category', label: 'Category' }
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setGroupBy(opt.value)}
            className={`rounded-full px-3 py-1 font-medium transition ${
              groupBy === opt.value ? 'bg-ink text-parchment' : 'bg-tan text-inkMuted hover:text-ink'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {visible.length === 0 && (
        <div className="rounded-card border border-dashed border-borderSoft py-12 text-center">
          <p className="font-serif text-lg text-ink">No memories yet</p>
          <p className="mt-1 text-sm text-inkMuted">
            Mark something "Done" once you've done it, and it'll show up here.
          </p>
        </div>
      )}

      {groupBy === 'category' && groups && (
        <div className="flex flex-col gap-6">
          {groups
            .filter((group) => group.items.length > 0)
            .map((group) => {
              const color = colorFor(group.category.id)
              return (
                <section key={group.category.id ?? 'uncategorized'}>
                  <h2 className="mb-2 flex items-center gap-2 text-sm font-medium text-inkMuted">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: color.accent }}
                      aria-hidden
                    />
                    {group.category.name}{' '}
                    <span className="text-inkMuted/70">({group.items.length})</span>
                  </h2>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {group.items.map((item) => (
                      <MemoryTile
                        key={item.id}
                        item={item}
                        color={color}
                        onOpen={() => onOpenDetail(item)}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
        </div>
      )}

      {groupBy === 'date' && visible.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {visible.map((item) => (
            <MemoryTile
              key={item.id}
              item={item}
              color={colorFor(item.category_id)}
              onOpen={() => onOpenDetail(item)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
