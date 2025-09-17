'use client'

import React, { useState } from 'react'
import { FiX, FiArrowLeft } from 'react-icons/fi'

interface ChangeBankDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (bankName: string, accountNumber: string) => void
}

export default function ChangeBankDetailsModal({ 
  isOpen, 
  onClose, 
  onSave 
}: ChangeBankDetailsModalProps) {
  const [bankName, setBankName] = useState('Access Bank')
  const [accountNumber, setAccountNumber] = useState('6318777898')

  if (!isOpen) return null

  const handleSave = () => {
    onSave(bankName, accountNumber)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1">
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Change Bank Details</h2>
          </div>
          <button onClick={onClose} className="p-1">
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Bank Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bank Name
            </label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
            />
          </div>

          {/* Account Number Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Number
            </label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
            />
            <p className="text-sm text-gray-600 mt-1">Daniel Martins</p>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 text-white font-semibold rounded-lg transition-colors"
              style={{ backgroundColor: '#032D71' }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
