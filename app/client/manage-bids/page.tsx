'use client'

import { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiEye, FiX } from 'react-icons/fi'
import CompareBidsModal from '@/components/ui/modals/CompareBidsModal'
import OfferSuccessModal from '@/components/ui/modals/OfferSuccessModal'
import ViewAllOffers from '@/components/client/ViewAllOffers'
import EditServiceRequestModal from '@/components/ui/modals/EditServiceRequestModal'
import DeleteConfirmationModal from '@/components/ui/modals/DeleteConfirmationModal'
import ClientPageHeader from '@/components/client/ClientPageHeader'
import { serviceRequestAPI } from '@/lib/api'
import { ServiceRequest } from '@/types/api'

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
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // API state
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch service requests from API
  useEffect(() => {
    const fetchServiceRequests = async () => {
      try {
        setLoading(true)
        const response = await serviceRequestAPI.getAll()
        setServiceRequests(response.data.data || [])
      } catch (err) {
        setError('Failed to fetch service requests')
        console.error('Error fetching service requests:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServiceRequests()
  }, [])

  const handleEditClick = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (request: ServiceRequest) => {
    setSelectedRequest(request)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedRequest) return
    
    setIsDeleting(true)
    
    try {
      await serviceRequestAPI.delete(selectedRequest.id)
      setServiceRequests(prev => prev.filter(req => req.id !== selectedRequest.id))
      setDeleteModalOpen(false)
      setSelectedRequest(null)
    } catch (err) {
      console.error('Error deleting service request:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseModals = () => {
    setEditModalOpen(false)
    setDeleteModalOpen(false)
    setSelectedRequest(null)
  }

  const tabs = [
    { id: 'service-request-posts', label: 'Service Request Posts', count: serviceRequests.length },
    { id: 'accepted-offers', label: 'Accepted Offers', count: serviceRequests.filter(req => req.status === 'completed').length },
    { id: 'pending-offers', label: 'Pending Offers', count: serviceRequests.filter(req => req.status === 'open').length },
  ]

  const filteredRequests = serviceRequests.filter(request => {
    switch (activeTab) {
      case 'accepted-offers':
        return request.status === 'completed'
      case 'pending-offers':
        return request.status === 'open'
      default:
        return true
    }
  })

  if (loading) {
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

  if (error) {
    return (
      <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
        <ClientPageHeader
          breadcrumbs={[{ label: 'Manage Bids', isActive: true }]}
          title="Manage Bids"
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
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
                  <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                    {/* Placeholder for service request image */}
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <FiEye className="w-8 h-8" />
                    </div>
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

                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                        request.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {request.status || 'Active'}
                      </span>
                      <span className="text-sm text-gray-600">
                        {(request as any).bids?.length || 0} offers
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedService(request.eventTitle || 'Service Request')
                          setShowCompareBids(true)
                        }}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Offers
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
        <ViewAllOffers
          serviceTitle={selectedService}
          offers={[]}
          onAcceptOffer={(offerId: number) => {
            setSelectedOffer({ id: offerId, vendorName: 'Vendor' })
            setSuccessModalType('accept')
            setShowSuccessModal(true)
            setShowCompareBids(false)
          }}
          onRejectOffer={(offerId: number) => {
            setSelectedOffer({ id: offerId, vendorName: 'Vendor' })
            setSuccessModalType('decline')
            setShowSuccessModal(true)
            setShowCompareBids(false)
          }}
          onCompareAll={() => setShowCompareBids(false)}
        />
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
      {editModalOpen && selectedRequest && (
        <EditServiceRequestModal
          isOpen={editModalOpen}
          serviceRequest={selectedRequest as any}
          onClose={handleCloseModals}
          onSave={(updatedRequest: any) => {
            setServiceRequests(prev => 
              prev.map(req => req.id === updatedRequest.id ? updatedRequest : req)
            )
            handleCloseModals()
          }}
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