export const ACTIVE_SORT_OPTIONS = [
  { value: 'date_desc', label: 'Newest first' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'interest_desc', label: 'Most interest' }
]

export const MEMORY_SORT_OPTIONS = [
  { value: 'date_desc', label: 'Most recent' },
  { value: 'date_asc', label: 'Oldest first' },
  { value: 'interest_desc', label: 'Most interest' }
]

export function filterItems(items, { search, categoryId, status }) {
  const term = search.trim().toLowerCase()
  return items.filter((item) => {
    if (term) {
      const haystack = `${item.title} ${item.description || ''}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }
    if (categoryId && item.category_id !== categoryId) return false
    if (status && item.status !== status) return false
    return true
  })
}

export function sortItems(items, sortBy, interestByItem) {
  const withCounts = items.map((item) => ({
    item,
    count: interestByItem.get(item.id)?.length || 0
  }))

  withCounts.sort((a, b) => {
    if (sortBy === 'interest_desc') return b.count - a.count
    const aTime = new Date(a.item.created_at).getTime()
    const bTime = new Date(b.item.created_at).getTime()
    return sortBy === 'date_asc' ? aTime - bTime : bTime - aTime
  })

  return withCounts.map((w) => w.item)
}

export function groupByCategory(items, categories) {
  const groups = new Map(categories.map((c) => [c.id, { category: c, items: [] }]))
  const uncategorized = { category: { id: null, name: 'Uncategorized' }, items: [] }

  for (const item of items) {
    if (item.category_id && groups.has(item.category_id)) {
      groups.get(item.category_id).items.push(item)
    } else {
      uncategorized.items.push(item)
    }
  }

  const result = [...groups.values()]
  if (uncategorized.items.length > 0) result.push(uncategorized)
  return result
}
