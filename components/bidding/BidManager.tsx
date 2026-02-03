'use client'

import React, { useState, useEffect } from 'react'
import { useBidManagement } from '@/hooks/useBidManagement'
import { FiPlus, FiEdit, FiTrash2, FiCheck, FiX, FiEye, FiFilter, FiSearch } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

interface BidManagerProps {
  viewType?: 'all' | 'my' | 'received' | 'sent'
}

export default function BidManager({ viewType = 'all' }: BidManagerProps) {
  const {
    bids,
    bid,
    stats,
    loading,
    error,
    fetchBids,
    fetchBidsWithDetails,
    fetchBidById,
    createBid,
    updateBid,
    withdrawBid,
    deleteBid,
    acceptBid,
    rejectBid
  } = useBidManagement()

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBid, setEditingBid] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedBid, setSelectedBid] = useState<any>(null)

  useEffect(() => {
    if (viewType === 'all') {
      fetchBidsWithDetails()
    } else {
      fetchBids()
    }
  }, [viewType])

  const handleCreateBid = async (bidData: any) => {
    try {
      await createBid(bidData)
      toast.success('Bid created successfully')
      setShowCreateModal(false)
    } catch (err) {
      toast.error('Failed to create bid')
    }
  }

  const handleUpdateBid = async (id: string, bidData: any) => {
    try {
      await updateBid(id, bidData)
      toast.success('Bid updated successfully')
      setShowEditModal(false)
      setEditingBid(null)
    } catch (err) {
      toast.error('Failed to update bid')
    }
  }

  const handleWithdrawBid = async (id: string) => {
    if (confirm('Are you sure you want to withdraw this bid?')) {
      try {
        await withdrawBid(id)
        toast.success('Bid withdrawn successfully')
      } catch (err) {
        toast.error('Failed to withdraw bid')
      }
    }
  }

  const handleDeleteBid = async (id: string) => {
    if (confirm('Are you sure you want to delete this bid?')) {
      try {
        await deleteBid(id)
        toast.success('Bid deleted successfully')
      } catch (err) {
        toast.error('Failed to delete bid')
      }
    }
  }

  const handleAcceptBid = async (id: string) => {
    if (confirm('Are you sure you want to accept this bid?')) {
      try {
        await acceptBid(id)
        toast.success('Bid accepted successfully')
      } catch (err) {
        toast.error('Failed to accept bid')
      }
    }
  }

  const handleRejectBid = async (id: string) => {
    if (confirm('Are you sure you want to reject this bid?')) {
      try {
        await rejectBid(id)
        toast.success('Bid rejected successfully')
      } catch (err) {
        toast.error('Failed to reject bid')
      }
    }
  }

  const handleViewBid = async (id: string) => {
    try {
      const bid = await fetchBidById(id)
      setSelectedBid(bid)
    } catch (err) {
      toast.error('Failed to fetch bid details')
    }
  }

  const filteredBids = bids.filter(bid => {
    const matchesSearch = bid.serviceRequestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bid.proposedDetails?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || bid.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'withdrawn': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading && bids.length === 0) {
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
          <h2 className="text-2xl font-bold text-gray-900">Bid Management</h2>
          <p className="text-gray-600">Manage your bids and responses</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create Bid</span>
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.totalBids || 0}</div>
            <div className="text-sm text-gray-600">Total Bids</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-green-600">{stats.acceptedBids || 0}</div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingBids || 0}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="text-2xl font-bold text-red-600">{stats.rejectedBids || 0}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search bids..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FiFilter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Bids Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service Request
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bid Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBids.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {bid.serviceRequestId}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {bid.proposedDetails}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(bid.bidAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bid.startDate && bid.endDate ? (
                      <div>
                        <div className="text-sm">{new Date(bid.startDate).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">to {new Date(bid.endDate).toLocaleDateString()}</div>
                      </div>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(bid.status)}`}>
                      {bid.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewBid(bid.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Bid"
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      {bid.status === 'pending' && (
                        <>
                          <button
                            onClick={() => {
                              setEditingBid(bid)
                              setShowEditModal(true)
                            }}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Edit Bid"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleWithdrawBid(bid.id)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Withdraw Bid"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {viewType === 'received' && bid.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAcceptBid(bid.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Accept Bid"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectBid(bid.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject Bid"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteBid(bid.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Bid"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBids.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No bids found</div>
          </div>
        )}
      </div>

      {/* Create Bid Modal */}
      {showCreateModal && (
        <CreateBidModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateBid}
        />
      )}

      {/* Edit Bid Modal */}
      {showEditModal && editingBid && (
        <EditBidModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setEditingBid(null)
          }}
          bid={editingBid}
          onSubmit={(data: any) => handleUpdateBid(editingBid.id, data)}
        />
      )}

      {/* View Bid Modal */}
      {selectedBid && (
        <ViewBidModal
          isOpen={!!selectedBid}
          onClose={() => setSelectedBid(null)}
          bid={selectedBid}
          onAccept={handleAcceptBid}
          onReject={handleRejectBid}
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
function CreateBidModal({ isOpen, onClose, onSubmit }: any) {
  return null
}

function EditBidModal({ isOpen, onClose, bid, onSubmit }: any) {
  return null
}

function ViewBidModal({ isOpen, onClose, bid, onAccept, onReject }: any) {
  return null
}
