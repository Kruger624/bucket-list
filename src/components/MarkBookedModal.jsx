import { useState } from 'react'
import Modal from './Modal'

export default function MarkBookedModal({ item, onClose, onConfirm }) {
  const [startDate, setStartDate] = useState(item.planned_start_date || '')
  const [endDate, setEndDate] = useState(item.planned_end_date || '')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onConfirm({
        planned_start_date: startDate || null,
        planned_end_date: endDate || null
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={`Mark "${item.title}" as booked`} onClose={onClose}>
      <p className="mb-3 text-sm text-inkMuted">
        Add a date (or date range) so it shows up in Upcoming. You can add this now or skip and
        edit later.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Start date
          <input
            autoFocus
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink focus:border-ink focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          End date (optional, for multi-day plans)
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink focus:border-ink focus:outline-none"
          />
        </label>

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() =>
              onConfirm({ planned_start_date: null, planned_end_date: null }).then(onClose)
            }
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
