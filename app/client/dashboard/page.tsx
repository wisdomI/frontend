'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FiEye, FiEdit2, FiTrash2, FiChevronRight, FiChevronLeft, FiX } from 'react-icons/fi'
import EditServiceRequestModal from '@/components/ui/modals/EditServiceRequestModal'
import DeleteConfirmationModal from '@/components/ui/modals/DeleteConfirmationModal'
import { useServiceRequests } from '@/hooks/useServiceRequests'
import { useApi } from '@/hooks/useApi'
import { useAuthContext } from '@/contexts/AuthContext'
import { serviceRequestAPI } from '@/lib/api'

export default function ClientDashboardPage() {
  const { user } = useAuthContext()
  const [activeTab, setActiveTab] = useState('service-request-posts')
  
  // API hooks
  const { requests: serviceRequestsData, loading: serviceRequestsLoading, error: serviceRequestsError, fetchRequests: refetchServiceRequests } = useServiceRequests()
  const { data: dashboardStats, loading: statsLoading } = useApi(() => serviceRequestAPI.getStats().then(res => res.data))
  
  // Transform API data to component format
  const transformServiceRequest = (request: any) => ({
    id: request.id,
    title: request.eventTitle,
    image: request.eventImage || "/images/party-setup.jpg",
    postedTime: `Posted ${new Date(request.createdAt).toLocaleDateString()}`,
    eventType: request.eventType,
    eventDate: new Date(request.eventStartDate).toLocaleDateString(),
    eventLocation: request.eventLocation,
    totalVisits: request.viewCount || 0,
    numberOfGuests: request.numberOfGuests,
    servicesNeeded: request.servicesNeeded || [],
    budget: request.budgetRange,
    additionalInfo: request.additionalInfo || '',
    offersCount: request.bidsCount || 0,
    status: request.status
  })

  const serviceRequests = serviceRequestsData?.map(transformServiceRequest) || []

  // Modal states
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit functionality
  const handleEditClick = (request: any) => {
    setSelectedRequest(request)
    setEditModalOpen(true)
  }

  const handleEditSave = async (updatedRequest: any) => {
    try {
      // Call API to update service request
      const response = await fetch(`/api/v1/service-requests/${updatedRequest.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(updatedRequest)
      })
      
      if (response.ok) {
        // Refetch data to get updated service requests
        refetchServiceRequests()
        setEditModalOpen(false)
        setSelectedRequest(null)
      } else {
        console.error('Failed to update service request')
      }
    } catch (error) {
      console.error('Error updating service request:', error)
    }
  }

  // Delete functionality
  const handleDeleteClick = (request: any) => {
    setSelectedRequest(request)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedRequest) return
    
    setIsDeleting(true)
    
    try {
      // Call API to delete service request
      const response = await fetch(`/api/v1/service-requests/${selectedRequest.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      
      if (response.ok) {
        // Refetch data to get updated service requests
        refetchServiceRequests()
        setDeleteModalOpen(false)
        setSelectedRequest(null)
      } else {
        console.error('Failed to delete service request')
      }
    } catch (error) {
      console.error('Error deleting service request:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCloseModals = () => {
    setEditModalOpen(false)
    setDeleteModalOpen(false)
    setSelectedRequest(null)
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-4 lg:p-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-asul">
          Welcome back, {user?.firstName || user?.businessName || 'Client'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your service requests and track your bookings
        </p>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-white border-b rounded-lg">
        <div className="px-3 sm:px-4 py-2 sm:py-3">
          <nav>
            <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500">
              <li className="text-blue-600">My Account</li>
              <li className="flex items-center">
                <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />
                <span className="hidden sm:inline">Manage all Posts</span>
                <span className="sm:hidden">Posts</span>
              </li>
              <li className="flex items-center">
                <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2" />
                <span className="hidden sm:inline">Service Request Posts</span>
                <span className="sm:hidden">Posts</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="py-4 sm:py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex flex-wrap space-x-2 sm:space-x-4 lg:space-x-8 px-3 sm:px-4 lg:px-6">
              <button
                onClick={() => setActiveTab('service-request-posts')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
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
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'direct-service-request'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="hidden sm:inline">Direct Service Request</span>
                <span className="sm:hidden">Direct Request</span>
              </button>
            </nav>
          </div>

          {/* Posts List */}
          <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
            {serviceRequestsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading service requests...</p>
              </div>
            ) : serviceRequestsError ? (
              <div className="text-center py-8">
                <p className="text-red-600">Failed to load service requests</p>
              </div>
            ) : serviceRequests.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No service requests found</p>
              </div>
            ) : (
              serviceRequests.map((request: any) => (
              <div key={request.id} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6">
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                  {/* Image */}
                  <div className="lg:w-48 flex-shrink-0">
                    <div className="relative w-full h-24 sm:h-32 bg-gray-200 rounded-lg overflow-hidden">
                      <Image src={request.image} alt={request.title} fill className="object-cover" />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 font-asul">{request.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">{request.postedTime}</p>
                      </div>
                      <div className="flex space-x-1 sm:space-x-2">
                        <button 
                          onClick={() => handleEditClick(request)}
                          className="p-1 sm:p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                          title="Edit service request"
                        >
                          <FiEdit2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(request)}
                          className="p-1 sm:p-2 rounded-full hover:bg-gray-100 text-red-600 transition-colors"
                          title="Delete service request"
                        >
                          <FiTrash2 className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">
                          <span className="font-medium">Event Type:</span> {request.eventType}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">
                          <span className="font-medium">Event Date:</span> {request.eventDate}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          <span className="font-medium">Event Location:</span> {request.eventLocation}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          <span className="font-medium">No. of Guests:</span> {request.numberOfGuests}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3 sm:mb-4">
                      <span className="font-medium text-gray-700 text-xs sm:text-sm block mb-1">Services Needed:</span>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {request.servicesNeeded.map((service: any, index: number) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-[10px] sm:text-xs font-medium px-2 py-1 rounded-full flex items-center">
                            {service}
                            <button className="ml-1 text-blue-600 hover:text-blue-800">
                              <FiX className="w-2 h-2 sm:w-3 sm:h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Budget */}
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      <span className="font-medium">Budget:</span> {request.budget}
                    </p>

                    {/* Additional Information */}
                    <p className="text-xs sm:text-sm text-gray-600">
                      <span className="font-medium">Additional Information:</span> {request.additionalInfo}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-gray-100 mt-3 sm:mt-4">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <span>Total Visits: <span className="font-semibold text-gray-900">{request.totalVisits}</span></span>
                    <span>Offers: <span className="font-semibold text-blue-600">{request.offersCount}</span></span>
                  </div>
                  <button className="flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm relative">
                    <FiEye className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>View all Offers</span>
                    {request.offersCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                        {request.offersCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
              ))
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg shadow">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">&lt;</span>
            </button>
            <button
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">&gt;</span>
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{' '}
                <span className="font-medium">10</span> of{' '}
                <span className="font-medium">20</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center rounded-l-md px-2 py-1.5 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </button>
                <button
                  className={`relative inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600`}
                >
                  1
                </button>
                <button
                  className="relative inline-flex items-center rounded-r-md px-2 py-1.5 sm:py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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