'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { FiEdit2, FiTrash2, FiEye, FiX } from 'react-icons/fi'
import Image from 'next/image'
import CompareBidsModal from '@/components/ui/modals/CompareBidsModal'
import OfferSuccessModal from '@/components/ui/modals/OfferSuccessModal'
import ViewAllOffers from '@/components/client/ViewAllOffers'
import EditServiceRequestModal from '@/components/ui/modals/EditServiceRequestModal'
import DeleteConfirmationModal from '@/components/ui/modals/DeleteConfirmationModal'
import ClientPageHeader from '@/components/client/ClientPageHeader'
import { serviceRequestAPI, bidAPI, notificationAPI, vendorServiceRequestAPI } from '@/lib/api'
import { ServiceRequest, Bid } from '@/types/api'
import { toast } from 'react-hot-toast'
import { useAuthContext } from '@/contexts/AuthContext'
import { useVendorServiceRequests } from '@/hooks/useVendorServiceRequests'

type RequestWithSource = ServiceRequest & {
  requestSource?: 'marketplace' | 'direct'
  bidCount?: number
  bids?: Bid[]
}

const toFormData = (payload: Record<string, any>) => {
  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null) {
          formData.append(`${key}[]`, typeof item === 'string' ? item : JSON.stringify(item))
        }
      })
    } else {
      const formattedValue =
        typeof value === 'string' || value instanceof Blob ? value : JSON.stringify(value)
      formData.append(key, formattedValue)
    }
  })
  return formData
}

export default function ManageBidsPage() {
  const { user } = useAuthContext()
  const [activeTab, setActiveTab] = useState('service-request-posts')
  const [showCompareBids, setShowCompareBids] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successModalType, setSuccessModalType] = useState<'accept' | 'decline'>('accept')
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedServiceRequestId, setSelectedServiceRequestId] = useState<string>('')
  const [selectedOffer, setSelectedOffer] = useState<any>(null)
  const [offers, setOffers] = useState<any[]>([])
  const [loadingOffers, setLoadingOffers] = useState(false)

  // Edit and Delete modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<RequestWithSource | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // API state
  const [serviceRequests, setServiceRequests] = useState<RequestWithSource[]>([])
  const [directRequests, setDirectRequests] = useState<RequestWithSource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    requests: directServiceRequestsData,
    loading: directRequestsLoading,
    error: directRequestsError,
  } = useVendorServiceRequests({ viewType: 'my', autoFetch: true })

  // Fetch service requests from API
  useEffect(() => {
    const fetchServiceRequests = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        setError(null)

        const normalizedAccountType = (user.accountType || '').toLowerCase()
        const isVendorAccount = ['vendor', 'business', 'organization'].includes(normalizedAccountType)

        const response = isVendorAccount
          ? await serviceRequestAPI.getAll()
          : await serviceRequestAPI.getMy()
        const requests = response.data.data || []
        
        // Check if service requests already include bids or bid counts
        // If not, try to fetch bids (but handle 403 gracefully)
        const requestsWithBids = requests.map((request: any) => {
          // Check if bids are already included in the response
          const existingBids = request.bids || []
          const existingBidCount = request.bidCount || request.bidsCount || existingBids.length || 0
          
          return {
            ...request,
            bids: existingBids,
            bidCount: existingBidCount,
            requestSource: 'marketplace' as const,
          }
        })
        
        if (isVendorAccount) {
          try {
            const bidsResponse = await bidAPI.getAll()
            const allBids: Bid[] = bidsResponse.data.data || []
            
            const bidsByServiceRequest = new Map<string, Bid[]>()
            allBids.forEach((bid: Bid) => {
              const serviceRequestId = bid.serviceRequestId
              if (!bidsByServiceRequest.has(serviceRequestId)) {
                bidsByServiceRequest.set(serviceRequestId, [])
              }
              bidsByServiceRequest.get(serviceRequestId)!.push(bid)
            })
            
            requestsWithBids.forEach((request: any) => {
              const fetchedBids = bidsByServiceRequest.get(request.id) || []
              if (fetchedBids.length > 0) {
                request.bids = fetchedBids
                request.bidCount = fetchedBids.length
              }
            })
          } catch (err: any) {
            if (err?.response?.status !== 403) {
              console.debug('Could not fetch bids:', err)
            }
          }
        }
        
        setServiceRequests(requestsWithBids)
      } catch (err) {
        setError('Failed to fetch service requests')
        console.error('Error fetching service requests:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceRequests()
  }, [user?.id, user?.accountType])

  // Sync direct (one-to-one) service requests the client created
  useEffect(() => {
    if (!directServiceRequestsData) return

    const normalizedDirectRequests = directServiceRequestsData.map((request: any) => ({
      ...request,
      bidCount:
        request.bidCount ||
        request.bidsCount ||
        request.vendorResponses?.length ||
        (request as any)?.responsesCount ||
        0,
      bids: request.bids || request.vendorResponses || [],
      requestSource: 'direct' as const,
    }))

    setDirectRequests(normalizedDirectRequests)
  }, [directServiceRequestsData])

  // Refresh bid counts when new bids are received (polling)
  useEffect(() => {
    if (!user?.id || (serviceRequests.length === 0 && directRequests.length === 0)) return

    const refreshBidCounts = async () => {
      try {
        // Try to refresh service requests which may include updated bid counts
        try {
          const normalizedAccountType = (user.accountType || '').toLowerCase()
          const isVendorAccount = ['vendor', 'business', 'organization'].includes(normalizedAccountType)
          const response = isVendorAccount
            ? await serviceRequestAPI.getAll()
            : await serviceRequestAPI.getMy()
          const requests = response.data.data || []
          
          // Update requests with new bid counts from service request response
          const updatedRequests = serviceRequests.map((existingRequest: any) => {
            const updatedRequest = requests.find((r: any) => r.id === existingRequest.id) as any
            if (updatedRequest) {
              const existingBids = updatedRequest.bids || []
              const existingBidCount = updatedRequest.bidCount || updatedRequest.bidsCount || existingBids.length || 0
              return {
                ...existingRequest,
                ...updatedRequest,
                bids: existingBids,
                bidCount: existingBidCount
              }
            }
            return existingRequest
          })
          
          setServiceRequests(updatedRequests)
        } catch (err) {
          console.debug('Could not refresh service requests:', err)
        }
      } catch (err) {
        console.debug('Could not refresh bid counts:', err)
      }
    }

    // Check for new bid notifications and refresh counts
    const checkForNewBids = async () => {
      try {
        const response = await notificationAPI.getAll()
        const notifications = response.data.data || []
        const hasNewBidNotifications = notifications.some(
          (notif: any) => notif.type === 'new_bid' && !notif.isRead
        )
        
        if (hasNewBidNotifications) {
          await refreshBidCounts()
        }
      } catch (err) {
        console.debug('Could not check notifications:', err)
      }
    }

    // Check every 30 seconds
    const interval = setInterval(checkForNewBids, 30000)
    return () => clearInterval(interval)
  }, [user?.id, serviceRequests.length, directRequests.length])

  // Transform Bid to Offer format
  const transformBidToOffer = useCallback((bid: Bid, index: number): any => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount)
    }

    const formatTimeAgo = (dateString: string) => {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
      
      if (diffInSeconds < 60) return 'Just now'
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`
      return date.toLocaleDateString()
    }

    const rawAmount = typeof bid.bidAmount === 'number' ? bid.bidAmount : Number(bid.bidAmount)

    return {
      id: parseInt(bid.id.replace(/-/g, '').substring(0, 10), 16) || index + 1, // Convert string ID to number for compatibility
      bidId: bid.id, // Keep original string ID
      vendorName: (bid as any).vendor?.businessName || (bid as any).vendor?.firstName || 'Vendor',
      vendorLogo: (bid as any).vendor?.profilePicture || '/images/avatar1.jpg',
      vendorCategory: (bid as any).vendor?.category || 'Service Provider',
      serviceDescription: bid.proposedDetails || 'No description provided',
      serviceImage: bid.images?.[0] || '/images/placeholder-service.jpg',
      location: (bid as any).serviceRequest?.eventLocation || (bid as any).serviceRequest?.eventCity || 'Location TBD',
      rating: (bid as any).vendor?.rating || 4.5,
      ratingPercentage: Math.round(((bid as any).vendor?.rating || 4.5) * 20),
      offerAmount: formatCurrency(rawAmount || 0),
      offerAmountRaw: rawAmount || 0,
      totalBookings: (bid as any).vendor?.totalBookings || 0,
      sentTime: formatTimeAgo(bid.createdAt),
      status: bid.status,
      startDate: bid.startDate,
      endDate: bid.endDate,
      additionalServices: bid.additionalServices || [],
    }
  }, [])

  const combinedRequests = useMemo(() => [...serviceRequests, ...directRequests], [serviceRequests, directRequests])

  const buildModalServiceRequest = useCallback(
    (request: RequestWithSource) => ({
      id: request.id,
      title: request.eventTitle || (request as any).title || '',
      image: (request as any).image || (request as any).eventImage || '/images/party-setup.jpg',
      postedTime: request.createdAt || (request as any).postedTime || '',
      eventType: request.eventType,
      eventDate: request.eventStartDate || (request as any).eventDate || '',
      eventLocation: request.eventLocation || '',
      totalVisits: (request as any).totalVisits || (request as any).viewCount || 0,
      numberOfGuests: request.numberOfGuests || 0,
      servicesNeeded: request.servicesNeeded || [],
      budget: request.budgetRange || (request as any).budget || '',
      additionalInfo: request.additionalInformation || (request as any).additionalInfo || '',
      offersCount: request.bidCount || 0,
    }),
    []
  )

  const updateBidCountForRequest = useCallback((serviceRequestId: string, count: number) => {
    setServiceRequests(prev =>
      prev.map((request: any) =>
        request.id === serviceRequestId ? { ...request, bidCount: count, bids: request.bids } : request
      )
    )
    setDirectRequests(prev =>
      prev.map((request: any) =>
        request.id === serviceRequestId ? { ...request, bidCount: count, bids: request.bids } : request
      )
    )
  }, [])

  // Fetch bids for selected service request
  const fetchBidsForServiceRequest = useCallback(async (serviceRequestId: string) => {
    try {
      setLoadingOffers(true)
      
      // First, try to get bids from the service request if already loaded
      const serviceRequest = combinedRequests.find(req => req.id === serviceRequestId)
      if (serviceRequest && (serviceRequest as any).bids && Array.isArray((serviceRequest as any).bids)) {
        const bids = (serviceRequest as any).bids as Bid[]
        if (bids.length > 0) {
          const transformedOffers = bids.map((bid: Bid, index: number) => transformBidToOffer(bid, index))
          setOffers(transformedOffers)
          console.log('📋 Using cached bids for service request:', { serviceRequestId, bidsCount: bids.length })
          return
        }
      }
      
      // Try to fetch the specific service request which might include bids
      try {
        const response = await serviceRequestAPI.getById(serviceRequestId)
        const requestData: any = response.data.data
        if (requestData?.bids && Array.isArray(requestData.bids) && requestData.bids.length > 0) {
          const bids = requestData.bids as Bid[]
          const transformedOffers = bids.map((bid: Bid, index: number) => transformBidToOffer(bid, index))
          setOffers(transformedOffers)
          console.log('📋 Fetched bids from service request:', { serviceRequestId, bidsCount: bids.length })
          updateBidCountForRequest(serviceRequestId, bids.length)
          return
        }
      } catch (err) {
        console.debug('Could not fetch service request with bids:', err)
      }

      // Try to fetch bids via detailed endpoint accessible to clients
      try {
        const response = await bidAPI.getWithDetails({ serviceRequestId } as any)
        const bids: Bid[] = response.data.data || []
        if (bids.length > 0) {
          const transformedOffers = bids.map((bid: Bid, index: number) => transformBidToOffer(bid, index))
          setOffers(transformedOffers)
          console.log('📋 Fetched bids with details:', { serviceRequestId, bidsCount: bids.length })
          updateBidCountForRequest(serviceRequestId, bids.length)
          return
        }
      } catch (err: any) {
        if (err?.response?.status !== 403) {
          console.debug('Could not fetch bids with details:', err)
        }
      }
      
      // Last resort: fetch vendor responses for this service request (accessible to request owners)
      try {
        const response = await serviceRequestAPI.getVendorResponses(serviceRequestId)
        const vendorResponses: Bid[] = response.data.data || []
        if (vendorResponses.length > 0) {
          const transformedOffers = vendorResponses.map((bid: Bid, index: number) => transformBidToOffer(bid, index))
          setOffers(transformedOffers)
          console.log('📋 Fetched bids via vendor responses:', { serviceRequestId, bidsCount: vendorResponses.length })
          updateBidCountForRequest(serviceRequestId, vendorResponses.length)
          return
        }
      } catch (err) {
        console.debug('Could not fetch vendor responses for bids:', err)
      }
      
      // If we get here, no bids were found
      setOffers([])
      updateBidCountForRequest(serviceRequestId, 0)
      console.log('📋 No bids found for service request:', serviceRequestId)
    } catch (err: any) {
      console.error('Error fetching bids:', err)
      setOffers([])
    } finally {
      setLoadingOffers(false)
    }
  }, [combinedRequests, transformBidToOffer, updateBidCountForRequest])

  const handleEditClick = (request: RequestWithSource) => {
    setSelectedRequest(request)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (request: RequestWithSource) => {
    setSelectedRequest(request)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedRequest) return
    setIsDeleting(true)
    
    try {
      if (selectedRequest.requestSource === 'direct') {
        await vendorServiceRequestAPI.delete(selectedRequest.id)
        setDirectRequests(prev => prev.filter(req => req.id !== selectedRequest.id))
      } else {
        await serviceRequestAPI.delete(selectedRequest.id)
        setServiceRequests(prev => prev.filter(req => req.id !== selectedRequest.id))
      }
      setDeleteModalOpen(false)
      setSelectedRequest(null)
      toast.success('Service request deleted')
    } catch (err: any) {
      console.error('Error deleting service request:', err)
      const message =
        err?.response?.status === 403
          ? 'You do not have permission to delete this service request.'
          : err?.response?.data?.message || 'Failed to delete service request.'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseModals = () => {
    setEditModalOpen(false)
    setDeleteModalOpen(false)
    setSelectedRequest(null)
  }

  const modalServiceRequest = useMemo(
    () => (selectedRequest ? buildModalServiceRequest(selectedRequest) : null),
    [selectedRequest, buildModalServiceRequest]
  )

  const handleModalSave = useCallback(
    async (updatedModalRequest: any) => {
      if (!selectedRequest) return

      const requestId = selectedRequest.id
      const mergedPayload = {
        eventTitle: updatedModalRequest.title || selectedRequest.eventTitle,
        eventType: updatedModalRequest.eventType || selectedRequest.eventType,
        eventStartDate: selectedRequest.eventStartDate,
        eventEndDate: selectedRequest.eventEndDate,
        eventLocation: selectedRequest.eventLocation,
        eventCity: selectedRequest.eventCity,
        servicesNeeded:
          updatedModalRequest.servicesNeeded && updatedModalRequest.servicesNeeded.length > 0
            ? updatedModalRequest.servicesNeeded
            : selectedRequest.servicesNeeded,
        numberOfGuests: updatedModalRequest.numberOfGuests || selectedRequest.numberOfGuests,
        budgetRange: updatedModalRequest.budget || selectedRequest.budgetRange,
        additionalInformation:
          updatedModalRequest.additionalInfo ?? selectedRequest.additionalInformation ?? '',
        needsEventPlanner:
          typeof selectedRequest.needsEventPlanner === 'boolean'
            ? selectedRequest.needsEventPlanner
            : true,
        needsAISuggestions:
          typeof selectedRequest.needsAISuggestions === 'boolean'
            ? selectedRequest.needsAISuggestions
            : false,
        images: selectedRequest.images || [],
      }

      try {
        let updatedData
        if (selectedRequest.requestSource === 'direct') {
          const formData = toFormData(mergedPayload)
          const response = await vendorServiceRequestAPI.update(requestId, formData as any)
          updatedData = response.data?.data ?? { ...selectedRequest, ...mergedPayload }
        } else {
          const response = await serviceRequestAPI.update(requestId, mergedPayload)
          updatedData = response.data?.data ?? { ...selectedRequest, ...mergedPayload }
        }

        const normalizedUpdate = {
          ...selectedRequest,
          ...updatedData,
          requestSource: selectedRequest.requestSource,
        }

        setServiceRequests(prev =>
          prev.map(req => (req.id === requestId ? normalizedUpdate : req))
        )
        setDirectRequests(prev =>
          prev.map(req => (req.id === requestId ? normalizedUpdate : req))
        )
        setSelectedRequest(normalizedUpdate)

        toast.success('Service request updated successfully')
      } catch (err: any) {
        console.error('Error updating service request:', err)
        toast.error(err?.response?.data?.message || 'Failed to update service request')
        throw err
      }
    },
    [selectedRequest]
  )

  const tabs = [
    { id: 'service-request-posts', label: 'Service Request Posts', count: combinedRequests.length },
    { id: 'accepted-offers', label: 'Accepted Offers', count: combinedRequests.filter(req => req.status === 'completed').length },
    { id: 'pending-offers', label: 'Pending Offers', count: combinedRequests.filter(req => req.status === 'open').length },
  ]

  const filteredRequests = combinedRequests.filter(request => {
    switch (activeTab) {
      case 'accepted-offers':
        return request.status === 'completed'
      case 'pending-offers':
        return request.status === 'open'
      default:
        return true
    }
  })

  const isLoading = loading || directRequestsLoading
  const combinedErrorMessage = error || directRequestsError

  if (isLoading) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <ClientPageHeader
          breadcrumbs={[{ label: 'Manage Bids', isActive: true }]}
          title="Manage Bids"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (combinedErrorMessage) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <ClientPageHeader
          breadcrumbs={[{ label: 'Manage Bids', isActive: true }]}
          title="Manage Bids"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{combinedErrorMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <ClientPageHeader
        breadcrumbs={[{ label: 'Manage Bids', isActive: true }]}
        title="Manage Bids"
      />

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-3 sm:px-4 lg:px-6 pt-3">
          <div className="inline-flex bg-[#0B2E6F] rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-md ${
                  activeTab === tab.id ? 'bg-white text-[#0B2E6F]' : 'text-white'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 sm:p-4 lg:p-6">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FiEye className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests yet</h3>
              <p className="text-gray-500">
                {activeTab === 'service-request-posts' 
                  ? 'You haven\'t posted any service requests yet.'
                  : activeTab === 'accepted-offers'
                  ? 'No accepted offers yet.'
                  : 'No pending offers yet.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((request) => (
                <div key={request.id} className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                    <Image
                      src={
                        (Array.isArray(request.images) && request.images.length > 0 && request.images[0]) ||
                        (request as any).eventImage ||
                        (request as any).image ||
                        '/images/party-setup.jpg'
                      }
                      alt={request.eventTitle || 'Service request image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {request.eventTitle || 'Service Request'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Posted {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                          {request.status || 'Active'}
                        </span>
                        {request.requestSource === 'direct' && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Direct Request
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {(request as any).bidCount || 0} offers
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          setSelectedService(request.eventTitle || 'Service Request')
                          setSelectedServiceRequestId(request.id)
                          setShowCompareBids(true)
                          await fetchBidsForServiceRequest(request.id)
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Offers ({(request as any).bidCount || 0})
                      </button>
                      <button
                        onClick={() => handleEditClick(request)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(request)}
                        className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compare Bids Modal */}
      {showCompareBids && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => {
                setShowCompareBids(false)
                setOffers([])
                setSelectedServiceRequestId('')
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
            >
              <FiX className="w-6 h-6" />
            </button>
            {loadingOffers ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <ViewAllOffers
                serviceTitle={selectedService}
                offers={offers}
                onAcceptOffer={async (offerId: number) => {
                  const offer = offers.find(o => o.id === offerId)
                  if (offer?.bidId) {
                    try {
                      await bidAPI.accept(offer.bidId, {
                        bidAmount: offer.offerAmountRaw,
                        startDate: offer.startDate,
                        endDate: offer.endDate,
                        proposedDetails: offer.serviceDescription,
                        additionalServices: offer.additionalServices || [],
                      })
                      toast.success('Bid accepted successfully!')
                      setSelectedOffer({ id: offerId, vendorName: offer.vendorName, amount: offer.offerAmount })
                      setSuccessModalType('accept')
                      setShowSuccessModal(true)
                      setShowCompareBids(false)
                      // Refresh bids
                      if (selectedServiceRequestId) {
                        await fetchBidsForServiceRequest(selectedServiceRequestId)
                        updateBidCountForRequest(
                          selectedServiceRequestId,
                          Math.max(
                            ((combinedRequests.find(r => r.id === selectedServiceRequestId) as any)?.bidCount || 1) - 1,
                            0
                          )
                        )
                      }
                    } catch (err: any) {
                      console.error('Error accepting bid:', err)
                      toast.error(err.response?.data?.message || 'Failed to accept bid')
                    }
                  }
                }}
                onRejectOffer={async (offerId: number) => {
                  const offer = offers.find(o => o.id === offerId)
                  if (offer?.bidId) {
                    try {
                      await bidAPI.reject(offer.bidId, {
                        bidAmount: offer.offerAmountRaw,
                        startDate: offer.startDate,
                        endDate: offer.endDate,
                        proposedDetails: offer.serviceDescription,
                        additionalServices: offer.additionalServices || [],
                      })
                      toast.success('Bid rejected')
                      setSelectedOffer({ id: offerId, vendorName: offer.vendorName, amount: offer.offerAmount })
                      setSuccessModalType('decline')
                      setShowSuccessModal(true)
                      setShowCompareBids(false)
                      // Refresh bids
                      if (selectedServiceRequestId) {
                        await fetchBidsForServiceRequest(selectedServiceRequestId)
                        updateBidCountForRequest(
                          selectedServiceRequestId,
                          Math.max(
                            ((combinedRequests.find(r => r.id === selectedServiceRequestId) as any)?.bidCount || 1) - 1,
                            0
                          )
                        )
                      }
                    } catch (err: any) {
                      console.error('Error rejecting bid:', err)
                      toast.error(err.response?.data?.message || 'Failed to reject bid')
                    }
                  }
                }}
                onCompareAll={() => {
                  setShowCompareBids(false)
                  setOffers([])
                  setSelectedServiceRequestId('')
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <OfferSuccessModal
          isOpen={showSuccessModal}
          type={successModalType}
          vendorName={selectedOffer?.vendorName || 'Vendor'}
          offerAmount={selectedOffer?.amount || 0}
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {/* Edit Modal */}
      {editModalOpen && modalServiceRequest && (
        <EditServiceRequestModal
          isOpen={editModalOpen}
          serviceRequest={modalServiceRequest as any}
          onClose={handleCloseModals}
          onSave={handleModalSave}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && selectedRequest && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          serviceTitle={selectedRequest.eventTitle || 'Service Request'}
          onClose={handleCloseModals}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}