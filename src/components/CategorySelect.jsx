import { useState } from 'react'

const NEW_VALUE = '__new__'

export default function CategorySelect({ categories, value, onChange, newName, onNewNameChange }) {
  const [creating, setCreating] = useState(false)

  function handleSelect(e) {
    const val = e.target.value
    if (val === NEW_VALUE) {
      setCreating(true)
      onChange('')
    } else {
      setCreating(false)
      onChange(val)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <select
        value={creating ? NEW_VALUE : value}
        onChange={handleSelect}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
      >
        <option value="" disabled>
          Choose a category…
        </option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
        <option value={NEW_VALUE}>+ Add new category…</option>
      </select>
      {creating && (
        <input
          type="text"
          autoFocus
          value={newName}
          onChange={(e) => onNewNameChange(e.target.value)}
          placeholder="New category name"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      )}
    </div>
  )
}
