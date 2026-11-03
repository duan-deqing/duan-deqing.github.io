import { useCallback, useEffect, useState } from 'react'
import { adminApi } from '../api'

export function useGitLog(limit = 20) {
  const [state, setState] = useState({ loading: true, data: null, error: '' })

  const load = useCallback(() => {
    let cancelled = false
    setState((prev) => ({ ...prev, loading: true, error: '' }))
    adminApi
      .getGitLog(limit)
      .then((data) => {
        if (!cancelled) setState({ loading: false, data, error: '' })
      })
      .catch((err) => {
        if (!cancelled) setState({ loading: false, data: null, error: err.message })
      })
    return () => {
      cancelled = true
    }
  }, [limit])

  useEffect(() => load(), [load])

  return { ...state, reload: load }
}
