'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { bidAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'
import { Bid } from '@/types/api'
import { FiPlus, FiEdit, FiTrash2, FiDollarSign, FiCalendar, FiCheck, FiX, FiEye } from 'react-icons/fi'

interface BidManagerProps {
  viewType?: 'all' | 'my' | 'received'
  serviceRequestId?: string
}

export default function BidManager({ viewType = 'all', serviceRequestId }: BidManagerProps) {
  const { user } = useAuthContext()
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingBid, setEditingBid] = useState<Bid | null>(null)
  const [stats, setStats] = useState<any>(null)

  // Fetch bids based on view type
  const fetchBids = useCallback(async () => {
    try {
      setLoading(true)
      let response
      
      if (viewType === 'my') {
        response = await bidAPI.getAll()
      } else if (viewType === 'received') {
        response = await bidAPI.getWithDetails()
      } else {
        response = await bidAPI.getAll()
      }
      
      setBids(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch bids')
      console.error('Error fetching bids:', err)
    } finally {
      setLoading(false)
    }
  }, [viewType])

  // Fetch bid stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await bidAPI.getStats()
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching bid stats:', err)
    }
  }, [])

  useEffect(() => {
    fetchBids()
    fetchStats()
  }, [viewType, serviceRequestId, fetchBids, fetchStats])

  // Delete bid
  const handleDelete = async (bidId: string) => {
    if (!confirm('Are you sure you want to delete this bid?')) return
    
    try {
      await bidAPI.delete(bidId)
      setBids(bids.filter(b => b.id !== bidId))
    } catch (err) {
      setError('Failed to delete bid')
      console.error('Error deleting bid:', err)
    }
  }

  // Withdraw bid
  const handleWithdraw = async (bidId: string) => {
    if (!confirm('Are you sure you want to withdraw this bid?')) return
    
    try {
      await bidAPI.withdraw(bidId)
      await fetchBids() // Refresh the list
    } catch (err) {
      setError('Failed to withdraw bid')
      console.error('Error withdrawing bid:', err)
    }
  }

  // Accept bid (for requesters)
  const handleAcceptBid = async (bidId: string) => {
    if (!confirm('Are you sure you want to accept this bid?')) return
    
    try {
      await bidAPI.accept(bidId)
      await fetchBids() // Refresh the list
    } catch (err) {
      setError('Failed to accept bid')
      console.error('Error accepting bid:', err)
    }
  }

  // Reject bid (for requesters)
  const handleRejectBid = async (bidId: string) => {
    if (!confirm('Are you sure you want to reject this bid?')) return
    
    try {
      await bidAPI.reject(bidId)
      await fetchBids() // Refresh the list
    } catch (err) {
      setError('Failed to reject bid')
      console.error('Error rejecting bid:', err)
    }
  }

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
          onClick={fetchBids}
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
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {viewType === 'my' ? 'My Bids' :
             viewType === 'received' ? 'Received Bids' :
             'All Bids'}
          </h2>
          {stats && (
            <p className="text-gray-600 mt-1">
              {stats.totalBids} total bids
            </p>
          )}
        </div>
        {user?.accountType === 'vendor' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            <span>Create Bid</span>
          </button>
        )}
      </div>

      {/* Bids List */}
      {bids.length === 0 ? (
        <div className="text-center py-12">
          <FiDollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
          <p className="text-gray-500">
            {viewType === 'my' ? 'Create your first bid to get started' :
             viewType === 'received' ? 'No bids have been received yet' :
             'No bids available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {bids.map((bid) => (
            <div key={bid.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    Bid for Service Request
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      bid.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      bid.status === 'withdrawn' ? 'bg-gray-100 text-gray-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {bid.status}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 ml-4">
                  {bid.status === 'pending' && (
                    <>
                      {viewType === 'received' && (
                        <>
                          <button
                            onClick={() => handleAcceptBid(bid.id)}
                            className="p-1.5 text-green-600 hover:text-green-700 transition-colors"
                            title="Accept Bid"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectBid(bid.id)}
                            className="p-1.5 text-red-600 hover:text-red-700 transition-colors"
                            title="Reject Bid"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {viewType === 'my' && (
                        <button
                          onClick={() => handleWithdraw(bid.id)}
                          className="p-1.5 text-orange-600 hover:text-orange-700 transition-colors"
                          title="Withdraw Bid"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => setEditingBid(bid)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(bid.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bid Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FiDollarSign className="w-4 h-4 mr-2" />
                  <span className="font-semibold text-green-600">${bid.bidAmount}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  <span>
                    {new Date(bid.startDate).toLocaleDateString()} - {new Date(bid.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Proposed Details */}
              {bid.proposedDetails && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Proposed Details:</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {bid.proposedDetails}
                  </p>
                </div>
              )}

              {/* Additional Services */}
              {bid.additionalServices && bid.additionalServices.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Services:</h4>
                  <div className="flex flex-wrap gap-1">
                    {bid.additionalServices.map((service, index) => (
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

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-200">
                <span>
                  Created {new Date(bid.createdAt).toLocaleDateString()}
                </span>
                {bid.images && bid.images.length > 0 && (
                  <span>
                    {bid.images.length} attachment(s)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Bid Modal */}
      {(showCreateModal || editingBid) && (
        <CreateEditBidModal
          bid={editingBid}
          serviceRequestId={serviceRequestId}
          onClose={() => {
            setShowCreateModal(false)
            setEditingBid(null)
          }}
          onSuccess={() => {
            setShowCreateModal(false)
            setEditingBid(null)
            fetchBids()
          }}
        />
      )}
    </div>
  )
}

// Create/Edit Bid Modal Component
interface CreateEditBidModalProps {
  bid?: Bid | null
  serviceRequestId?: string
  onClose: () => void
  onSuccess: () => void
}

function CreateEditBidModal({ bid, serviceRequestId, onClose, onSuccess }: CreateEditBidModalProps) {
  const [formData, setFormData] = useState({
    serviceRequestId: serviceRequestId || bid?.serviceRequestId || '',
    bidAmount: bid?.bidAmount?.toString() || '',
    startDate: bid?.startDate || '',
    endDate: bid?.endDate || '',
    proposedDetails: bid?.proposedDetails || '',
    additionalServices: bid?.additionalServices?.join(', ') || ''
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
      formDataToSend.append('serviceRequestId', formData.serviceRequestId)
      formDataToSend.append('bidAmount', formData.bidAmount)
      formDataToSend.append('startDate', formData.startDate)
      formDataToSend.append('endDate', formData.endDate)
      formDataToSend.append('proposedDetails', formData.proposedDetails)
      formDataToSend.append('additionalServices', formData.additionalServices)

      // Add image files
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`images`, file)
      })

      if (bid) {
        // For updating, we need to convert FormData to a regular object
        const updateData = {
          serviceRequestId: formData.serviceRequestId,
          bidAmount: parseFloat(formData.bidAmount),
          startDate: formData.startDate,
          endDate: formData.endDate,
          proposedDetails: formData.proposedDetails,
          additionalServices: formData.additionalServices.split(',').map(s => s.trim()).filter(Boolean)
        }
        await bidAPI.update(bid.id, updateData)
      } else {
        await bidAPI.create(formDataToSend)
      }

      onSuccess()
    } catch (err) {
      setError('Failed to save bid')
      console.error('Error saving bid:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 5) {
      setError('Maximum 5 files allowed')
      return
    }
    setImageFiles(files)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {bid ? 'Edit Bid' : 'Create Bid'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service Request ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Request ID *
              </label>
              <input
                type="text"
                value={formData.serviceRequestId}
                onChange={(e) => setFormData({...formData, serviceRequestId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={!!serviceRequestId}
              />
            </div>

            {/* Bid Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bid Amount *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.bidAmount}
                onChange={(e) => setFormData({...formData, bidAmount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
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
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Proposed Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proposed Details *
              </label>
              <textarea
                value={formData.proposedDetails}
                onChange={(e) => setFormData({...formData, proposedDetails: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Additional Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Services
              </label>
              <input
                type="text"
                value={formData.additionalServices}
                onChange={(e) => setFormData({...formData, additionalServices: e.target.value})}
                placeholder="Enter additional services separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supporting Images (Max 5)
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
                {loading ? 'Saving...' : (bid ? 'Update' : 'Create')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
