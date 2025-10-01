'use client'

import React, { useState } from 'react'
import ServiceRequestManager from '@/components/service-requests/ServiceRequestManager'
import { FiList, FiUser, FiCheckCircle, FiClock, FiCalendar } from 'react-icons/fi'

export default function ServiceRequestsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'my' | 'assigned' | 'open' | 'upcoming'>('all')

  const tabs = [
    { id: 'all', label: 'All Requests', icon: FiList },
    { id: 'my', label: 'My Requests', icon: FiUser },
    { id: 'assigned', label: 'Assigned', icon: FiCheckCircle },
    { id: 'open', label: 'Open', icon: FiClock },
    { id: 'upcoming', label: 'Upcoming', icon: FiCalendar },
  ] as const

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-gray-600 mt-2">Manage and track all service requests</p>
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
        <ServiceRequestManager viewType={activeTab} />
      </div>
    </div>
  )
}
