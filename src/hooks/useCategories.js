import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { buildCategoryColorMap, MISC_COLOR } from '../lib/categoryColors'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) {
      console.error('Failed to load categories', error)
      return
    }
    setCategories(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()

    const channel = supabase
      .channel('categories-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, load)
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [load])

  const createCategory = useCallback(async (name) => {
    const trimmed = name.trim()
    if (!trimmed) return null

    const existing = categories.find((c) => c.name.toLowerCase() === trimmed.toLowerCase())
    if (existing) return existing

    const { data, error } = await supabase
      .from('categories')
      .insert({ name: trimmed })
      .select()
      .single()

    if (error) {
      // Another client may have created the same category concurrently.
      const { data: retry } = await supabase
        .from('categories')
        .select('*')
        .ilike('name', trimmed)
        .maybeSingle()
      if (retry) return retry
      console.error('Failed to create category', error)
      throw error
    }

    return data
  }, [categories])

  const colorMap = useMemo(() => buildCategoryColorMap(categories), [categories])
  const colorFor = useCallback((categoryId) => colorMap.get(categoryId) || MISC_COLOR, [colorMap])

  return { categories, loading, createCategory, colorFor }
}
