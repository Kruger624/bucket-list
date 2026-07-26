import { useEffect, useState } from 'react'
import Modal from './Modal'
import PersonAvatar from './PersonAvatar'
import { formatDate } from '../lib/format'
import { supabase } from '../lib/supabaseClient'

export default function PersonProfileModal({ person, onUpdatePerson, onOpenItem, onClose }) {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(person.name)
  const [bio, setBio] = useState(person.bio || '')
  const [photoFile, setPhotoFile] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadMemories() {
      setLoading(true)
      const { data, error } = await supabase
        .from('item_people')
        .select('item:items(id, title, created_at, category:categories(name))')
        .eq('person_id', person.id)

      if (!cancelled) {
        if (error) {
          console.error('Failed to load tagged memories', error)
        } else {
          setMemories(data.map((row) => row.item).filter(Boolean))
        }
        setLoading(false)
      }
    }

    loadMemories()
    return () => {
      cancelled = true
    }
  }, [person.id])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onUpdatePerson(person.id, { name, bio, photoFile: photoFile || undefined })
      setEditing(false)
      setPhotoFile(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal title={person.name} onClose={onClose}>
      {editing ? (
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium text-ink">
            Name
            <input
              type="text"
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
              className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink focus:border-ink focus:outline-none"
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
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 rounded-lg border border-borderSoft px-4 py-2 text-sm font-medium text-inkMuted hover:bg-tan hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg border-2 border-ink px-4 py-2 text-sm font-medium text-ink transition hover:bg-ink hover:text-parchment disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="flex items-center gap-4">
            <PersonAvatar person={person} size="lg" />
            <div>
              {person.bio ? (
                <p className="text-sm text-ink">{person.bio}</p>
              ) : (
                <p className="text-sm italic text-inkMuted">No bio yet.</p>
              )}
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="mt-1 text-xs font-medium text-inkMuted underline hover:text-ink"
              >
                Edit
              </button>
            </div>
          </div>

          <div className="mt-4 border-t border-borderSoft pt-3">
            <p className="text-xs font-medium text-inkMuted">
              Tagged in {memories.length > 0 ? memories.length : 'no'} memor
              {memories.length === 1 ? 'y' : 'ies'}
            </p>

            {loading && <p className="mt-2 text-sm text-inkMuted">Loading…</p>}

            {!loading && memories.length > 0 && (
              <ul className="mt-2 flex flex-col gap-1.5">
                {memories.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onOpenItem(item)}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-sm text-ink hover:bg-tan"
                    >
                      <span className="font-serif">{item.title}</span>
                      <span className="text-xs text-inkMuted">{formatDate(item.created_at)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </Modal>
  )
}
