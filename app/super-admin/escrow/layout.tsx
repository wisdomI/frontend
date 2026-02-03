'use client'

import React from 'react'
import EscrowAdminNavbar from '@/components/admin/EscrowAdminNavbar'

export default function SuperAdminEscrowLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <EscrowAdminNavbar basePath="/super-admin/escrow" />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  )
}
