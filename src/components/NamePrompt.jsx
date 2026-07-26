import { useState } from 'react'

export default function NamePrompt({ onSubmit }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!value.trim()) return
    onSubmit(value.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">What's your name?</h2>
        <p className="mt-1 text-sm text-slate-500">
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
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
