'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { serviceRequestAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'
import { ServiceRequest } from '@/types/api'
import { FiPlus, FiEdit, FiTrash2, FiEye, FiCalendar, FiMapPin, FiUsers, FiDollarSign, FiSearch } from 'react-icons/fi'

interface ServiceRequestManagerProps {
  viewType?: 'all' | 'my' | 'assigned' | 'open' | 'upcoming'
}

export default function ServiceRequestManager({ viewType = 'all' }: ServiceRequestManagerProps) {
  const { user } = useAuthContext()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRequest, setEditingRequest] = useState<ServiceRequest | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')

  // Fetch service requests based on view type
  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      let response
      
      switch (viewType) {
        case 'my':
          response = await serviceRequestAPI.getMy()
          break
        case 'assigned':
          response = await serviceRequestAPI.getAssigned()
          break
        case 'open':
          response = await serviceRequestAPI.getOpen()
          break
        case 'upcoming':
          response = await serviceRequestAPI.getUpcoming()
          break
        default:
          response = await serviceRequestAPI.getAll()
      }
      
      setRequests(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch service requests')
      console.error('Error fetching service requests:', err)
    } finally {
      setLoading(false)
    }
  }, [viewType])

  useEffect(() => {
    fetchRequests()
  }, [viewType, fetchRequests])

  // Delete service request
  const handleDelete = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this service request?')) return
    
    try {
      await serviceRequestAPI.delete(requestId)
      setRequests(requests.filter(r => r.id !== requestId))
    } catch (err) {
      setError('Failed to delete service request')
      console.error('Error deleting service request:', err)
    }
  }

  // Toggle service request status
  const handleToggleStatus = async (requestId: string) => {
    try {
      await serviceRequestAPI.toggleStatus(requestId)
      await fetchRequests() // Refresh the list
    } catch (err) {
      setError('Failed to update service request status')
      console.error('Error updating service request:', err)
    }
  }

  // Update service request status
  const handleUpdateStatus = async (requestId: string, status: string) => {
    try {
      await serviceRequestAPI.updateStatus(requestId, status as any)
      await fetchRequests() // Refresh the list
    } catch (err) {
      setError('Failed to update service request status')
      console.error('Error updating service request:', err)
    }
  }

  // Filter requests based on search and status
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.eventLocation.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = !selectedStatus || request.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchRequests}
          className="mt-2 text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {viewType === 'my' ? 'My Service Requests' :
           viewType === 'assigned' ? 'Assigned Requests' :
           viewType === 'open' ? 'Open Requests' :
           viewType === 'upcoming' ? 'Upcoming Requests' :
           'All Service Requests'}
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Request</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No service requests found</h3>
          <p className="text-gray-500">
            {searchQuery || selectedStatus ? 'Try adjusting your search or filters' : 'Create your first service request to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {request.eventTitle}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="capitalize">{request.eventType}</span>
                    <span className="mx-2">•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'open' ? 'bg-green-100 text-green-800' :
                      request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      request.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setEditingRequest(request)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Event Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(request.eventStartDate).toLocaleDateString()}
                    {request.eventEndDate !== request.eventStartDate && (
                      <span> - {new Date(request.eventEndDate).toLocaleDateString()}</span>
                    )}
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <FiMapPin className="w-4 h-4 mr-2" />
                  <span>{request.eventLocation}, {request.eventCity}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <FiUsers className="w-4 h-4 mr-2" />
                  <span>{request.numberOfGuests} guests</span>
                </div>
                
                {request.budgetRange && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FiDollarSign className="w-4 h-4 mr-2" />
                    <span>Budget: {request.budgetRange}</span>
                  </div>
                )}
              </div>

              {/* Services Needed */}
              {request.servicesNeeded && request.servicesNeeded.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Services Needed:</h4>
                  <div className="flex flex-wrap gap-1">
                    {request.servicesNeeded.map((service, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              {request.additionalInformation && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Additional Information:</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {request.additionalInformation}
                  </p>
                </div>
              )}

              {/* Status Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleStatus(request.id)}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Toggle Status
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={request.status}
                    onChange={(e) => handleUpdateStatus(request.id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Service Request Modal */}
      {(showCreateModal || editingRequest) && (
        <CreateEditServiceRequestModal
          request={editingRequest}
          onClose={() => {
            setShowCreateModal(false)
            setEditingRequest(null)
          }}
          onSuccess={() => {
            setShowCreateModal(false)
            setEditingRequest(null)
            fetchRequests()
          }}
        />
      )}
    </div>
  )
}

// Create/Edit Service Request Modal Component
interface CreateEditServiceRequestModalProps {
  request?: ServiceRequest | null
  onClose: () => void
  onSuccess: () => void
}

function CreateEditServiceRequestModal({ request, onClose, onSuccess }: CreateEditServiceRequestModalProps) {
  const [formData, setFormData] = useState({
    eventTitle: request?.eventTitle || '',
    eventType: request?.eventType || '',
    eventStartDate: request?.eventStartDate || '',
    eventEndDate: request?.eventEndDate || '',
    eventLocation: request?.eventLocation || '',
    eventCity: request?.eventCity || '',
    servicesNeeded: request?.servicesNeeded?.join(', ') || '',
    numberOfGuests: request?.numberOfGuests?.toString() || '',
    budgetRange: request?.budgetRange || '',
    additionalInformation: request?.additionalInformation || '',
    needsEventPlanner: request?.needsEventPlanner?.toString() || 'false',
    needsAISuggestions: request?.needsAISuggestions?.toString() || 'false'
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('eventTitle', formData.eventTitle)
      formDataToSend.append('eventType', formData.eventType)
      formDataToSend.append('eventStartDate', formData.eventStartDate)
      formDataToSend.append('eventEndDate', formData.eventEndDate)
      formDataToSend.append('eventLocation', formData.eventLocation)
      formDataToSend.append('eventCity', formData.eventCity)
      formDataToSend.append('servicesNeeded', formData.servicesNeeded)
      formDataToSend.append('numberOfGuests', formData.numberOfGuests)
      formDataToSend.append('budgetRange', formData.budgetRange)
      formDataToSend.append('additionalInformation', formData.additionalInformation)
      formDataToSend.append('needsEventPlanner', formData.needsEventPlanner)
      formDataToSend.append('needsAISuggestions', formData.needsAISuggestions)

      // Add image files
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`images`, file)
      })

      if (request) {
        await serviceRequestAPI.update(request.id, formDataToSend)
      } else {
        await serviceRequestAPI.create(formDataToSend)
      }

      onSuccess()
    } catch (err) {
      setError('Failed to save service request')
      console.error('Error saving service request:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 10) {
      setError('Maximum 10 files allowed')
      return
    }
    setImageFiles(files)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {request ? 'Edit Service Request' : 'Create Service Request'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Title *
              </label>
              <input
                type="text"
                value={formData.eventTitle}
                onChange={(e) => setFormData({...formData, eventTitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Event Type and City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate</option>
                  <option value="birthday">Birthday</option>
                  <option value="conference">Conference</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.eventCity}
                  onChange={(e) => setFormData({...formData, eventCity: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.eventStartDate}
                  onChange={(e) => setFormData({...formData, eventStartDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.eventEndDate}
                  onChange={(e) => setFormData({...formData, eventEndDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Location and Guests */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.eventLocation}
                  onChange={(e) => setFormData({...formData, eventLocation: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  value={formData.numberOfGuests}
                  onChange={(e) => setFormData({...formData, numberOfGuests: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Services and Budget */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Services Needed
                </label>
                <input
                  type="text"
                  value={formData.servicesNeeded}
                  onChange={(e) => setFormData({...formData, servicesNeeded: e.target.value})}
                  placeholder="e.g., catering, photography, music"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Budget Range
                </label>
                <input
                  type="text"
                  value={formData.budgetRange}
                  onChange={(e) => setFormData({...formData, budgetRange: e.target.value})}
                  placeholder="e.g., 5000-10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Information
              </label>
              <textarea
                value={formData.additionalInformation}
                onChange={(e) => setFormData({...formData, additionalInformation: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="needsEventPlanner"
                  checked={formData.needsEventPlanner === 'true'}
                  onChange={(e) => setFormData({...formData, needsEventPlanner: e.target.checked.toString()})}
                  className="mr-2"
                />
                <label htmlFor="needsEventPlanner" className="text-sm text-gray-700">
                  Needs Event Planner
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="needsAISuggestions"
                  checked={formData.needsAISuggestions === 'true'}
                  onChange={(e) => setFormData({...formData, needsAISuggestions: e.target.checked.toString()})}
                  className="mr-2"
                />
                <label htmlFor="needsAISuggestions" className="text-sm text-gray-700">
                  Needs AI Suggestions
                </label>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Images (Max 10)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {imageFiles.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  Selected {imageFiles.length} file(s)
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : (request ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
