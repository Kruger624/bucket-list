import imageCompression from 'browser-image-compression'
import { supabase } from './supabaseClient'

const BUCKET = 'media'

// Resizes + compresses in the browser before upload, capping around 800KB.
// Always converts to JPEG so storage paths/extensions stay predictable
// regardless of the source format (HEIC, PNG, etc).
export async function compressImage(file, { maxWidthOrHeight = 1024 } = {}) {
  return imageCompression(file, {
    maxSizeMB: 0.8,
    maxWidthOrHeight,
    fileType: 'image/jpeg',
    useWebWorker: true
  })
}

export async function uploadImage(path, file) {
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    upsert: true,
    contentType: 'image/jpeg'
  })
  if (error) {
    console.error('Failed to upload image', error)
    throw error
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteImage(path) {
  if (!path) return
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) console.error('Failed to delete image', error)
}

// Storage paths are stored as the plain path (e.g. "people/<id>.jpg"), not
// the full public URL, so bucket renames/host changes don't break old rows.
export function pathFromUrl(url) {
  if (!url) return null
  const marker = `/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  return idx === -1 ? null : url.slice(idx + marker.length)
}
