'use client'

import React from 'react'
import VerificationHeader from '@/components/admin/VerificationHeader'
import OfflineBanner from '@/components/common/OfflineBanner'
import SecurityReminderBanner from '@/components/ui/SecurityReminderBanner'

export default function VerificationAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <OfflineBanner />
      <VerificationHeader />
      
      {/* Content row */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-y-auto mt-6 lg:mt-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
