'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import Providers from '@/components/providers/Providers'
import NotificationContainer from '@/components/ui/NotificationContainer'
import NotificationBreadcrumbWrapper from '@/components/ui/NotificationBreadcrumbWrapper'
import Sidebar from '@/components/layouts/Sidebar'

export default function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname?.startsWith('/auth')
  const isVendorDashboardPage = pathname?.startsWith('/vendor')
  const isClientPage = pathname?.startsWith('/client')

  // For vendor dashboard pages, render only the children (they have their own layout)
  if (isVendorDashboardPage) {
    return (
      <Providers>
        {children}
      </Providers>
    )
  }

  // For client pages, render only the children (they have their own layout)
  if (isClientPage) {
    return (
      <Providers>
        {children}
      </Providers>
    )
  }

  return (
    <Providers>
      <div className="flex flex-col min-h-screen overflow-x-hidden">
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
