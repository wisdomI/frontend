'use client'

import { AppProvider } from '@/contexts/AppContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { EventProvider } from '@/contexts/EventContext'
import { NotificationBreadcrumbProvider } from '@/contexts/NotificationBreadcrumbContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { Toaster } from 'sonner'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      <AuthProvider>
        <EventProvider>
          <NotificationBreadcrumbProvider>
            <FavoritesProvider>
              {children}
              <Toaster 
                position="top-right"
                richColors
                closeButton
                expand={false}
                duration={4000}
                toastOptions={{
                  style: {
                    zIndex: 9999,
                  },
                }}
              />
            </FavoritesProvider>
          </NotificationBreadcrumbProvider>
        </EventProvider>
      </AuthProvider>
    </AppProvider>
  )
}