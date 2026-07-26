export default function CategoryBadge({ name, color }) {
  if (!name) return null

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: color.badgeBg, color: color.badgeText }}
    >
      {name}
    </span>
  )
}
