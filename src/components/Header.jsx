export default function Header({ view, onViewChange, currentName, onEditName, onAddItem }) {
  return (
    <header className="sticky top-0 z-30 border-b border-borderSoft bg-parchment/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <div>
          <h1 className="font-serif text-xl text-ink">Our bucket list</h1>
          <button
            type="button"
            onClick={onEditName}
            className="text-xs text-inkMuted hover:text-ink"
          >
            {currentName ? `Hey, ${currentName}` : 'Set your name'}
          </button>
        </div>
        <button
          type="button"
          onClick={onAddItem}
          className="rounded-lg border-2 border-ink px-4 py-2 text-sm font-medium text-ink transition hover:bg-ink hover:text-parchment"
        >
          + Add
        </button>
      </div>
      <nav className="mx-auto flex max-w-3xl flex-wrap gap-1 px-4 pb-2">
        {[
          { value: 'active', label: 'List' },
          { value: 'upcoming', label: 'Upcoming' },
          { value: 'memories', label: 'Memories' },
          { value: 'people', label: 'People' }
        ].map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => onViewChange(tab.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              view === tab.value
                ? 'bg-ink text-parchment'
                : 'text-inkMuted hover:bg-tan hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  )
}
