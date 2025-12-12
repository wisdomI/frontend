'use client'

import React, { useState, useEffect } from 'react'
import { useServiceRequests } from '@/hooks/useServiceRequests'
import { useAuthContext } from '@/contexts/AuthContext'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiFilter, FiSearch, FiCalendar, FiMapPin, FiUsers } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { serviceRequestAPI } from '@/lib/api'

interface ServiceRequestIntegrationProps {
  viewType?: 'all' | 'my' | 'assigned' | 'open' | 'upcoming'
  context?: 'marketplace' | 'direct' | 'vendor'
}

export default function ServiceRequestIntegration({ 
  viewType = 'all', 
  context = 'marketplace' 
}: ServiceRequestIntegrationProps) {
  const { user } = useAuthContext()
  const {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequest,
    deleteRequest,
    vendorAccept,
    vendorReject,
    toggleRequestStatus,
    updateRequestStatus,
    assignPlanner,
    getVendorResponses,
    getVendorResponseHistory,
    bulkVendorResponses,
    searchRequests,
  } = useServiceRequests({ viewType })

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRequest, setEditingRequest] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [eventTypeFilter, setEventTypeFilter] = useState('all')
  const [stats, setStats] = useState<any | null>(null)
  const [locationFilter, setLocationFilter] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await serviceRequestAPI.getStats()
        setStats(response.data.data)
      } catch (err) {
        console.error('Failed to fetch service request stats', err)
      }
    }

    loadStats()
}, [viewType, context])

  const handleCreateRequest = async (requestData: any) => {
    try {
      await createRequest(requestData)
      toast.success('Service request created successfully')
      setShowCreateModal(false)
    } catch (err) {
      toast.error('Failed to create service request')
    }
  }

  const handleUpdateRequest = async (id: string, requestData: any) => {
    try {
      await updateRequest(id, requestData)
      toast.success('Service request updated successfully')
      setShowEditModal(false)
      setEditingRequest(null)
    } catch (err) {
      toast.error('Failed to update service request')
    }
  }

  const handleDeleteRequest = async (id: string) => {
    if (confirm('Are you sure you want to delete this service request?')) {
      try {
        await deleteRequest(id)
        toast.success('Service request deleted successfully')
      } catch (err) {
        toast.error('Failed to delete service request')
      }
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleRequestStatus(id)
      toast.success('Service request status updated')
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleViewRequest = async (id: string) => {
    try {
      const response = await serviceRequestAPI.getById(id)
      setSelectedRequest(response.data.data)
    } catch (err) {
      toast.error('Failed to fetch service request details')
    }
  }

  const handleDirectServiceRequest = async (vendorId: string, serviceData: any) => {
    try {
      // This would be a direct service request to a specific vendor
      const directRequestData = {
        ...serviceData,
        vendorId,
        isDirectRequest: true
      }
      await createRequest(directRequestData)
      toast.success('Direct service request sent successfully')
    } catch (err) {
      toast.error('Failed to send direct service request')
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.eventType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.eventLocation?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter
    const matchesEventType = eventTypeFilter === 'all' || request.eventType === eventTypeFilter
    const matchesLocation = !locationFilter || request.eventLocation?.toLowerCase().includes(locationFilter.toLowerCase())
    
    return matchesSearch && matchesStatus && matchesEventType && matchesLocation
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventTypeIcon = (eventType: string) => {
    switch (eventType) {
      case 'wedding': return '💒'
      case 'birthday': return '🎂'
      case 'corporate': return '🏢'
      case 'conference': return '🎤'
      case 'party': return '🎉'
      default: return '🎊'
    }
  }

  const formatCurrency = (amount: string) => {
    const range = amount.split('-')
    if (range.length === 2) {
      return `$${range[0]} - $${range[1]}`
    }
    return amount
  }

  if (loading && requests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {context === 'marketplace' && 'Marketplace Service Requests'}
            {context === 'direct' && 'Direct Service Requests'}
            {context === 'vendor' && 'Vendor Service Requests'}
          </h2>
          <p className="text-gray-600">
            {context === 'marketplace' && 'Browse and request services from vendors'}
            {context === 'direct' && 'Send direct requests to specific vendors'}
            {context === 'vendor' && 'Manage incoming service requests'}
          </p>
        </div>
        {user?.accountType !== 'vendor' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Request</span>
          </button>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.totalRequests || 0}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{stats.openRequests || 0}</div>
            <div className="text-sm text-gray-600">Open</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgressRequests || 0}</div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-gray-600">{stats.completedRequests || 0}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <FiFilter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <select
          value={eventTypeFilter}
          onChange={(e) => setEventTypeFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Event Types</option>
          <option value="wedding">Wedding</option>
          <option value="birthday">Birthday</option>
          <option value="corporate">Corporate</option>
          <option value="conference">Conference</option>
          <option value="party">Party</option>
        </select>
        <input
          type="text"
          placeholder="Filter by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Service Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((request) => {
          const requesterId =
            (request as any).requesterId ??
            (request as any).userId ??
            (request as any).clientId ??
            ((request as any).client?.id)
          const canManageRequest = Boolean(user?.id && requesterId && user.id === requesterId)

          return (
            <div key={request.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getEventTypeIcon(request.eventType)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {request.eventTitle}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">{request.eventType}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FiCalendar className="w-4 h-4" />
                  <span>{new Date(request.eventStartDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FiMapPin className="w-4 h-4" />
                  <span className="truncate">{request.eventLocation}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <FiUsers className="w-4 h-4" />
                  <span>{request.numberOfGuests} guests</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900">Budget Range</p>
                <p className="text-lg font-semibold text-blue-600">
                  {formatCurrency(request.budgetRange)}
                </p>
              </div>

              {request.additionalInformation && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {request.additionalInformation}
                  </p>
                </div>
              )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewRequest(request.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View Details
                    </button>
                    {canManageRequest && (
                      <>
                        <button
                          onClick={() => {
                            setEditingRequest(request)
                            setShowEditModal(true)
                          }}
                          className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRequest(request.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  {user?.accountType === 'vendor' && request.status === 'open' && (
                    <button
                      onClick={() => handleDirectServiceRequest(request.id, request)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      Submit Bid
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No service requests found</div>
        </div>
      )}

      {/* Create Service Request Modal */}
      {showCreateModal && (
        <CreateServiceRequestModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRequest}
          context={context}
        />
      )}

      {/* Edit Service Request Modal */}
      {showEditModal && editingRequest && (
        <EditServiceRequestModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingRequest(null)
          }}
          request={editingRequest}
          onSubmit={(data: any) => handleUpdateRequest(editingRequest.id, data)}
        />
      )}

      {/* View Service Request Modal */}
      {selectedRequest && (
        <ViewServiceRequestModal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          request={selectedRequest}
          onToggleStatus={handleToggleStatus}
          onSubmitBid={(bidData: any) => handleDirectServiceRequest(selectedRequest.id, bidData)}
        />
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}
    </div>
  )
}

// Placeholder components - these would need to be implemented
function CreateServiceRequestModal({ isOpen, onClose, onSubmit, context }: any) {
  return null
}

function EditServiceRequestModal({ isOpen, onClose, request, onSubmit }: any) {
  return null
}

function ViewServiceRequestModal({ isOpen, onClose, request, onToggleStatus, onSubmitBid }: any) {
  return null
}
