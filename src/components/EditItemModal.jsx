import { useState } from 'react'
import Modal from './Modal'
import CategorySelect from './CategorySelect'
import PersonPicker from './PersonPicker'
import ImageUploadField from './ImageUploadField'
import { compressImage, uploadImage, deleteImage, pathFromUrl } from '../lib/storage'

export default function EditItemModal({
  item,
  color,
  categories,
  createCategory,
  people,
  taggedPeople,
  onTagPerson,
  onUntagPerson,
  onCreatePerson,
  onClose,
  onSubmit
}) {
  const [title, setTitle] = useState(item.title)
  const [categoryId, setCategoryId] = useState(item.category_id || '')
  const [newCategoryName, setNewCategoryName] = useState('')
  const [description, setDescription] = useState(item.description || '')
  const [link, setLink] = useState(item.link || '')
  const [addedBy, setAddedBy] = useState(item.added_by || '')
  const [memoryNote, setMemoryNote] = useState(item.memory_note || '')
  const [photoLink, setPhotoLink] = useState(item.photo_link || '')
  const [startDate, setStartDate] = useState(item.planned_start_date || '')
  const [endDate, setEndDate] = useState(item.planned_end_date || '')
  const [iconFile, setIconFile] = useState(null)
  const [iconPreview, setIconPreview] = useState(item.icon_image || null)
  const [iconRemoved, setIconRemoved] = useState(false)
  const [bannerFile, setBannerFile] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(item.banner_image || null)
  const [bannerRemoved, setBannerRemoved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const placeholder = {
    accent: color.accent,
    badgeBg: color.badgeBg,
    badgeText: color.badgeText,
    letter: item.title.trim().charAt(0).toUpperCase() || '✦'
  }

  function handleIconSelected(file) {
    setIconFile(file)
    setIconPreview(URL.createObjectURL(file))
    setIconRemoved(false)
  }

  function handleIconRemove() {
    setIconFile(null)
    setIconPreview(null)
    setIconRemoved(true)
  }

  function handleBannerSelected(file) {
    setBannerFile(file)
    setBannerPreview(URL.createObjectURL(file))
    setBannerRemoved(false)
  }

  function handleBannerRemove() {
    setBannerFile(null)
    setBannerPreview(null)
    setBannerRemoved(true)
  }

  async function resolveImage(file, removed, existingUrl, path, maxWidthOrHeight) {
    if (file) {
      const compressed = await compressImage(file, { maxWidthOrHeight })
      return uploadImage(path, compressed)
    }
    if (removed) {
      if (existingUrl) await deleteImage(pathFromUrl(existingUrl))
      return null
    }
    return existingUrl
  }

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

      const [iconImage, bannerImage] = await Promise.all([
        resolveImage(iconFile, iconRemoved, item.icon_image, `items/${item.id}/icon.jpg`, 600),
        resolveImage(bannerFile, bannerRemoved, item.banner_image, `items/${item.id}/banner.jpg`, 1600)
      ])

      await onSubmit(item.id, {
        title: title.trim(),
        description: description.trim() || null,
        link: link.trim() || null,
        category_id: finalCategoryId,
        added_by: addedBy.trim() || null,
        memory_note: memoryNote.trim() || null,
        photo_link: photoLink.trim() || null,
        planned_start_date: startDate || null,
        planned_end_date: endDate || null,
        icon_image: iconImage,
        banner_image: bannerImage
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
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Link (optional)
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Added by
          <input
            type="text"
            value={addedBy}
            onChange={(e) => setAddedBy(e.target.value)}
            className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink placeholder:text-inkMuted focus:border-ink focus:outline-none"
          />
        </label>

        <div className="flex flex-wrap gap-4 rounded-lg bg-tan p-3">
          <ImageUploadField
            label="Icon"
            previewUrl={iconPreview}
            placeholder={placeholder}
            aspect="aspect-square"
            onFileSelected={handleIconSelected}
            onRemove={handleIconRemove}
          />
          <ImageUploadField
            label="Banner"
            previewUrl={bannerPreview}
            placeholder={placeholder}
            aspect="aspect-[2/1]"
            onFileSelected={handleBannerSelected}
            onRemove={handleBannerRemove}
          />
        </div>

        {item.status === 'booked' && (
          <div className="flex flex-col gap-3 rounded-lg bg-tan p-3">
            <p className="text-xs font-medium text-inkMuted">Planned date</p>
            <label className="flex flex-col gap-1 text-sm font-medium text-ink">
              Start date
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink focus:border-ink focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-ink">
              End date (optional)
              <input
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-borderSoft bg-parchment px-3 py-2 text-sm font-normal text-ink focus:border-ink focus:outline-none"
              />
            </label>
          </div>
        )}

        {item.status === 'done' && (
          <div className="flex flex-col gap-3 rounded-lg bg-tan p-3">
            <p className="text-xs font-medium text-inkMuted">Memory</p>
            <label className="flex flex-col gap-1 text-sm font-medium text-ink">
              Memory note (optional)
              <textarea
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

            <div className="flex flex-col gap-1 text-sm font-medium text-ink">
              Tag people
              <PersonPicker
                people={people}
                taggedPeople={taggedPeople}
                onTag={(personId) => onTagPerson(item.id, personId)}
                onUntag={(personId) => onUntagPerson(item.id, personId)}
                onCreatePerson={onCreatePerson}
              />
            </div>
          </div>
        )}

        {error && <p className="text-sm text-[#D85A30]">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-lg border-2 border-ink px-4 py-2 text-sm font-medium text-ink transition hover:bg-ink hover:text-parchment disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </Modal>
  )
}
