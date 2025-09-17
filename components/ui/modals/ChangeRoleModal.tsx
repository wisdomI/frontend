'use client'

import React from 'react'
import { FiX, FiArrowLeft, FiAlertTriangle } from 'react-icons/fi'

interface ChangeRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  action: 'Enable' | 'Disable'
}

export default function ChangeRoleModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  action
}: ChangeRoleModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1">
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Change Role</h2>
          </div>
          <button onClick={onClose} className="p-1">
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <FiAlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div className="absolute inset-0 w-16 h-16 border-2 border-red-200 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Confirmation Text */}
          <h3 className="text-lg font-semibold text-blue-600 mb-4">Confirmation</h3>
          <p className="text-gray-700 mb-8">
            Would you like to {action} the Profile?
          </p>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-4 text-white font-medium rounded-lg transition-colors"
              style={{ backgroundColor: '#032D71' }}
            >
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
