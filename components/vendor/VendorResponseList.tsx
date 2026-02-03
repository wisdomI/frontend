'use client'

import React, { useState } from 'react'
import { VendorResponse, VendorResponseInput } from '@/types/vendorResponse'
import { useVendorResponses } from '@/hooks/useVendorResponses'
import { formatDistanceToNow } from 'date-fns'

interface VendorResponseListProps {
  requestId?: string
  showStats?: boolean
  onResponseUpdate?: (response: VendorResponse) => void
  onResponseDelete?: (responseId: string) => void
}

const VendorResponseList: React.FC<VendorResponseListProps> = ({
  requestId,
  showStats = true,
  onResponseUpdate,
  onResponseDelete
}) => {
  const [selectedResponse, setSelectedResponse] = useState<VendorResponse | null>(null)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [updateData, setUpdateData] = useState<VendorResponseInput>({})

  const { 
    responses, 
    stats, 
    loading, 
    error, 
    updateResponse, 
    withdrawResponse, 
    deleteResponse 
  } = useVendorResponses({ 
    autoFetch: true,
    filters: requestId ? { search: requestId } : undefined
  })

  const handleUpdate = async (id: string) => {
    try {
      const updated = await updateResponse(id, updateData)
      onResponseUpdate?.(updated)
      setShowUpdateModal(false)
      setUpdateData({})
      setSelectedResponse(null)
    } catch (err: any) {
      console.error('Failed to update response:', err)
      alert('Failed to update response. Please try again.')
    }
  }

  const handleWithdraw = async (id: string) => {
    if (!confirm('Are you sure you want to withdraw this response?')) return

    try {
      const withdrawn = await withdrawResponse(id)
      onResponseUpdate?.(withdrawn)
    } catch (err: any) {
      console.error('Failed to withdraw response:', err)
      alert('Failed to withdraw response. Please try again.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this response? This action cannot be undone.')) return

    try {
      await deleteResponse(id)
      onResponseDelete?.(id)
    } catch (err: any) {
      console.error('Failed to delete response:', err)
      alert('Failed to delete response. Please try again.')
    }
  }

  const openUpdateModal = (response: VendorResponse) => {
    setSelectedResponse(response)
    setUpdateData({
      status: response.status,
      message: response.message
    })
    setShowUpdateModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'declined': return 'bg-red-100 text-red-800'
      case 'withdrawn': return 'bg-gray-100 text-gray-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return '✅'
      case 'declined': return '❌'
      case 'withdrawn': return '↩️'
      case 'pending': return '⏳'
      default: return '❓'
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading vendor responses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">❌</div>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      {showStats && stats && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Responses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.declined}</div>
              <div className="text-sm text-gray-600">Declined</div>
            </div>
          </div>
        </div>
      )}

      {/* Responses List */}
      <div className="space-y-4">
        {responses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium mb-2">No vendor responses</h3>
            <p className="text-sm">There are currently no vendor responses to display.</p>
          </div>
        ) : (
          responses.map((response) => (
            <div key={response.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(response.status)}`}>
                      {getStatusIcon(response.status)} {response.status.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(response.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  {response.serviceRequest && (
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {response.serviceRequest.eventTitle}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {response.serviceRequest.eventDate} • {response.serviceRequest.eventLocation}
                      </p>
                      <p className="text-sm text-gray-600">
                        Budget: {response.serviceRequest.budgetRange}
                      </p>
                    </div>
                  )}

                  {response.message && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {response.message}
                      </p>
                    </div>
                  )}

                  {response.vendor && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <img 
                        src={(response.vendor as any)?.profileImage || (response.vendor as any)?.displayPicture || (response.vendor as any)?.profilePicture || '/images/avatar1.jpg'} 
                        alt={response.vendor.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{response.vendor.name}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => openUpdateModal(response)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Edit
                  </button>
                  
                  {response.status === 'pending' && (
                    <button
                      onClick={() => handleWithdraw(response.id)}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                    >
                      Withdraw
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(response.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Update Modal */}
      {showUpdateModal && selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Update Response</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={updateData.status || ''}
                    onChange={(e) => setUpdateData((prev: VendorResponseInput) => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={updateData.message || ''}
                    onChange={(e) => setUpdateData((prev: VendorResponseInput) => ({ ...prev, message: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter response message..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowUpdateModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleUpdate(selectedResponse.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Response
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VendorResponseList
