'use client'

import { useState } from 'react'
import { FiPlus, FiFilter, FiSearch } from 'react-icons/fi'
import BidManager from '@/components/bidding/BidManager'
import VendorPageHeader from '@/components/vendor/VendorPageHeader'

export default function VendorBiddingPage() {
  const [viewType, setViewType] = useState<'all' | 'my' | 'received'>('my')
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'my', label: 'My Bids', count: 0 },
    { id: 'received', label: 'Received Bids', count: 0 },
    { id: 'all', label: 'All Bids', count: 0 },
  ]

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <VendorPageHeader
        breadcrumbs={[{ label: 'Bidding', isActive: true }]}
        title="Bidding Management"
      />

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bids..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <FiFilter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <div className="inline-flex bg-[#0B2E6F] rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setViewType(tab.id as any)}
                className={`px-4 py-2 text-sm font-semibold rounded-md ${
                  viewType === tab.id ? 'bg-white text-[#0B2E6F]' : 'text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bid Manager */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <BidManager viewType={viewType} />
      </div>
    </div>
  )
}
