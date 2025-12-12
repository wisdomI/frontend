'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import DashboardHeader from '@/components/vendors/DashboardHeader'
import Sidebar from '@/components/vendors/VendorSidebar'
import { useAuthContext } from '@/contexts/AuthContext'
import { useProfileCompletion } from '@/hooks/useProfileCompletion'
import OfflineBanner from '@/components/common/OfflineBanner'
import SecurityReminderBanner from '@/components/ui/SecurityReminderBanner'

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, isAuthenticated, loading } = useAuthContext()
  const { profileStatus } = useProfileCompletion()

  // Check authentication and profile setup
  useEffect(() => {
    if (loading) {
      return
    }

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.push('/auth/login?redirect=' + encodeURIComponent(pathname))
      return
    }

    // Check accountType from both context and localStorage (for race condition on first login)
    const storedAccountType = typeof window !== 'undefined' ? localStorage.getItem('userAccountType') : null
    const effectiveAccountType = user?.accountType || storedAccountType
    const normalizedAccountType = effectiveAccountType?.toLowerCase() || null
    const vendorAccountTypes = new Set(['vendor', 'event_vendor', 'vendor_account', 'vendor-user', 'vendor_user'])
    const isVendorAccount = normalizedAccountType ? vendorAccountTypes.has(normalizedAccountType) : false

    // Debug logging
    console.log('🔍 Vendor Layout - User accountType check:', {
      contextAccountType: user?.accountType,
      storedAccountType,
      effectiveAccountType,
      normalizedAccountType,
      isVendorAccount,
      user: user,
      isAuthenticated,
      pathname
    })

    // Check if user has vendor account type
    // Use effectiveAccountType which falls back to localStorage if context isn't updated yet
    if (normalizedAccountType && !isVendorAccount) {
      console.warn('⚠️ Vendor Layout: User accountType is not vendor:', normalizedAccountType)

      const clientAccountTypes = new Set(['client', 'individual', 'business'])
      const redirectPath = clientAccountTypes.has(normalizedAccountType) ? '/client/dashboard' : '/'

      if (pathname !== redirectPath) {
        router.replace(redirectPath)
      }
      return
    }
    
    // If accountType is not set in either place, log warning but allow access
    // (This handles edge cases during initial load)
    if (!normalizedAccountType) {
      console.warn('⚠️ Vendor Layout: User accountType is not set anywhere, but allowing access for now')
    }
    
    // Check if profile setup is required
    // Check if profile setup is required
    console.log('Vendor layout - Profile status:', profileStatus)
    console.log('Vendor layout - Is completed:', profileStatus.isCompleted)
    console.log('Vendor layout - Current pathname:', pathname)
    
    // TEMPORARY: Skip profile completion check for testing
    // if (!profileStatus.isCompleted && pathname !== '/vendor/profile-setup') {
    //   console.log('Vendor layout - Redirecting to profile setup')
    //   // Redirect to profile setup if not completed
    //   router.push('/vendor/profile-setup')
    //   return
    // }
  }, [isAuthenticated, loading, profileStatus, pathname, router, user])

  // Show loading state while checking authentication
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

  // Don't render the layout if not authenticated
  if (!isAuthenticated) {
    return null
  }
  
  // Apply vendor dashboard layout to ALL vendor pages
  if (pathname.startsWith('/vendor')) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0 lg:h-full
        `}>
          <Sidebar 
            onClose={() => setSidebarOpen(false)}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <OfflineBanner />
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
          <SecurityReminderBanner />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    )
  }
  
  // Fallback for non-vendor pages
  return <>{children}</>
}
