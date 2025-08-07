'use client'

import { AppProvider } from '@/contexts/AppContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { EventProvider } from '@/contexts/EventContext'
import { NotificationBreadcrumbProvider } from '@/contexts/NotificationBreadcrumbContext'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      <AuthProvider>
        <EventProvider>
          <NotificationBreadcrumbProvider>
            {children}
          </NotificationBreadcrumbProvider>
        </EventProvider>
      </AuthProvider>
    </AppProvider>
  )
}