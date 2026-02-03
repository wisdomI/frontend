import { useState, useEffect } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { debugLog, debugError } from '@/lib/utils'

interface UseMessagesResult {
  messageCount: number
  loading: boolean
  error: string | null
}

export function useMessages(): UseMessagesResult {
  const { isAuthenticated } = useAuthContext()
  const [messageCount, setMessageCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setMessageCount(0)
      return
    }

    const fetchMessageCount = async () => {
      setLoading(true)
      setError(null)
      try {
        // TODO: Replace with actual API endpoint when available
        // For now, return 0 to indicate no hardcoded numbers
        debugLog('Fetching message count from API')
        setMessageCount(0)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch messages'
        debugError('Error fetching messages', message)
        setError(message)
        setMessageCount(0)
      } finally {
        setLoading(false)
      }
    }

    fetchMessageCount()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMessageCount, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  return { messageCount, loading, error }
}
