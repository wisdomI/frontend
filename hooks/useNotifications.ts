import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { debugLog, debugError } from '@/lib/utils'

interface UseNotificationsResult {
  notificationCount: number
  loading: boolean
  error: string | null
}

export function useNotifications(): UseNotificationsResult {
  const { isAuthenticated } = useAuthContext()
  const [notificationCount, setNotificationCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setNotificationCount(0)
      return
    }

    const fetchNotificationCount = async () => {
      setLoading(true)
      setError(null)
      try {
        // TODO: Replace with actual API endpoint when available
        // For now, return 0 to indicate no hardcoded numbers
        debugLog('Fetching notification count from API')
        setNotificationCount(0)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch notifications'
        debugError('Error fetching notifications', message)
        setError(message)
        setNotificationCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchNotificationCount()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotificationCount, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  return { notificationCount, loading, error }
}
