import { useState } from 'react'
import PersonAvatar from './PersonAvatar'

export default function PersonPicker({ people, taggedPeople, onTag, onUntag, onCreatePerson }) {
  const [query, setQuery] = useState('')
  const [busy, setBusy] = useState(false)

  const taggedIds = new Set(taggedPeople.map((p) => p.id))
  const term = query.trim().toLowerCase()

  const suggestions = term
    ? people.filter((p) => !taggedIds.has(p.id) && p.name.toLowerCase().includes(term)).slice(0, 5)
    : []

  const exactMatch = people.some((p) => p.name.toLowerCase() === term)
  const showCreate = term.length > 0 && !exactMatch

  async function handleTag(personId) {
    setBusy(true)
    try {
      await onTag(personId)
      setQuery('')
    } finally {
      setBusy(false)
    }
  }

  async function handleCreate() {
    setBusy(true)
    try {
      const person = await onCreatePerson(query.trim())
      if (person) await onTag(person.id)
      setQuery('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {taggedPeople.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {taggedPeople.map((person) => (
            <span
              key={person.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-borderSoft bg-card py-1 pl-1 pr-2 text-xs font-medium text-ink"
            >
              <PersonAvatar person={person} size="sm" />
              {person.name}
              <button
                type="button"
                onClick={() => onUntag(person.id)}
                className="text-inkMuted hover:text-[#D85A30]"
                aria-label={`Remove ${person.name}`}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={busy}
          placeholder="Tag someone…"
          className="w-full rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
        />

        {(suggestions.length > 0 || showCreate) && (
          <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-borderSoft bg-card shadow-none">
            {suggestions.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => handleTag(person.id)}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-tan"
              >
                <PersonAvatar person={person} size="sm" />
                {person.name}
              </button>
            ))}
            {showCreate && (
              <button
                type="button"
                onClick={handleCreate}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-ink hover:bg-tan"
              >
                + Add "{query.trim()}" as a new person
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
