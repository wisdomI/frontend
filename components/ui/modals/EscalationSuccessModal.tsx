'use client'

import React from 'react'
import { FiX, FiCheck } from 'react-icons/fi'

interface EscalationSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EscalationSuccessModal({ isOpen, onClose }: EscalationSuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-auto relative p-8 text-center">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1 bg-[#0B2E6F] rounded text-white"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-teal-500 rounded-full flex items-center justify-center mb-6 border-4 border-teal-100">
            <FiCheck className="w-10 h-10 text-white" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2">Escalation review done successfully</h3>
          <p className="text-gray-600 mb-8">You have successfully resolved the escalation</p>
          
          <button
            onClick={onClose}
            className="w-full bg-[#0B2E6F] text-white py-3 rounded-lg font-medium hover:bg-[#09255a] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}

