export default function Header({ view, onViewChange, currentName, onEditName, onAddItem }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Our Bucket List</h1>
          <button
            type="button"
            onClick={onEditName}
            className="text-xs text-slate-500 hover:text-brand-600"
          >
            {currentName ? `Hey, ${currentName}` : 'Set your name'}
          </button>
        </div>
        <button
          type="button"
          onClick={onAddItem}
          className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          + Add
        </button>
      </div>
      <nav className="mx-auto flex max-w-3xl gap-1 px-4 pb-2">
        <button
          type="button"
          onClick={() => onViewChange('active')}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            view === 'active'
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => onViewChange('memories')}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            view === 'memories'
              ? 'bg-brand-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Memories
        </button>
      </nav>
    </header>
  )
}
