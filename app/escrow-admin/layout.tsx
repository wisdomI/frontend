'use client'

import React, { useState } from 'react'
import EscrowAdminHeader from '@/components/admin/EscrowAdminHeader'
import EscrowAdminSidebar from '@/components/admin/EscrowAdminSidebar'
import OfflineBanner from '@/components/common/OfflineBanner'

export default function EscrowAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen">
      <OfflineBanner />
      <EscrowAdminHeader />
      
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
          <EscrowAdminSidebar onClose={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Content row */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-6">
        {/* Sidebar column (sticky under header) */}
        <div className="hidden lg:flex flex-col w-64 flex-shrink-0">
          <div className="sticky top-24">
            <EscrowAdminSidebar />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  )
}

