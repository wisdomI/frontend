'use client'

import { useState, useEffect } from 'react'
import ServiceRequestCard from '@/components/vendors/ServiceRequestCard'
import FilterCard from '@/components/vendors/FilterCard'
import CounterOfferModal from '@/components/vendors/CounterOfferModal'
import { FiFilter } from 'react-icons/fi'
import { useApi } from '@/hooks/useApi'
import { vendorServiceRequestAPI } from '@/lib/api'

export default function ServiceRequestsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'rejected' | 'accepted'>('rejected')
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showFilter, setShowFilter] = useState(false)

  // API hooks
  const { data: apiServiceRequests, loading: serviceRequestsLoading, error: serviceRequestsError } = useApi(async () => {
    const response = await vendorServiceRequestAPI.getReceived()
    return response.data
  })
  
  // Transform API data to component format
  const transformServiceRequest = (request: any) => ({
    id: request.id,
    status: request.status,
    clientName: request.client?.firstName + ' ' + request.client?.lastName || 'Unknown Client',
    clientAvatar: request.client?.profilePicture || '/images/avatar1.jpg',
    eventTitle: request.eventTitle,
    rating: request.client?.rating || 4,
    totalBookings: request.client?.totalBookings || 0,
    sentTime: `Sent ${new Date(request.createdAt).toLocaleDateString()}`,
    eventType: request.eventType,
    eventDate: new Date(request.eventStartDate).toLocaleDateString(),
    eventLocation: request.eventLocation,
    guests: request.numberOfGuests,
    servicesNeeded: request.servicesNeeded?.join(', ') || 'Various Services',
    budget: request.budgetRange,
    additionalInfo: request.additionalInfo || '',
  })

  const serviceRequestsData = (apiServiceRequests || []).map(transformServiceRequest)

  const filteredRequests = serviceRequestsData.filter((request: any) => {
    if (activeTab === 'active') return request.status === 'active'
    if (activeTab === 'rejected') return request.status === 'rejected'
    if (activeTab === 'accepted') return request.status === 'accepted'
    return true
  })

  const handleReject = async (requestId: number) => {
    try {
      await vendorServiceRequestAPI.respond(requestId.toString(), { response: 'declined' })
      console.log(`Offer rejected for request ${requestId}`)
      // Refresh data would be handled by the useApi hook automatically
    } catch (error) {
      console.error('Error rejecting request:', error)
    }
  }

  const handleAccept = async (requestId: number) => {
    try {
      await vendorServiceRequestAPI.respond(requestId.toString(), { response: 'accepted' })
      console.log(`Offer accepted for request ${requestId}`)
      // Refresh data would be handled by the useApi hook automatically
    } catch (error) {
      console.error('Error accepting request:', error)
    }
  }

  const handleCounterOffer = (request: any) => {
    setSelectedRequest(request)
    setShowCounterOfferModal(true)
  }

  const handleCloseCounterOffer = () => {
    setShowCounterOfferModal(false)
    setSelectedRequest(null)
  }

  const tabs = [
    { id: 'active', label: 'Client Requests', count: serviceRequestsData.filter((r: any) => r.status === 'active').length },
    { id: 'rejected', label: 'Rejected Requests', count: serviceRequestsData.filter((r: any) => r.status === 'rejected').length },
    { id: 'accepted', label: 'Accepted Requests', count: serviceRequestsData.filter((r: any) => r.status === 'accepted').length },
  ]

  return (
    <div>
      {/* Header with Filter Toggle */}
      <div className="flex items-center justify-between p-3 sm:p-4 py-2 pt-3 sm:pt-4">
        <h2 className="font-bold text-lg sm:text-2xl lg:text-3xl text-gray-600">
          Service Request
        </h2>
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
          {serviceRequestsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading service requests...</p>
            </div>
          ) : serviceRequestsError ? (
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

        {/* Responsive filter sidebar */}
        <div className={`lg:sticky lg:top-20 w-full lg:w-auto transition-all duration-300 ${
          showFilter ? 'block' : 'hidden lg:block'
        }`}>
          <FilterCard />
        </div>

        {/* Modal overlay for mobile filter */}
        {showFilter && (
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
                <FilterCard />
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
