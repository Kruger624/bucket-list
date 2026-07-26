import { useState } from 'react'
import Modal from './Modal'
import CategorySelect from './CategorySelect'

export default function EditItemModal({ item, categories, createCategory, onClose, onSubmit }) {
  const [title, setTitle] = useState(item.title)
  const [categoryId, setCategoryId] = useState(item.category_id || '')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [description, setDescription] = useState(item.description || '')
  const [link, setLink] = useState(item.link || '')
  const [addedBy, setAddedBy] = useState(item.added_by || '')
  const [memoryNote, setMemoryNote] = useState(item.memory_note || '')
  const [photoLink, setPhotoLink] = useState(item.photo_link || '')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!categoryId && !newCategoryName.trim()) {
      setError('Please choose or create a category')
      return
    }

    setSubmitting(true)
    setError('')
    try {
      let finalCategoryId = categoryId
      if (!finalCategoryId && newCategoryName.trim()) {
        const category = await createCategory(newCategoryName)
        finalCategoryId = category.id
      }

      await onSubmit(item.id, {
        title: title.trim(),
        description: description.trim() || null,
        link: link.trim() || null,
        category_id: finalCategoryId,
        added_by: addedBy.trim() || null,
        memory_note: memoryNote.trim() || null,
        photo_link: photoLink.trim() || null
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Edit item" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Category
          <CategorySelect
            categories={categories}
            value={categoryId}
            onChange={setCategoryId}
            newName={newCategoryName}
            onNewNameChange={setNewCategoryName}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Note (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Link (optional)
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
          Added by
          <input
            type="text"
            value={addedBy}
            onChange={(e) => setAddedBy(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </label>

        {item.status === 'done' && (
          <div className="flex flex-col gap-3 rounded-lg bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Memory</p>
            <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
              Memory note (optional)
              <textarea
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
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </Modal>
  )
}
