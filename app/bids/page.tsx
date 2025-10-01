'use client'

import React, { useState } from 'react'
import BidManager from '@/components/bidding/BidManager'
import { FiList, FiUser, FiInbox } from 'react-icons/fi'

export default function BidsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'received'>('my')

  const tabs = [
    { id: 'my', label: 'My Bids', icon: FiUser },
    { id: 'received', label: 'Received Bids', icon: FiInbox },
    { id: 'all', label: 'All Bids', icon: FiList },
  ] as const

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Bidding System</h1>
          <p className="text-gray-600 mt-2">Manage bids and proposals</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <BidManager viewType={activeTab} />
      </div>
    </div>
  )
}
