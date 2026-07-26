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
    <Modal title={`Mark "${item.title}" as done 🎉`} onClose={onClose}>
      <p className="mb-3 text-sm text-slate-500">
        This moves it into Memories. You can add details now or skip and edit later.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Memory note (optional)
          <textarea
            autoFocus
            value={memoryNote}
            onChange={(e) => setMemoryNote(e.target.value)}
            rows={3}
            placeholder="How did it go?"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Photo link (optional)
          <input
            type="url"
            value={photoLink}
            onChange={(e) => setPhotoLink(e.target.value)}
            placeholder="Link to shared album"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </label>

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => onConfirm({ memory_note: null, photo_link: null }).then(onClose)}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Skip
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
