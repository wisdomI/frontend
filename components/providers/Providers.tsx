'use client'

import { AppProvider } from '@/contexts/AppContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { EventProvider } from '@/contexts/EventContext'
import { NotificationBreadcrumbProvider } from '@/contexts/NotificationBreadcrumbContext'
import { FilterProvider } from '@/contexts/FilterContext'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      <AuthProvider>
        <EventProvider>
          <NotificationBreadcrumbProvider>
            <FilterProvider>
              {children}
            </FilterProvider>
          </NotificationBreadcrumbProvider>
        </EventProvider>
      </AuthProvider>
    </AppProvider>
  )
}