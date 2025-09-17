'use client'

import React from 'react'
import { FiX } from 'react-icons/fi'

interface PendingPayoutNotificationProps {
  isOpen: boolean
  onClose: () => void
  amount: string
  dueDate: string
}

export default function PendingPayoutNotification({ 
  isOpen, 
  onClose, 
  amount,
  dueDate
}: PendingPayoutNotificationProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border-2 border-yellow-400 w-full max-w-sm mx-auto relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1"
        >
          <FiX className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6 pt-8">
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pending Payout</h3>
          
          {/* Amount */}
          <div className="text-center mb-4">
            <p className="text-2xl font-bold text-blue-600">{amount}</p>
          </div>
          
          {/* Due Date */}
          <div className="text-center">
            <p className="text-sm text-gray-600">Due Date: {dueDate}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
