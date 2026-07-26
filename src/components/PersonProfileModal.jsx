import { useEffect, useState } from 'react'
import Modal from './Modal'
import PersonAvatar from './PersonAvatar'
import PersonForm from './PersonForm'
import { formatDate } from '../lib/format'
import { supabase } from '../lib/supabaseClient'

export default function PersonProfileModal({ person, onUpdatePerson, onDeletePerson, onOpenItem, onClose }) {
  const [memories, setMemories] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadMemories() {
      setLoading(true)
      const { data, error } = await supabase
        .from('item_people')
        .select('item:items!inner(id, title, created_at, category:categories(name))')
        .eq('person_id', person.id)
        .eq('item.status', 'done')

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

  async function handleSave(fields) {
    await onUpdatePerson(person.id, fields)
    setEditing(false)
  }

  function handleDelete() {
    if (window.confirm(`Delete ${person.name}? This removes them from any memories they're tagged in.`)) {
      onDeletePerson(person.id)
      onClose()
    }
  }

  return (
    <Modal title={person.name} onClose={onClose}>
      {editing ? (
        <PersonForm
          initialName={person.name}
          initialBio={person.bio || ''}
          submitLabel="Save"
          onCancel={() => setEditing(false)}
          onSubmit={handleSave}
        />
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
              <div className="mt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="text-xs font-medium text-inkMuted underline hover:text-ink"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-xs font-medium text-inkMuted underline hover:text-[#D85A30]"
                >
                  Delete
                </button>
              </div>
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
