'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface NotificationBreadcrumbData {
  message: string
  type?: 'info' | 'warning' | 'success' | 'error'
  icon?: 'shield' | 'info' | 'warning' | 'check' | 'alert'
  dismissible?: boolean
  autoHide?: boolean
  duration?: number
}

interface NotificationBreadcrumbContextType {
  notification: NotificationBreadcrumbData | null
  showNotification: (notification: NotificationBreadcrumbData) => void
  hideNotification: () => void
}

const NotificationBreadcrumbContext = createContext<NotificationBreadcrumbContextType | undefined>(undefined)

interface NotificationBreadcrumbProviderProps {
  children: ReactNode
}

export const NotificationBreadcrumbProvider: React.FC<NotificationBreadcrumbProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationBreadcrumbData | null>(null)

  const showNotification = (notificationData: NotificationBreadcrumbData) => {
    setNotification(notificationData)
    
    // Auto-hide if specified
    if (notificationData.autoHide) {
      const duration = notificationData.duration || 5000
      setTimeout(() => {
        setNotification(null)
      }, duration)
    }
  }

  const hideNotification = () => {
    setNotification(null)
  }

  const value: NotificationBreadcrumbContextType = {
    notification,
    showNotification,
    hideNotification,
  }

  return (
    <NotificationBreadcrumbContext.Provider value={value}>
      {children}
    </NotificationBreadcrumbContext.Provider>
  )
}

export const useNotificationBreadcrumb = (): NotificationBreadcrumbContextType => {
  const context = useContext(NotificationBreadcrumbContext)
  if (context === undefined) {
    throw new Error('useNotificationBreadcrumb must be used within a NotificationBreadcrumbProvider')
  }
  return context
}