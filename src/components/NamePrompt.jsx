import { useState } from 'react'

export default function NamePrompt({ onSubmit }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onSubmit(value.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4">
      <div className="w-full max-w-sm rounded-card border border-borderSoft bg-card p-6">
        <h2 className="font-serif text-xl text-ink">What's your name?</h2>
        <p className="mt-1 text-sm text-inkMuted">
          So we can show who added things and who's keen. No password needed — just for this
          group.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <input
            autoFocus
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
          />
          <button
            type="submit"
            className="w-full rounded-lg border-2 border-ink px-4 py-2 text-sm font-medium text-ink transition hover:bg-ink hover:text-parchment"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
