'use client'

import React from 'react'
import NotificationBreadcrumb from './NotificationBreadcrumb'
import { useNotificationBreadcrumb } from '@/contexts/NotificationBreadcrumbContext'

export default function NotificationBreadcrumbWrapper() {
  const { notification, hideNotification } = useNotificationBreadcrumb()

  if (!notification) return null

  return (
    <NotificationBreadcrumb
      message={notification.message}
      type={notification.type}
      icon={notification.icon}
      dismissible={notification.dismissible}
      onDismiss={hideNotification}
    />
  )
}