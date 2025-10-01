'use client'

import React from 'react'
import ServiceManager from '@/components/services/ServiceManager'

export default function VendorServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <ServiceManager isOwnServices={true} />
      </div>
    </div>
  )
}
