import { useCallback, useState } from 'react'

const STORAGE_KEY = 'bucket-list:name'

export function useLocalName() {
  const [name, setNameState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || ''
    } catch {
      return ''
    }
  })

  const setName = useCallback((value) => {
    const trimmed = value.trim()
    setNameState(trimmed)
    try {
      localStorage.setItem(STORAGE_KEY, trimmed)
    } catch {
      // localStorage unavailable (private browsing etc) — name just won't persist
    }
  }, [])

  return [name, setName]
}
