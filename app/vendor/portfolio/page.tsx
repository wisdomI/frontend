'use client'

import React from 'react'
import PortfolioManager from '@/components/portfolio/PortfolioManager'

export default function VendorPortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <PortfolioManager isOwnPortfolio={true} />
      </div>
    </div>
  )
}
