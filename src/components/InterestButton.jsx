function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export default function InterestButton({ people, currentName, onToggle }) {
  const isKeen = people.some((p) => p.name.toLowerCase() === currentName.toLowerCase())

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
          isKeen
            ? 'border-brand-500 bg-brand-50 text-brand-700'
            : 'border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600'
        }`}
      >
        <span aria-hidden>{isKeen ? '★' : '☆'}</span>
        I'm keen{people.length > 0 ? ` · ${people.length}` : ''}
      </button>
      {people.length > 0 && (
        <div className="flex -space-x-2" title={people.map((p) => p.name).join(', ')}>
          {people.slice(0, 5).map((p) => (
            <span
              key={p.id}
              className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-brand-100 text-[10px] font-semibold text-brand-700"
            >
              {initials(p.name)}
            </span>
          ))}
          {people.length > 5 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-semibold text-slate-600">
              +{people.length - 5}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
