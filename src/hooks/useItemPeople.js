import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const SELECT = '*, person:people(id, name, photo, bio)'

export function useItemPeople() {
  const [rows, setRows] = useState([])

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('item_people').select(SELECT)
    if (error) {
      console.error('Failed to load tagged people', error)
      return
    }
    setRows(data)
  }, [])

  useEffect(() => {
    load()

    const channel = supabase
      .channel('item-people-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'item_people' }, load)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  const byItem = useMemo(() => {
    const map = new Map()
    for (const row of rows) {
      const list = map.get(row.item_id) || []
      list.push(row)
      map.set(row.item_id, list)
    }
    return map
  }, [rows])

  const tagPerson = useCallback(async (itemId, personId) => {
    const { error } = await supabase
      .from('item_people')
      .insert({ item_id: itemId, person_id: personId })
    // Ignore duplicate-tag conflicts (unique constraint) — already tagged is a no-op, not an error.
    if (error && error.code !== '23505') {
      console.error('Failed to tag person', error)
      throw error
    }
  }, [])

  const untagPerson = useCallback(async (itemId, personId) => {
    const { error } = await supabase
      .from('item_people')
      .delete()
      .eq('item_id', itemId)
      .eq('person_id', personId)
    if (error) {
      console.error('Failed to untag person', error)
      throw error
    }
  }, [])

  return { byItem, tagPerson, untagPerson }
}
