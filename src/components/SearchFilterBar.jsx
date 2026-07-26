import { STATUSES } from '../lib/status'

export default function SearchFilterBar({
  search,
  onSearchChange,
  categories,
  categoryFilter,
  onCategoryFilterChange,
  statusFilter,
  onStatusFilterChange,
  showStatusFilter = true,
  sortBy,
  onSortByChange,
  sortOptions
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search title or description…"
        className="w-full flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      />
      <div className="flex flex-wrap gap-2">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {showStatusFilter && (
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          >
            <option value="">All statuses</option>
            {STATUSES.filter((s) => s.value !== 'done').map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}

        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="rounded-lg border border-slate-300 px-2 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
