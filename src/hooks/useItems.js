import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const ITEM_SELECT = '*, category:categories(id, name)'

export function useItems() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('items')
      .select(ITEM_SELECT)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load items', error)
      return
    }
    setItems(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()

    const channel = supabase
      .channel('items-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, load)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  const addItem = useCallback(async (payload) => {
    const { error } = await supabase.from('items').insert(payload)
    if (error) {
      console.error('Failed to add item', error)
      throw error
    }
  }, [])

  const updateItem = useCallback(async (id, patch) => {
    const { error } = await supabase.from('items').update(patch).eq('id', id)
    if (error) {
      console.error('Failed to update item', error)
      throw error
    }
  }, [])

  const deleteItem = useCallback(async (id) => {
    const { error } = await supabase.from('items').delete().eq('id', id)
    if (error) {
      console.error('Failed to delete item', error)
      throw error
    }
  }, [])

  return { items, loading, addItem, updateItem, deleteItem }
}
