import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useComments() {
  const [comments, setComments] = useState([])

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) {
      console.error('Failed to load comments', error)
      return
    }
    setComments(data)
  }, [])

  useEffect(() => {
    load()

    const channel = supabase
      .channel('comments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, load)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  const byItem = useMemo(() => {
    const map = new Map()
    for (const row of comments) {
      const list = map.get(row.item_id) || []
      list.push(row)
      map.set(row.item_id, list)
    }
    return map
  }, [comments])

  const addComment = useCallback(async (itemId, name, body) => {
    const trimmedName = name.trim()
    const trimmedBody = body.trim()
    if (!trimmedName || !trimmedBody) return

    const { error } = await supabase
      .from('comments')
      .insert({ item_id: itemId, name: trimmedName, body: trimmedBody })
    if (error) {
      console.error('Failed to add comment', error)
      throw error
    }
  }, [])

  return { byItem, addComment }
}
