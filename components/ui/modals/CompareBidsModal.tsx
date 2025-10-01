'use client'

import { useState } from 'react'
import { FiX, FiEye, FiCheck } from 'react-icons/fi'

interface Bid {
  id: number
  vendorName: string
  vendorLogo: string
  proposal: string
  deliveryTimeline: string
}

interface CompareBidsModalProps {
  isOpen: boolean
  onClose: () => void
  serviceTitle: string
  bids: Bid[]
  onAcceptOffer: (bidId: number) => void
  onRejectOffer: (bidId: number) => void
}

export default function CompareBidsModal({
  isOpen,
  onClose,
  serviceTitle,
  bids,
  onAcceptOffer,
  onRejectOffer
}: CompareBidsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Compare Bids</h2>
            <p className="text-gray-600 mt-1">{serviceTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Vendor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Proposal</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-blue-900">Delivery Timeline</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-blue-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bids.map((bid) => (
                  <tr key={bid.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-600">
                            {bid.vendorName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{bid.vendorName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-lg font-semibold text-gray-900">{bid.proposal}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-gray-600">{bid.deliveryTimeline}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onAcceptOffer(bid.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FiEye className="w-4 h-4" />
                          <span>Accept Offer</span>
                        </button>
                        <button
                          onClick={() => onRejectOffer(bid.id)}
                          className="flex items-center space-x-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <FiX className="w-4 h-4" />
                          <span>Reject Offer</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
