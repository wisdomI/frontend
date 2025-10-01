'use client'

import { useState } from 'react'
import { FiEdit2, FiTrash2, FiEye, FiX } from 'react-icons/fi'
import CompareBidsModal from '@/components/ui/modals/CompareBidsModal'
import OfferSuccessModal from '@/components/ui/modals/OfferSuccessModal'
import ViewAllOffers from '@/components/client/ViewAllOffers'
import EditServiceRequestModal from '@/components/ui/modals/EditServiceRequestModal'
import DeleteConfirmationModal from '@/components/ui/modals/DeleteConfirmationModal'
import ClientPageHeader from '@/components/client/ClientPageHeader'

export default function ManageBidsPage() {
  const [activeTab, setActiveTab] = useState('service-request-posts')
  const [showCompareBids, setShowCompareBids] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successModalType, setSuccessModalType] = useState<'accept' | 'decline'>('accept')
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedOffer, setSelectedOffer] = useState<any>(null)

  // Edit and Delete modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit functionality
  const handleEditClick = (request: any) => {
    setSelectedRequest(request)
    setEditModalOpen(true)
  }

  const handleEditSave = (updatedRequest: any) => {
    // Update the service requests state
    setServiceRequests(prev => 
      prev.map(req => req.id === updatedRequest.id ? updatedRequest : req)
    )
    setEditModalOpen(false)
    setSelectedRequest(null)
  }

  // Delete functionality
  const handleDeleteClick = (request: any) => {
    setSelectedRequest(request)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedRequest) return
    
    setIsDeleting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setServiceRequests(prev => prev.filter(req => req.id !== selectedRequest.id))
    setDeleteModalOpen(false)
    setSelectedRequest(null)
    setIsDeleting(false)
  }

  const handleCloseModals = () => {
    setEditModalOpen(false)
    setDeleteModalOpen(false)
    setSelectedRequest(null)
  }

  const [serviceRequests, setServiceRequests] = useState([
    {
      id: 1,
      title: "Baby Linda's Birthday Party",
      image: "/images/party-setup.jpg",
      postedTime: "Posted 17 hours ago",
      eventType: "Social Event (Wedding, Birthday)",
      eventDate: "12th May, 2025",
      eventLocation: "Surulere, Lagos State",
      totalVisits: 120,
      numberOfGuests: 14,
      servicesNeeded: ["Small Chop Vendors", "Cake Bakers"],
      budget: "N100,000 - N200,000",
      additionalInfo: "We need milky flavoured cake and some Cherry as toppings",
      offersCount: 3
    },
    {
      id: 2,
      title: "Baby Linda's Birthday Party",
      image: "/images/party-setup.jpg",
      postedTime: "Posted 17 hours ago",
      eventType: "Social Event (Wedding, Birthday)",
      eventDate: "12th May, 2025",
      eventLocation: "Surulere, Lagos State",
      totalVisits: 120,
      numberOfGuests: 14,
      servicesNeeded: ["Small Chop Vendors", "Cake Bakers"],
      budget: "N100,000 - N200,000",
      additionalInfo: "We need milky flavoured cake and some Cherry as toppings",
      offersCount: 3
    },
    {
      id: 3,
      title: "Baby Linda's Birthday Party",
      image: "/images/party-setup.jpg",
      postedTime: "Posted 17 hours ago",
      eventType: "Social Event (Wedding, Birthday)",
      eventDate: "12th May, 2025",
      eventLocation: "Surulere, Lagos State",
      totalVisits: 120,
      numberOfGuests: 14,
      servicesNeeded: ["Small Chop Vendors", "Cake Bakers"],
      budget: "N100,000 - N200,000",
      additionalInfo: "We need milky flavoured cake and some Cherry as toppings",
      offersCount: 3
    }
  ])

  const bids = [
    {
      id: 1,
      vendorName: "Annieserve Catering",
      vendorLogo: "/images/annieserve-logo.jpg",
      proposal: "₦95,000",
      deliveryTimeline: "3 hours before event"
    },
    {
      id: 2,
      vendorName: "Pejaabs Catering",
      vendorLogo: "/images/pejaabs-logo.jpg",
      proposal: "₦75,000",
      deliveryTimeline: "2 hours before event"
    },
    {
      id: 3,
      vendorName: "Comfort Food Caterers",
      vendorLogo: "/images/comfort-food-logo.jpg",
      proposal: "₦115,000",
      deliveryTimeline: "4 hours before event"
    },
    {
      id: 4,
      vendorName: "Flavour Town Catering",
      vendorLogo: "/images/flavour-town-logo.jpg",
      proposal: "₦88,000",
      deliveryTimeline: "1 hour before event"
    }
  ]

  const offers = [
    {
      id: 1,
      vendorName: "UK Cakes & Cream",
      vendorLogo: "/images/uk-cakes-logo.jpg",
      vendorCategory: "Bakery",
      serviceDescription: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.",
      serviceImage: "/images/service-table-setup.jpg",
      location: "Victoria Island, Lagos",
      rating: 3,
      ratingPercentage: 60,
      offerAmount: "N200,000",
      totalBookings: 120,
      sentTime: "Sent 17 hours ago"
    },
    {
      id: 2,
      vendorName: "UK Cakes & Cream",
      vendorLogo: "/images/uk-cakes-logo.jpg",
      vendorCategory: "Bakery",
      serviceDescription: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.",
      serviceImage: "/images/service-table-setup.jpg",
      location: "Victoria Island, Lagos",
      rating: 3,
      ratingPercentage: 60,
      offerAmount: "N200,000",
      totalBookings: 120,
      sentTime: "Sent 17 hours ago"
    },
    {
      id: 3,
      vendorName: "UK Cakes & Cream",
      vendorLogo: "/images/uk-cakes-logo.jpg",
      vendorCategory: "Bakery",
      serviceDescription: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.",
      serviceImage: "/images/service-table-setup.jpg",
      location: "Victoria Island, Lagos",
      rating: 3,
      ratingPercentage: 60,
      offerAmount: "N200,000",
      totalBookings: 120,
      sentTime: "Sent 17 hours ago"
    },
    {
      id: 4,
      vendorName: "UK Cakes & Cream",
      vendorLogo: "/images/uk-cakes-logo.jpg",
      vendorCategory: "Bakery",
      serviceDescription: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.",
      serviceImage: "/images/service-table-setup.jpg",
      location: "Victoria Island, Lagos",
      rating: 3,
      ratingPercentage: 60,
      offerAmount: "N200,000",
      totalBookings: 120,
      sentTime: "Sent 17 hours ago"
    },
    {
      id: 5,
      vendorName: "UK Cakes & Cream",
      vendorLogo: "/images/uk-cakes-logo.jpg",
      vendorCategory: "Bakery",
      serviceDescription: "Offering diverse options including buffet-style, plated meals, food stations, live cooking stations, themed & custom menus, such as vegetarian, vegan, gluten-free, & allergy-friendly choices.",
      serviceImage: "/images/service-table-setup.jpg",
      location: "Victoria Island, Lagos",
      rating: 3,
      ratingPercentage: 60,
      offerAmount: "N200,000",
      totalBookings: 120,
      sentTime: "Sent 17 hours ago"
    }
  ]

  // Handler functions
  const handleViewOffers = (serviceTitle: string) => {
    setSelectedService(serviceTitle)
    setActiveTab('view-offers')
  }

  const handleCompareBids = () => {
    setShowCompareBids(true)
  }

  const handleAcceptOffer = (offerId: number) => {
    // Check if it's a bid or offer
    const bid = bids.find(b => b.id === offerId)
    const offer = offers.find(o => o.id === offerId)
    
    if (bid) {
      setSelectedOffer({ vendorName: bid.vendorName, offerAmount: bid.proposal })
    } else if (offer) {
      setSelectedOffer(offer)
    }
    
    setSuccessModalType('accept')
    setShowSuccessModal(true)
  }

  const handleRejectOffer = (offerId: number) => {
    // Check if it's a bid or offer
    const bid = bids.find(b => b.id === offerId)
    const offer = offers.find(o => o.id === offerId)
    
    if (bid) {
      setSelectedOffer({ vendorName: bid.vendorName, offerAmount: bid.proposal })
    } else if (offer) {
      setSelectedOffer(offer)
    }
    
    setSuccessModalType('decline')
    setShowSuccessModal(true)
  }

  const handleSendMessage = () => {
    // Navigate to messages or open chat
    setShowSuccessModal(false)
  }

  const handleGoToDashboard = () => {
    setActiveTab('service-request-posts')
    setShowSuccessModal(false)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ClientPageHeader
        breadcrumbs={[
          { label: 'My Account' },
          { label: 'Manage Bids' },
          { label: activeTab === 'view-offers' ? 'View all Offers' : 'Service Request Posts', isActive: true }
        ]}
        title={activeTab === 'view-offers' ? 'View all Offers' : 'Manage Bids'}
      />

      {/* Tabs */}
      <div className="mb-4 sm:mb-6">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 sm:space-x-8">
            <button
              onClick={() => setActiveTab('service-request-posts')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'service-request-posts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden xs:inline">Service Request Posts</span>
              <span className="xs:hidden">Posts</span>
            </button>
            <button
              onClick={() => setActiveTab('direct-service-request')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === 'direct-service-request'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="hidden xs:inline">Direct Service Request</span>
              <span className="xs:hidden">Direct Request</span>
            </button>
            {activeTab === 'view-offers' && (
              <>
                <button
                  onClick={() => setActiveTab('service-request-posts')}
                  className="py-2 px-1 border-b-2 font-medium text-xs sm:text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap"
                >
                  ← Back to Posts
                </button>
                <button
                  className="py-2 px-1 border-b-2 font-medium text-xs sm:text-sm border-blue-600 text-blue-600 whitespace-nowrap"
                >
                  View all Offers
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'view-offers' ? (
        <div>
          <ViewAllOffers
            serviceTitle={selectedService}
            offers={offers}
            onAcceptOffer={handleAcceptOffer}
            onRejectOffer={handleRejectOffer}
            onCompareAll={handleCompareBids}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {serviceRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:gap-6">
                {/* Left Column - Image and Engagement (full width on mobile, 1/3 on desktop) */}
                <div className="w-full lg:w-1/3 flex-shrink-0">
                  {/* Event Image */}
                  <div className="w-full h-32 sm:h-40 lg:h-48 bg-gray-200 rounded-lg mb-3 sm:mb-4 flex items-center justify-center relative">
                    <span className="text-gray-500 text-xs sm:text-sm">Event Image</span>
                    {/* Image carousel dots */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                      <div className="w-1 h-1 sm:w-2 sm:h-2 bg-blue-600 rounded-full"></div>
                      <div className="w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* Total Visit */}
                  <div className="mb-3 sm:mb-4">
                    <button className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-800">
                      <FiEye className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                      Total Visit: {request.totalVisits}
                    </button>
                  </div>

                  {/* View all Offers Button */}
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleViewOffers(request.title);
                    }}
                    className="w-full relative px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    type="button"
                  >
                    <FiEye className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm">View all Offers</span>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] sm:text-xs w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center">
                      {request.offersCount}
                    </span>
                  </button>
                </div>

                {/* Right Column - Event Details (full width on mobile, 2/3 on desktop) */}
                <div className="w-full lg:w-2/3 flex-shrink-0">
                  {/* Header with Title, Time, and Action Icons */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1">{request.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{request.postedTime}</p>
                    </div>
                    
                    {/* Action Icons */}
                    <div className="flex space-x-1 sm:space-x-2 ml-2 sm:ml-4">
                      <button 
                        onClick={() => handleEditClick(request)}
                        className="p-1.5 sm:p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        title="Edit service request"
                      >
                        <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteClick(request)}
                        className="p-1.5 sm:p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Delete service request"
                      >
                        <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 w-full sm:w-20 lg:w-32 shrink-0">Event Type:</span>
                      <span className="text-[10px] sm:text-xs lg:text-sm text-gray-600">{request.eventType}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 w-full sm:w-20 lg:w-32 shrink-0">Event Date:</span>
                      <span className="text-[10px] sm:text-xs lg:text-sm text-gray-600">{request.eventDate}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 w-full sm:w-20 lg:w-32 shrink-0">Event Location:</span>
                      <span className="text-[10px] sm:text-xs lg:text-sm text-gray-600">{request.eventLocation}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 w-full sm:w-20 lg:w-32 shrink-0">No. of Guests:</span>
                      <span className="text-[10px] sm:text-xs lg:text-sm text-gray-600">{request.numberOfGuests}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start">
                      <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 w-full sm:w-20 lg:w-32 mt-1 shrink-0">Services Needed:</span>
                      <div className="flex flex-wrap gap-1 sm:gap-2 mt-1 sm:mt-0">
                        {request.servicesNeeded.map((service, index) => (
                          <span key={index} className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-xs font-medium bg-blue-100 text-blue-800">
                            {service}
                            <FiX className="w-2 h-2 sm:w-3 sm:h-3 ml-1" />
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 w-full sm:w-20 lg:w-32 shrink-0">Budget:</span>
                      <span className="text-[10px] sm:text-xs lg:text-sm text-gray-600">{request.budget}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start">
                      <span className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 w-full sm:w-20 lg:w-32 mt-1 shrink-0">Additional Info:</span>
                      <span className="text-[10px] sm:text-xs lg:text-sm text-gray-600 flex-1">{request.additionalInfo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {activeTab !== 'view-offers' && (
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs sm:text-sm text-gray-700">Showing 1-10 of 20</p>
          <div className="flex items-center gap-1 sm:space-x-2">
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <span className="hidden sm:inline">&lt; Previous</span>
              <span className="sm:hidden">&lt;</span>
            </button>
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">2</button>
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors hidden sm:block">3</button>
            <span className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-500 hidden lg:block">...</span>
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors hidden lg:block">7</button>
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">10</button>
            <button className="px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <span className="hidden sm:inline">Next &gt;</span>
              <span className="sm:hidden">&gt;</span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CompareBidsModal
        isOpen={showCompareBids}
        onClose={() => setShowCompareBids(false)}
        serviceTitle={selectedService}
        bids={bids}
        onAcceptOffer={handleAcceptOffer}
        onRejectOffer={handleRejectOffer}
      />

      <OfferSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        type={successModalType}
        vendorName={selectedOffer?.vendorName || ''}
        offerAmount={selectedOffer?.offerAmount || ''}
        onSendMessage={handleSendMessage}
        onGoToDashboard={handleGoToDashboard}
      />

      {/* Edit and Delete Modals */}
      <EditServiceRequestModal
        isOpen={editModalOpen}
        onClose={handleCloseModals}
        serviceRequest={selectedRequest}
        onSave={handleEditSave}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirm}
        serviceTitle={selectedRequest?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  )
}
