import { useState, useEffect, useCallback } from 'react'
import { useAuthContext } from '@/contexts/AuthContext'
import { notificationAPI } from '@/lib/api'
import { Notification } from '@/types/api'

interface UseNotificationsResult {
  notificationCount: number
  notifications: Notification[]
  loading: boolean
  error: string | null
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: () => Promise<void>
}

export function useNotifications(): UseNotificationsResult {
  const { isAuthenticated, user } = useAuthContext()
  const [notificationCount, setNotificationCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotificationCount(0)
      setNotifications([])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await notificationAPI.getAll()
      const fetchedNotifications = response.data.data || []
      setNotifications(fetchedNotifications)
      setNotificationCount(fetchedNotifications.filter((n: Notification) => !n.isRead).length)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch notifications'
      setError(message)
      setNotificationCount(0)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  const markAsRead = async (id: string) => {
    try {
      await notificationAPI.markAsRead(id)
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      )
      setNotificationCount(prev => Math.max(0, prev - 1))
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead()
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setNotificationCount(0)
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  return { 
    notificationCount, 
    notifications,
    loading, 
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  }
}
