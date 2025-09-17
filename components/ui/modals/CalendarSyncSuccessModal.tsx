'use client'

import React from 'react'
import { FiX, FiCheck } from 'react-icons/fi'

interface CalendarSyncSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CalendarSyncSuccessModal({ isOpen, onClose }: CalendarSyncSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto border-2 border-green-500">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Successful</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <p className="text-gray-700">You have successfully sync your calendar</p>
        </div>
      </div>
    </div>
  )
}
