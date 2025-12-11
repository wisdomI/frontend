'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Providers from '@/components/providers/Providers'
import NotificationContainer from '@/components/ui/NotificationContainer'
import NotificationBreadcrumbWrapper from '@/components/ui/NotificationBreadcrumbWrapper'
import Sidebar from '@/components/layouts/Sidebar'
import OfflineBanner from '@/components/common/OfflineBanner'
import SecurityReminderBanner from '@/components/ui/SecurityReminderBanner'

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const isVendorDashboardPage = pathname?.startsWith('/vendor')
  const isClientPage = pathname?.startsWith('/client')
  const isAdminPage = pathname?.startsWith('/admin')
  const isSuperAdminPage = pathname?.startsWith('/super-admin')
  const isVerificationAdminPage = pathname?.startsWith('/verification-admin')
  const isEscrowAdminPage = pathname?.startsWith('/escrow-admin')
  const isDisputeAdminPage = pathname?.startsWith('/dispute-admin')
  const isMarketplaceAdminPage = pathname?.startsWith('/marketplace-admin')
  const isCommunicationAdminPage = pathname?.startsWith('/communication-admin')
  const isHomePage = pathname === '/'

  // For admin pages, render only the admin app (admin has its own layout)
  if (isAdminPage || isSuperAdminPage || isVerificationAdminPage || isEscrowAdminPage || isDisputeAdminPage || isMarketplaceAdminPage || isCommunicationAdminPage) {
    return (
      <Providers>
        <OfflineBanner />
        {children}
      </Providers>
    )
  }

  // For vendor dashboard pages, render only the children (they have their own layout)
  if (isVendorDashboardPage) {
    return (
      <Providers>
        <OfflineBanner />
        {children}
      </Providers>
    )
  }

  // For client pages, render only the children (they have their own layout)
  if (isClientPage) {
    return (
      <Providers>
        <OfflineBanner />
        {children}
      </Providers>
    )
  }

  // For home page, render with full layout including sidebar
  if (isHomePage) {
    return (
      <Providers>
        <OfflineBanner />
        <div className="flex flex-col min-h-screen overflow-x-hidden">
          <Header />
          <NotificationBreadcrumbWrapper />
          <SecurityReminderBanner />
          
          {/* Main content area with sidebar - unified container and gutters */}
          <div className="flex flex-1 bg-gray-50 mt-4 sm:mt-6">
            <Sidebar />
            
            {/* Main content with consistent max-width container */}
            <main className="flex-1">
              <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </div>
          
          <Footer />
          <NotificationContainer />
        </div>
      </Providers>
    )
  }

  return (
    <Providers>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <OfflineBanner />
        <Header />
        <NotificationBreadcrumbWrapper />
        <div className="flex flex-1 px-8 bg-gray-50">
          {!isAuthPage && <Sidebar />}
          <main className={`flex-1 px-6 ${isAuthPage ? 'ml-0' : ''}`}>
            {children}
          </main>
        </div>
        <Footer />
        <NotificationContainer />
      </div>
    </Providers>
  )
}
