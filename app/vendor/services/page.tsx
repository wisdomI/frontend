'use client'

import React from 'react'
import ServiceManager from '@/components/services/ServiceManager'

export default function VendorServicesPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-asul">Service Offerings</h1>
        <p className="text-gray-600 mt-1">
          Keep your marketplace listings up-to-date so clients can quickly understand your expertise.
        </p>
      </div>

      <ServiceManager isOwnServices />
    </div>
  )
}
