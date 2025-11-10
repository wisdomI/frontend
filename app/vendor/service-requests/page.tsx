'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import ServiceRequestCard from '@/components/vendors/ServiceRequestCard'
import FilterCard from '@/components/vendors/FilterCard'
import CounterOfferModal from '@/components/vendors/CounterOfferModal'
import VendorResponseList from '@/components/vendor/VendorResponseList'
import { FiFilter } from 'react-icons/fi'
import { useVendorServiceRequests } from '@/hooks/useVendorServiceRequests'
import { useServiceRequests } from '@/hooks/useServiceRequests'
import { useCategories } from '@/hooks/useCategories'
import { vendorServiceRequestAPI } from '@/lib/api'

export default function ServiceRequestsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'rejected' | 'accepted' | 'direct' | 'responses'>('active')
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showFilter, setShowFilter] = useState(false)
  
  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    location: '',
    budgetRange: '',
    eventType: ''
  })

  // Fetch general (assigned) requests and direct requests
  const { requests: assignedRequests, loading: assignedLoading, error: assignedError } = useServiceRequests({
    viewType: 'assigned',
    autoFetch: true,
  })

  const { requests: directRequests, loading: directLoading, error: directError } = useVendorServiceRequests({
    viewType: 'received',
    autoFetch: true,
  })
  
  // Categories hook - Get categories for mapping IDs to names
  const { categories } = useCategories({ autoFetch: true })
  
  // Function to map category IDs to category names
  const categoryMap = useMemo(() => {
    const map = new Map<string, string>()

    const traverse = (items: typeof categories) => {
      items?.forEach((category: any) => {
        if (category?.id) {
          map.set(category.id, category.name)
        }

        if (Array.isArray(category?.subcategories) && category.subcategories.length > 0) {
          traverse(category.subcategories)
        }
      })
    }

    traverse(categories)
    return map
  }, [categories])

  const getCategoryNames = useCallback((categoryIds: string[] | string): string[] => {
    if (!categoryIds) {
      return []
    }

    const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds]

    return ids
      .map((id) => {
        if (typeof id !== 'string') {
          return ''
        }

        const trimmed = id.trim()
        if (categoryMap.has(trimmed)) {
          return categoryMap.get(trimmed) || ''
        }

        // Fallback if backend already provides name
        return trimmed && !/^[0-9a-fA-F-]{36}$/.test(trimmed) ? trimmed : ''
      })
      .filter((name) => name.length > 0)
  }, [categoryMap])
  
  // Transform API data to component format - Memoized to prevent infinite re-renders
  const transformServiceRequest = useCallback((request: any) => {
    // Calculate time ago
    const createdAt = new Date(request.createdAt)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60))
    const sentTime = diffInHours < 24 ? `Sent ${diffInHours} hours ago` : `Sent ${Math.floor(diffInHours / 24)} days ago`
    
    return {
      id: request.id,
      status: request.status || 'open',
      clientName: request.client?.firstName && request.client?.lastName 
        ? `${request.client.firstName} ${request.client.lastName}` 
        : 'Unknown Client',
      clientAvatar: request.client?.profileImage || request.client?.displayPicture || request.client?.profilePicture || '/images/avatar1.jpg',
      eventTitle: request.eventTitle,
      rating: request.client?.rating || 3,
      totalBookings: request.client?.totalBookings || 0,
      sentTime: sentTime,
      eventType: request.eventType,
      eventDate: new Date(request.eventStartDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }),
      eventLocation: request.eventLocation,
      guests: request.numberOfGuests,
      servicesNeeded: getCategoryNames(request.servicesNeeded || []).join(', ') || 'Various Services',
      budget: request.budgetRange,
      additionalInfo: request.additionalInformation || '',
    }
  }, [getCategoryNames])

  const assignedRequestsData = useMemo(() => {
    return (assignedRequests || []).map(transformServiceRequest)
  }, [assignedRequests, transformServiceRequest])

  const directRequestsData = useMemo(() => {
    return (directRequests || []).map(transformServiceRequest)
  }, [directRequests, transformServiceRequest])

  // Apply filters and tab filtering
  const datasetForTab = activeTab === 'direct' ? directRequestsData : assignedRequestsData

  const filteredRequests = datasetForTab.filter((request: any) => {
    if (activeTab !== 'direct') {
      let passesTabFilter = false
      if (activeTab === 'active') {
        passesTabFilter = request.status === 'open' || request.status === 'in-progress' || request.status === 'pending'
      } else if (activeTab === 'rejected') {
        passesTabFilter = request.status === 'cancelled' || request.status === 'declined'
      } else if (activeTab === 'accepted') {
        passesTabFilter = request.status === 'completed' || request.status === 'accepted'
      }

      if (!passesTabFilter) return false
    }
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch = 
        request.eventTitle?.toLowerCase().includes(searchLower) ||
        request.clientName?.toLowerCase().includes(searchLower) ||
        request.eventLocation?.toLowerCase().includes(searchLower) ||
        request.additionalInfo?.toLowerCase().includes(searchLower)
      if (!matchesSearch) return false
    }
    
    // Date filter
    if (filters.date) {
      const requestDate = new Date(request.eventDate)
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      switch (filters.date) {
        case 'today':
          if (requestDate.toDateString() !== today.toDateString()) return false
          break
        case 'this-week':
          const weekStart = new Date(today)
          weekStart.setDate(today.getDate() - today.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          if (requestDate < weekStart || requestDate > weekEnd) return false
          break
        case 'this-month':
          if (requestDate.getMonth() !== now.getMonth() || requestDate.getFullYear() !== now.getFullYear()) return false
          break
        case 'next-month':
          const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          const nextMonthEnd = new Date(now.getFullYear(), now.getMonth() + 2, 0)
          if (requestDate < nextMonth || requestDate > nextMonthEnd) return false
          break
      }
    }
    
    // Location filter
    if (filters.location) {
      if (!request.eventLocation || !request.eventLocation.toLowerCase().includes(filters.location.toLowerCase())) return false
    }
    
    // Budget range filter
    if (filters.budgetRange) {
      const budget = request.budget
      switch (filters.budgetRange) {
        case 'under-100k':
          if (!budget.includes('20,000') && !budget.includes('49,000')) return false
          break
        case '100k-500k':
          if (!budget.includes('100,000') && !budget.includes('299,000')) return false
          break
        case '500k-1m':
          if (!budget.includes('500,000') && !budget.includes('999,000')) return false
          break
        case '1m-2m':
          if (!budget.includes('1,000,000') && !budget.includes('1,999,000')) return false
          break
        case 'over-2m':
          if (!budget.includes('2,000,000')) return false
          break
      }
    }
    
    // Event type filter
    if (filters.eventType) {
      if (!request.eventType || !request.eventType.toLowerCase().includes(filters.eventType.toLowerCase())) return false
    }
    
    return true
  })

  const handleReject = async (requestId: number) => {
    try {
      console.log(`🔍 Rejecting offer for request ${requestId}`)
      console.log(`🔍 Request ID type:`, typeof requestId)
      const response = await vendorServiceRequestAPI.respond(requestId.toString(), { response: 'declined' })
      console.log(`✅ Offer rejected successfully for request ${requestId}:`, response)
      
      // Show success message
      alert('Offer rejected successfully! The client will be notified.')
      
      // Refresh page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('❌ Error rejecting request:', error)
      alert('Failed to reject offer. Please try again.')
    }
  }

  const handleAccept = async (requestId: number) => {
    try {
      console.log(`🔍 Accepting offer for request ${requestId}`)
      console.log(`🔍 Request ID type:`, typeof requestId)
      const response = await vendorServiceRequestAPI.respond(requestId.toString(), { response: 'accepted' })
      console.log(`✅ Offer accepted successfully for request ${requestId}:`, response)
      
      // Show success message
      alert('Offer accepted successfully! The client will be notified.')
      
      // Refresh page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('❌ Error accepting request:', error)
      alert('Failed to accept offer. Please try again.')
    }
  }

  const handleCounterOffer = (request: any) => {
    console.log(`🔍 Opening counter offer modal for request:`, request)
    setSelectedRequest(request)
    setShowCounterOfferModal(true)
  }

  const handleCloseCounterOffer = () => {
    setShowCounterOfferModal(false)
    setSelectedRequest(null)
  }

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  const tabs = [
    { id: 'active', label: 'Client Requests', count: assignedRequestsData.filter((r: any) => ['open', 'in-progress', 'pending'].includes(r.status)).length },
    { id: 'direct', label: 'Direct Service Requests', count: directRequestsData.length },
    { id: 'rejected', label: 'Rejected Requests', count: assignedRequestsData.filter((r: any) => ['cancelled', 'declined'].includes(r.status)).length },
    { id: 'accepted', label: 'Accepted Requests', count: assignedRequestsData.filter((r: any) => ['completed', 'accepted'].includes(r.status)).length },
    { id: 'responses', label: 'My Responses', count: 0 }, // This will be updated by the VendorResponseList component
  ]

  return (
    <div>
      {/* Header with Filter Toggle */}
      <div className="flex items-center justify-between p-3 sm:p-4 py-2 pt-3 sm:pt-4">
        <h2 className="font-bold text-lg sm:text-2xl lg:text-3xl text-gray-600">
          Service Request
        </h2>
        {activeTab !== 'responses' && (
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="lg:hidden flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors"
            aria-label={showFilter ? "Hide filter" : "Show filter"}
          >
            <FiFilter className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">
              {showFilter ? 'Hide Filter' : 'Show Filter'}
            </span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="px-3 sm:px-4 pb-2">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 sm:px-6 py-2 sm:py-3 font-medium text-xs sm:text-sm border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-event-blue text-event-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row w-full p-4 gap-4">
        {/* Service requests list */}
        <div className="flex flex-col gap-3 flex-1 max-h-[calc(100vh-180px)] overflow-y-auto lg:pr-2 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-event-blue scrollbar-thumb-rounded-full hover:scrollbar-thumb-event-blue-hover lg:scrollbar lg:scrollbar-thin lg:scrollbar-track-gray-100 lg:scrollbar-thumb-event-blue lg:scrollbar-thumb-rounded-full lg:hover:scrollbar-thumb-event-blue-hover">
          {activeTab === 'responses' ? (
            <VendorResponseList 
              showStats={true}
              onResponseUpdate={(response) => {
                console.log('Response updated:', response)
                // Optionally refresh the service requests data
              }}
              onResponseDelete={(responseId) => {
                console.log('Response deleted:', responseId)
                // Optionally refresh the service requests data
              }}
            />
          ) : (activeTab === 'direct' ? directLoading : assignedLoading) ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading service requests...</p>
            </div>
          ) : (activeTab === 'direct' ? directError : assignedError) ? (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to load service requests</p>
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map((req: any, idx: any) => (
              <ServiceRequestCard
                key={req.id}
                id={req.id}
                status={req.status}
                clientName={req.clientName}
                clientAvatar={req.clientAvatar}
                eventTitle={req.eventTitle}
                rating={req.rating}
                totalBookings={req.totalBookings}
                sentTime={req.sentTime}
                eventType={req.eventType}
                eventDate={req.eventDate}
                eventLocation={req.eventLocation}
                guests={req.guests}
                servicesNeeded={req.servicesNeeded}
                budget={req.budget}
                additionalInfo={req.additionalInfo}
                onReject={() => handleReject(req.id)}
                onAccept={() => handleAccept(req.id)}
                onCounterOffer={() => handleCounterOffer(req)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium mb-2">No {activeTab} requests</h3>
              <p className="text-sm">There are currently no {activeTab} service requests.</p>
            </div>
          )}
        </div>

        {/* Responsive filter sidebar - Hide for responses tab */}
        {activeTab !== 'responses' && (
          <div className={`lg:sticky lg:top-20 w-full lg:w-auto transition-all duration-300 ${
            showFilter ? 'block' : 'hidden lg:block'
          }`}>
            <FilterCard filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
        )}

        {/* Modal overlay for mobile filter - Hide for responses tab */}
        {showFilter && activeTab !== 'responses' && (
          <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
                <button
                  onClick={() => setShowFilter(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close filter"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <FilterCard filters={filters} onFiltersChange={handleFiltersChange} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Counter Offer Modal */}
      {showCounterOfferModal && selectedRequest && (
        <CounterOfferModal
          request={selectedRequest}
          onClose={handleCloseCounterOffer}
          onSubmit={(offerData: any) => {
            console.log('Counter offer submitted:', offerData)
            handleCloseCounterOffer()
          }}
        />
      )}
    </div>
  )
}
