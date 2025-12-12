'use client'

import { useEffect, useState } from 'react'

interface NetworkStatus {
  online: boolean
  lastChanged: number
}

export const useNetworkStatus = (): NetworkStatus => {
  const [status, setStatus] = useState<NetworkStatus>({
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
    lastChanged: Date.now(),
  })

  useEffect(() => {
    const handleOnline = () =>
      setStatus({
        online: true,
        lastChanged: Date.now(),
      })

    const handleOffline = () =>
      setStatus({
        online: false,
        lastChanged: Date.now(),
      })

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return status
}

