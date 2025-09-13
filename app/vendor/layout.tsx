'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import DashboardHeader from '@/components/vendors/DashboardHeader'
import Sidebar from '@/components/vendors/VendorSidebar'

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  // Only apply vendor dashboard layout to the main vendor page (/vendor)
  // Vendor profile pages (/vendor/[vendorId]) should use the main site layout
  if (pathname === '/vendor') {
    return (
      <div className="flex min-h-screen bg-gray-50">
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
          lg:translate-x-0 lg:static lg:inset-0
        `}>
          <Sidebar 
            onClose={() => setSidebarOpen(false)}
            isCollapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    )
  }
  
  // For vendor profile pages, just render children (they'll use main layout)
  return <>{children}</>
}
