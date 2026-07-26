function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

const SIZES = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-9 w-9 text-xs',
  lg: 'h-20 w-20 text-2xl'
}

export default function PersonAvatar({ person, size = 'md' }) {
  const sizeClass = SIZES[size] || SIZES.md

  if (person.photo) {
    return (
      <img
        src={person.photo}
        alt={person.name}
        className={`${sizeClass} shrink-0 rounded-full border-2 border-card object-cover`}
      />
    )
  }

  return (
    <span
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full border-2 border-card bg-tan font-medium text-ink`}
    >
      {initials(person.name)}
    </span>
  )
}
