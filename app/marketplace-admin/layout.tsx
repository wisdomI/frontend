'use client'

import React from 'react'
import MarketplaceAdminHeader from '@/components/admin/MarketplaceAdminHeader'
import OfflineBanner from '@/components/common/OfflineBanner'

export default function MarketplaceAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <OfflineBanner />
      <MarketplaceAdminHeader />
      
      {/* Content row */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 py-8">
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}
