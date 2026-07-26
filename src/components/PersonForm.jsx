import { useState } from 'react'

export default function PersonForm({
  initialName = '',
  initialBio = '',
  submitLabel = 'Save',
  onCancel,
  onSubmit
}) {
  const [name, setName] = useState(initialName)
  const [bio, setBio] = useState(initialBio)
  const [photoFile, setPhotoFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await onSubmit({ name: name.trim(), bio, photoFile: photoFile || undefined })
    } catch (err) {
      setError(err.message || 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm font-medium text-ink">
        Name
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink focus:border-ink focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-ink">
        Bio
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={2}
          placeholder="e.g. Where we met"
          className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-ink">
        Photo
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          className="text-sm text-inkMuted file:mr-3 file:rounded-lg file:border file:border-borderSoft file:bg-card file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink"
        />
      </label>

      {error && <p className="text-sm text-[#D85A30]">{error}</p>}

      <div className="mt-1 flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-lg border border-borderSoft px-4 py-2 text-sm font-medium text-inkMuted hover:bg-tan hover:text-ink"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-lg border-2 border-ink px-4 py-2 text-sm font-medium text-ink transition hover:bg-ink hover:text-parchment disabled:opacity-60"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
