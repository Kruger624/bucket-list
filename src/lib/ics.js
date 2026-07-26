function toIcsDate(dateStr) {
  return dateStr.replaceAll('-', '')
}

function addDays(dateStr, days) {
  // Pure UTC arithmetic — avoids off-by-one shifts from local-timezone conversion.
  const [year, month, day] = dateStr.split('-').map(Number)
  const d = new Date(Date.UTC(year, month - 1, day))
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

function escapeText(value) {
  return String(value).replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n')
}

export function buildIcsContent(item) {
  const start = item.planned_start_date
  if (!start) return null

  // All-day events use an exclusive DTEND, so a single-day item's end is start + 1 day.
  const end = item.planned_end_date && item.planned_end_date > start ? item.planned_end_date : start
  const dtend = addDays(end, 1)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Our Bucket List//EN',
    'BEGIN:VEVENT',
    `UID:${item.id}@our-bucket-list`,
    `DTSTAMP:${toIcsDate(new Date().toISOString().slice(0, 10))}T000000Z`,
    `DTSTART;VALUE=DATE:${toIcsDate(start)}`,
    `DTEND;VALUE=DATE:${toIcsDate(dtend)}`,
    `SUMMARY:${escapeText(item.title)}`
  ]

  if (item.description) {
    lines.push(`DESCRIPTION:${escapeText(item.description)}`)
  }
  if (item.link) {
    lines.push(`URL:${escapeText(item.link)}`)
  }

  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n')
}

export function downloadIcs(item) {
  const content = buildIcsContent(item)
  if (!content) return

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${item.title.replace(/[^\w\- ]/g, '').trim() || 'event'}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
