import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useInterest() {
  const [interest, setInterest] = useState([])

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('item_interest').select('*')
    if (error) {
      console.error('Failed to load interest', error)
      return
    }
    setInterest(data)
  }, [])

  useEffect(() => {
    load()

    const channel = supabase
      .channel('item-interest-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'item_interest' }, load)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  const byItem = useMemo(() => {
    const map = new Map()
    for (const row of interest) {
      const list = map.get(row.item_id) || []
      list.push(row)
      map.set(row.item_id, list)
    }
    return map
  }, [interest])

  const toggle = useCallback(async (itemId, name) => {
    const trimmed = name.trim()
    if (!trimmed) return

    const { data: existing } = await supabase
      .from('item_interest')
      .select('id')
      .eq('item_id', itemId)
      .eq('name', trimmed)
      .maybeSingle()

    if (existing) {
      const { error } = await supabase.from('item_interest').delete().eq('id', existing.id)
      if (error) console.error('Failed to remove interest', error)
    } else {
      const { error } = await supabase
        .from('item_interest')
        .insert({ item_id: itemId, name: trimmed })
      if (error) console.error('Failed to add interest', error)
    }
  }, [])

  return { byItem, toggle }
}
