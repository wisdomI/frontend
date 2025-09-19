'use client'

import { useState } from 'react'
import ServiceRequestCard from '@/components/vendors/ServiceRequestCard'
import FilterCard from '@/components/vendors/FilterCard'
import CounterOfferModal from '@/components/vendors/CounterOfferModal'
import { FiFilter } from 'react-icons/fi'

export default function ServiceRequestsPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'rejected' | 'accepted'>('rejected')
  const [showCounterOfferModal, setShowCounterOfferModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showFilter, setShowFilter] = useState(false)

  const serviceRequestsData = [
    {
      id: 1,
      status: 'active',
      clientName: 'Daniel Adebayo',
      clientAvatar: '/images/avatar1.jpg',
      eventTitle: 'Baby Linda\'s Birthday Party',
      rating: 4,
      totalBookings: 5,
      sentTime: 'Sent 17 hours ago',
      eventType: 'Social Event (Wedding, Birthday)',
      eventDate: '12th May, 2025',
      eventLocation: 'Surulere, Lagos State',
      guests: 14,
      servicesNeeded: 'Small Chops, Cake Bakers',
      budget: '₦100,000 - ₦199,000',
      additionalInfo:
        'We need milky flavoured cake and some Cherry as toppings',
    },
    {
      id: 2,
      status: 'active',
      clientName: 'Amaka Obi',
      clientAvatar: '/images/avatar2.jpg',
      eventTitle: 'Traditional Wedding Reception',
      rating: 5,
      totalBookings: 12,
      sentTime: 'Sent 2 days ago',
      eventType: 'Wedding Ceremony',
      eventDate: '22nd June, 2025',
      eventLocation: 'Enugu, Enugu State',
      guests: 150,
      servicesNeeded: 'Full Catering, Live Band, Decor',
      budget: '₦800,000 - ₦1,200,000',
      additionalInfo:
        'Decor should be traditional Igbo style with palm wine service.',
    },
    {
      id: 3,
      status: 'rejected',
      clientName: 'Daniel Adebayo',
      clientAvatar: '/images/avatar1.jpg',
      eventTitle: 'Baby Linda\'s Birthday Party',
      rating: 3,
      totalBookings: 5,
      sentTime: 'Sent 17 hours ago',
      eventType: 'Social Event (Wedding, Birthday)',
      eventDate: '12th May, 2025',
      eventLocation: 'Surulere, Lagos State',
      guests: 14,
      servicesNeeded: 'Small Chops, Cake Bakers',
      budget: '₦100,000 - ₦199,000',
      additionalInfo:
        'We need milky flavoured cake and some Cherry as toppings',
    },
    {
      id: 6,
      status: 'rejected',
      clientName: 'Daniel Adebayo',
      clientAvatar: '/images/avatar1.jpg',
      eventTitle: 'Baby Linda\'s Birthday Party',
      rating: 3,
      totalBookings: 5,
      sentTime: 'Sent 17 hours ago',
      eventType: 'Social Event (Wedding, Birthday)',
      eventDate: '12th May, 2025',
      eventLocation: 'Surulere, Lagos State',
      guests: 14,
      servicesNeeded: 'Small Chops, Cake Bakers',
      budget: '₦100,000 - ₦199,000',
      additionalInfo:
        'We need milky flavoured cake and some Cherry as toppings',
    },
    {
      id: 7,
      status: 'rejected',
      clientName: 'Daniel Adebayo',
      clientAvatar: '/images/avatar1.jpg',
      eventTitle: 'Baby Linda\'s Birthday Party',
      rating: 3,
      totalBookings: 5,
      sentTime: 'Sent 17 hours ago',
      eventType: 'Social Event (Wedding, Birthday)',
      eventDate: '12th May, 2025',
      eventLocation: 'Surulere, Lagos State',
      guests: 14,
      servicesNeeded: 'Small Chops, Cake Bakers',
      budget: '₦100,000 - ₦199,000',
      additionalInfo:
        'We need milky flavoured cake and some Cherry as toppings',
    },
    {
      id: 4,
      status: 'accepted',
      clientName: 'Fatima Bello',
      clientAvatar: '/images/avatar4.jpg',
      eventTitle: 'Naming Ceremony for Baby Aisha',
      rating: 4,
      totalBookings: 3,
      sentTime: 'Sent 3 days ago',
      eventType: 'Naming Ceremony',
      eventDate: '8th September, 2025',
      eventLocation: 'Kano, Kano State',
      guests: 50,
      servicesNeeded: 'Small Chops, Photographer',
      budget: '₦150,000 - ₦250,000',
      additionalInfo:
        'Photographer should deliver both soft copies and an album.',
    },
    {
      id: 5,
      status: 'accepted',
      clientName: 'John Peters',
      clientAvatar: '/images/avatar5.jpg',
      eventTitle: 'Silver Jubilee Anniversary',
      rating: 5,
      totalBookings: 20,
      sentTime: 'Sent 1 week ago',
      eventType: 'Anniversary Celebration',
      eventDate: '1st October, 2025',
      eventLocation: 'Abuja, FCT',
      guests: 300,
      servicesNeeded: 'Catering, Live Band, Sound System, Lighting',
      budget: '₦3,500,000 - ₦5,000,000',
      additionalInfo:
        'Event should have elegant white-and-gold theme with fireworks.',
    },
  ]

  const filteredRequests = serviceRequestsData.filter(request => {
    if (activeTab === 'active') return request.status === 'active'
    if (activeTab === 'rejected') return request.status === 'rejected'
    if (activeTab === 'accepted') return request.status === 'accepted'
    return true
  })

  const handleReject = (requestId: number) => {
    console.log(`Offer rejected for request ${requestId}`)
    // Update request status to rejected
  }

  const handleAccept = (requestId: number) => {
    console.log(`Offer accepted for request ${requestId}`)
    // Update request status to accepted
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
    { id: 'active', label: 'Client Requests', count: serviceRequestsData.filter(r => r.status === 'active').length },
    { id: 'rejected', label: 'Rejected Requests', count: serviceRequestsData.filter(r => r.status === 'rejected').length },
    { id: 'accepted', label: 'Accepted Requests', count: serviceRequestsData.filter(r => r.status === 'accepted').length },
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
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req, idx) => (
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
