import { useState } from 'react'
import { formatDate } from '../lib/format'

export default function CommentThread({ comments, currentName, onAddComment }) {
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!body.trim()) return
    setSubmitting(true)
    try {
      await onAddComment(currentName, body)
      setBody('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <p className="text-xs font-medium text-inkMuted">
        Comments{comments.length > 0 ? ` (${comments.length})` : ''}
      </p>

      {comments.length === 0 ? (
        <p className="mt-1 text-sm italic text-inkMuted">No comments yet — be the first to say something.</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {comments.map((comment) => (
            <li key={comment.id} className="rounded-lg bg-tan px-3 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-ink">{comment.name}</span>
                <span className="text-xs text-inkMuted">{formatDate(comment.created_at)}</span>
              </div>
              <p className="mt-0.5 text-sm text-ink">{comment.body}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={currentName ? `Comment as ${currentName}…` : 'Write a comment…'}
          className="flex-1 rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="rounded-lg border-2 border-ink px-3 py-2 text-sm font-medium text-ink transition hover:bg-ink hover:text-parchment disabled:opacity-60"
        >
          Post
        </button>
      </form>
    </div>
  )
}
