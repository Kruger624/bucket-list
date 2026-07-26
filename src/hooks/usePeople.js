import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { compressImage, uploadImage, deleteImage, pathFromUrl } from '../lib/storage'

export function usePeople() {
  const [people, setPeople] = useState([])

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('people').select('*').order('name')
    if (error) {
      console.error('Failed to load people', error)
      return
    }
    setPeople(data)
  }, [])

  useEffect(() => {
    load()

    const channel = supabase
      .channel('people-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'people' }, load)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  const createPerson = useCallback(async (name, { bio, photoFile } = {}) => {
    const trimmedName = name.trim()
    if (!trimmedName) return null

    const id = crypto.randomUUID()
    let photoUrl = null

    if (photoFile) {
      const compressed = await compressImage(photoFile, { maxWidthOrHeight: 600 })
      photoUrl = await uploadImage(`people/${id}.jpg`, compressed)
    }

    const { data, error } = await supabase
      .from('people')
      .insert({ id, name: trimmedName, bio: bio?.trim() || null, photo: photoUrl })
      .select()
      .single()

    if (error) {
      console.error('Failed to create person', error)
      throw error
    }
    return data
  }, [])

  const updatePerson = useCallback(async (personId, { name, bio, photoFile, removePhoto } = {}) => {
    const patch = {}
    if (name !== undefined) patch.name = name.trim()
    if (bio !== undefined) patch.bio = bio.trim() || null

    if (photoFile) {
      const existing = people.find((p) => p.id === personId)
      if (existing?.photo) await deleteImage(pathFromUrl(existing.photo))
      const compressed = await compressImage(photoFile, { maxWidthOrHeight: 600 })
      patch.photo = await uploadImage(`people/${personId}.jpg`, compressed)
    } else if (removePhoto) {
      const existing = people.find((p) => p.id === personId)
      if (existing?.photo) await deleteImage(pathFromUrl(existing.photo))
      patch.photo = null
    }

    const { error } = await supabase.from('people').update(patch).eq('id', personId)
    if (error) {
      console.error('Failed to update person', error)
      throw error
    }
  }, [people])

  const deletePerson = useCallback(async (personId) => {
    const existing = people.find((p) => p.id === personId)
    if (existing?.photo) await deleteImage(pathFromUrl(existing.photo))

    // item_people.person_id has ON DELETE CASCADE, so tags are cleaned up automatically.
    const { error } = await supabase.from('people').delete().eq('id', personId)
    if (error) {
      console.error('Failed to delete person', error)
      throw error
    }
  }, [people])

  return { people, createPerson, updatePerson, deletePerson }
}
