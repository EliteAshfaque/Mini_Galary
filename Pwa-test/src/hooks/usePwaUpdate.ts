import { useEffect, useState } from 'react'
import { applyPwaUpdate, subscribePwaUpdate } from '../pwa'

export function usePwaUpdate() {
  const [available, setAvailable] = useState(false)

  useEffect(() => {
    return subscribePwaUpdate(() => setAvailable(true))
  }, [])

  return {
    available,
    reload: () => {
      void applyPwaUpdate()
    },
  }
}
