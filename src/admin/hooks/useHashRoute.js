import { useCallback, useEffect, useState } from 'react'

function readHash(validIds, fallback) {
  const raw = window.location.hash.replace(/^#\/?/, '')
  return validIds.includes(raw) ? raw : fallback
}

export function useHashRoute(validIds, fallback) {
  const [activeId, setActiveId] = useState(() => readHash(validIds, fallback))

  useEffect(() => {
    const onChange = () => setActiveId(readHash(validIds, fallback))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [validIds, fallback])

  const navigate = useCallback((id) => {
    window.location.hash = `/${id}`
    setActiveId(id)
  }, [])

  return { activeId, navigate }
}
