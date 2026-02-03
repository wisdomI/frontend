'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'

interface AccountTypeSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectAccountType: (type: 'individual' | 'vendor') => void
}

export default function AccountTypeSelectionModal({ 
  isOpen, 
  onClose, 
  onSelectAccountType 
}: AccountTypeSelectionModalProps) {
  const [selectedType, setSelectedType] = useState<'individual' | 'vendor' | null>(null)

  const handleSelect = (type: 'individual' | 'vendor') => {
    setSelectedType(type)
    // Immediately proceed with selection
    onSelectAccountType(type)
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold hover:opacity-90 z-10"
        >
          ✕
        </button>

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-600 mb-2">Which of these best describes you?</h2>
            <p className="text-gray-600">Let us know the kind of account you want to create.</p>
          </div>

          {/* Account Type Options */}
          <div className="flex gap-6 justify-center">
            {/* Individual/Organization Option */}
            <div
              onClick={() => handleSelect('individual')}
              className={`w-48 h-48 rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-6 ${
                selectedType === 'individual'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                selectedType === 'individual' ? 'bg-blue-500' : 'bg-blue-100'
              }`}>
                <svg className={`w-8 h-8 ${selectedType === 'individual' ? 'text-white' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <p className={`text-center font-medium text-sm leading-tight ${
                selectedType === 'individual' ? 'text-white' : 'text-gray-700'
              }`}>
                I am an Individual/Organization looking for a Service
              </p>
            </div>

            {/* Event Vendor Option */}
            <div
              onClick={() => handleSelect('vendor')}
              className={`w-48 h-48 rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center justify-center p-6 ${
                selectedType === 'vendor'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                selectedType === 'vendor' ? 'bg-blue-500' : 'bg-blue-100'
              }`}>
                <svg className={`w-8 h-8 ${selectedType === 'vendor' ? 'text-white' : 'text-blue-600'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
              </div>
              <p className={`text-center font-medium text-sm leading-tight ${
                selectedType === 'vendor' ? 'text-white' : 'text-gray-700'
              }`}>
                I am an Event Vendor providing a service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
