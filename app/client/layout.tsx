'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import ClientHeader from '@/components/client/ClientHeader'
import ClientSidebar from '@/components/client/ClientSidebar'
import Footer from '@/components/ui/Footer'
import OfflineBanner from '@/components/common/OfflineBanner'
import SecurityReminderBanner from '@/components/ui/SecurityReminderBanner'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuthContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Redirect if not authenticated or wrong account type
  useEffect(() => {
    if (loading) return
    
    if (!isAuthenticated) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
        // If a token exists in storage, allow time for AuthContext to hydrate
        if (token) {
          return
        }
      } catch {}
      router.push('/auth/login?redirect=' + encodeURIComponent(pathname))
    } else {
      // Check if user has the right account type for client pages
      if (user?.accountType === 'vendor') {
        router.push('/vendor')
        return
      } else if (user?.accountType === 'admin') {
        router.push('/dashboard/admin')
        return
      } else if (user?.accountType && !['client', 'individual', 'business'].includes(user.accountType)) {
        // If user has an unrecognized account type, redirect to login
        router.push('/auth/login')
        return
      }
    }
  }, [loading, isAuthenticated, user, router, pathname])

  const handleLogout = async () => {
    // Note: Logout is handled by the Header component
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Apply client dashboard layout to ALL client pages
  if (pathname.startsWith('/client')) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <OfflineBanner />
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Full-width header */}
        <div className="w-full">
          <ClientHeader onMenuClick={() => setSidebarOpen(true)} />
        </div>
        
        <SecurityReminderBanner />
        
        {/* Main content area with sidebar */}
        <div className="flex flex-1 relative">
          {/* Sidebar - overlay on mobile, positioned on desktop */}
          <div className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
            lg:translate-x-0 lg:static lg:z-auto lg:w-64 lg:flex-shrink-0 lg:mx-4 lg:my-4
          `}>
            <ClientSidebar onClose={() => setSidebarOpen(false)} />
          </div>
          
          {/* Content area */}
          <main className="flex-1 px-4 lg:px-8 pt-[50px] pb-[50px]">
            {children}
          </main>
        </div>
        
        {/* Full-width footer */}
        <div className="w-full">
          <Footer />
        </div>
      </div>
    )
  }
  // Fallback for non-client pages
  return <>{children}</>
}
