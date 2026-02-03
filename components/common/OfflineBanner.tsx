'use client'

import { useEffect, useState } from 'react'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import { logWarn } from '@/lib/logger'

interface OfflineBannerProps {
  className?: string
}

export default function OfflineBanner({ className }: OfflineBannerProps) {
  const { online } = useNetworkStatus()
  const [visible, setVisible] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!hasMounted) return
    setVisible(!online)
    if (!online) {
      logWarn('App offline - showing offline banner')
    }
  }, [online, hasMounted])

  if (!hasMounted || !visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full bg-amber-100 border-b border-amber-200 text-amber-900 text-sm px-4 py-2 flex items-center gap-2 ${className ?? ''}`}
    >
      <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
      You’re currently offline. We’ll automatically retry once your connection is restored.
    </div>
  )
}

