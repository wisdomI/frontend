'use client'

import React, { useState } from 'react'
import { FiX, FiArrowLeft } from 'react-icons/fi'

interface WithdrawEarningsModalProps {
  isOpen: boolean
  onClose: () => void
  onContinue: (amount: string, bankName: string, accountNumber: string) => void
  balance: string
}

export default function WithdrawEarningsModal({ 
  isOpen, 
  onClose, 
  onContinue, 
  balance 
}: WithdrawEarningsModalProps) {
  const [amount, setAmount] = useState('₦ 50,000.00')
  const [bankName, setBankName] = useState('Access Bank')
  const [accountNumber, setAccountNumber] = useState('6318777898')

  if (!isOpen) return null

  const handleContinue = () => {
    onContinue(amount, bankName, accountNumber)
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
            <h2 className="text-lg font-semibold text-gray-900">Withdraw Earnings</h2>
          </div>
          <button onClick={onClose} className="p-1">
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (Balance: {balance})
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
            />
          </div>

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

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            className="w-full py-3 text-white font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: '#032D71' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}
