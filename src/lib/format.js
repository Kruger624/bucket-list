export function formatDate(iso) {
  if (!iso) return ''
  return new Date(`${iso}`.length === 10 ? `${iso}T00:00:00` : iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateRange(start, end) {
  if (!start) return ''
  if (!end || end === start) return formatDate(start)
  return `${formatDate(start)} – ${formatDate(end)}`
}
