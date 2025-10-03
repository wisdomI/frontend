'use client'

import { useState } from 'react'
import { FiPlus, FiFilter, FiSearch, FiCheckCircle, FiClock, FiPause, FiX } from 'react-icons/fi'
import { useProgressTracking } from '@/hooks/useProgressTracking'
import VendorPageHeader from '@/components/vendor/VendorPageHeader'

export default function VendorProgressTrackingPage() {
  const { trackers, loading, error } = useProgressTracking()
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'on-hold'>('all')
  const [showFilter, setShowFilter] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const tabs = [
    { id: 'all', label: 'All Projects', count: trackers.length },
    { id: 'active', label: 'Active', count: trackers.filter(t => t.status === 'in-progress').length },
    { id: 'completed', label: 'Completed', count: trackers.filter(t => t.status === 'completed').length },
    { id: 'on-hold', label: 'On Hold', count: trackers.filter(t => t.status === 'on-hold').length },
  ]

  const filteredTrackers = trackers.filter(tracker => {
    const matchesSearch = (tracker as any).title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (tracker as any).description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === 'all' || tracker.status === activeTab
    
    return matchesSearch && matchesTab
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FiCheckCircle className="w-4 h-4 text-green-500" />
      case 'in-progress':
        return <FiClock className="w-4 h-4 text-blue-500" />
      case 'on-hold':
        return <FiPause className="w-4 h-4 text-yellow-500" />
      default:
        return <FiX className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <VendorPageHeader
          breadcrumbs={[{ label: 'Progress Tracking', isActive: true }]}
          title="Progress Tracking"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <VendorPageHeader
          breadcrumbs={[{ label: 'Progress Tracking', isActive: true }]}
          title="Progress Tracking"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <VendorPageHeader
        breadcrumbs={[{ label: 'Progress Tracking', isActive: true }]}
        title="Progress Tracking"
      />

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search projects..."
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
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
              <FiPlus className="w-4 h-4 mr-2" />
              New Project
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <div className="inline-flex bg-[#0B2E6F] rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 text-sm font-semibold rounded-md ${
                  activeTab === tab.id ? 'bg-white text-[#0B2E6F]' : 'text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Trackers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-3 sm:p-4 lg:p-6">
          {filteredTrackers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiCheckCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500">
                {activeTab === 'all' 
                  ? 'No projects to display.'
                  : `No ${activeTab} projects found.`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrackers.map((tracker) => (
                <div key={tracker.id} className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {(tracker as any).title || 'Untitled Project'}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {(tracker as any).description || 'No description available'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {getStatusIcon(tracker.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tracker.status)}`}>
                        {tracker.status?.replace('-', ' ') || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Start Date:</span>
                      <span>{(tracker as any).startDate ? new Date((tracker as any).startDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>End Date:</span>
                      <span>{(tracker as any).endDate ? new Date((tracker as any).endDate).toLocaleDateString() : 'Not set'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Progress:</span>
                      <span>{(tracker as any).progressPercentage || 0}%</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        View Details
                      </button>
                      <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
