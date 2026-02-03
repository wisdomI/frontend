'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminHeader from '@/components/admin/AdminHeader'
import SuperAdminSidebar from '@/components/admin/SuperAdminSidebar'
import OfflineBanner from '@/components/common/OfflineBanner'
import SecurityReminderBanner from '@/components/ui/SecurityReminderBanner'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Apply layout for super-admin pages
  if (pathname.startsWith('/super-admin')) {
    return (
      <div className="flex flex-col bg-gray-50 min-h-screen">
        <OfflineBanner />
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Mobile Hamburger Button */}
        <div className="lg:hidden px-4 pt-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar drawer */}
        <div
          className={`lg:hidden fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out w-72 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full p-4 flex flex-col items-center">
            <SuperAdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>

        {/* Content row */}
        <div className="flex flex-1 w-full px-4 lg:px-6 py-6 lg:py-8 gap-4">
          {/* Sidebar column (sticky under header) */}
          <div className="hidden lg:flex flex-col w-72">
            <div className="sticky top-24">
              <div className="flex flex-col gap-4">
                <SuperAdminSidebar onClose={() => setSidebarOpen(false)} />
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 overflow-y-auto mt-6 lg:mt-0">{children}</main>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
