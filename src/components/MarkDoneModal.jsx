import { useState } from 'react'
import Modal from './Modal'

export default function MarkDoneModal({ item, onClose, onConfirm }) {
  const [memoryNote, setMemoryNote] = useState('')
  const [photoLink, setPhotoLink] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onConfirm({
        memory_note: memoryNote.trim() || null,
        photo_link: photoLink.trim() || null
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={`Mark "${item.title}" as done`} onClose={onClose}>
      <p className="mb-3 text-sm text-inkMuted">
        This moves it into Memories. You can add details now or skip and edit later.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Memory note (optional)
          <textarea
            autoFocus
            value={memoryNote}
            onChange={(e) => setMemoryNote(e.target.value)}
            rows={3}
            placeholder="How did it go?"
            className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Photo link (optional)
          <input
            type="url"
            value={photoLink}
            onChange={(e) => setPhotoLink(e.target.value)}
            placeholder="Link to shared album"
            className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
          />
        </label>

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => onConfirm({ memory_note: null, photo_link: null }).then(onClose)}
            className="flex-1 rounded-lg border border-borderSoft px-4 py-2 text-sm font-medium text-inkMuted hover:bg-tan hover:text-ink"
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg border-2 border-ink px-4 py-2 text-sm font-medium text-ink transition hover:bg-ink hover:text-parchment disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
