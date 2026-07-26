import { useState } from 'react'
import Modal from './Modal'
import CategorySelect from './CategorySelect'

export default function AddItemModal({ categories, createCategory, currentName, onClose, onSubmit }) {
  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [link, setLink] = useState('')
  const [addedBy, setAddedBy] = useState(currentName || '')
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

      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        link: link.trim() || null,
        category_id: finalCategoryId,
        added_by: addedBy.trim() || null
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Add an item" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Title
          <input
            type="text"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Hike Torres del Paine"
            className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Category
          <CategorySelect
            categories={categories}
            value={categoryId}
            onChange={setCategoryId}
            newName={newCategoryName}
            onNewNameChange={setNewCategoryName}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Note (optional)
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Any details worth remembering"
            className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Link (optional)
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://…"
            className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Added by
          <input
            type="text"
            value={addedBy}
            onChange={(e) => setAddedBy(e.target.value)}
            placeholder="Your name"
            className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
          />
        </label>

        {error && <p className="text-sm text-[#D85A30]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-lg border-2 border-ink px-4 py-2 text-sm font-medium text-ink transition hover:bg-ink hover:text-parchment disabled:opacity-60"
        >
          {submitting ? 'Adding…' : 'Add to list'}
        </button>
      </form>
    </Modal>
  )
}
