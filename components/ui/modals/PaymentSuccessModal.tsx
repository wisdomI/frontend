'use client'

import React from 'react'
import { FiX, FiCheck } from 'react-icons/fi'

interface PaymentSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
  actionText?: string
  onAction?: () => void
}

export default function PaymentSuccessModal({ 
  isOpen, 
  onClose, 
  message,
  actionText,
  onAction
}: PaymentSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-auto relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1"
        >
          <FiX className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6 pt-8">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <FiCheck className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-yellow-400 rounded-full"></div>
            </div>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Successful</h3>
          
          {/* Message */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2">{message}</p>
            {actionText && (
              <button
                onClick={onAction}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {actionText}
              </button>
            )}
          </div>
          
          {/* Done Button */}
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
