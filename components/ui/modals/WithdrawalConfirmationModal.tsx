'use client'

import React, { useState } from 'react'
import { FiX, FiArrowLeft } from 'react-icons/fi'

interface WithdrawalConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  amount: string
  recipientName: string
  bankInfo: string
}

export default function WithdrawalConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  amount,
  recipientName,
  bankInfo
}: WithdrawalConfirmationModalProps) {
  const [pin, setPin] = useState(['', '', '', ''])

  if (!isOpen) return null

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newPin = [...pin]
    newPin[index] = value
    setPin(newPin)
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`)
      prevInput?.focus()
    }
  }

  const isPinComplete = pin.every(digit => digit !== '')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-1">
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">Withdrawal Confirmation</h2>
          </div>
          <button onClick={onClose} className="p-1">
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Withdrawal Details */}
          <div className="text-center space-y-4">
            <p className="text-gray-600">You are about to withdraw</p>
            
            {/* Amount Display */}
            <div 
              className="px-6 py-4 rounded-lg text-white font-bold text-xl"
              style={{ backgroundColor: '#032D71' }}
            >
              {amount}
            </div>
            
            <p className="text-gray-600">to</p>
            
            {/* Recipient Info */}
            <div className="space-y-1">
              <p className="text-blue-600 font-medium">{recipientName}</p>
              <p className="text-blue-600 font-medium">{bankInfo}</p>
            </div>
          </div>

          {/* PIN Input */}
          <div className="space-y-3">
            <p className="text-gray-700 font-medium">Enter your 4-digit PIN</p>
            <div className="flex gap-3 justify-center">
              {pin.map((digit, index) => (
                <input
                  key={index}
                  id={`pin-${index}`}
                  type="password"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                />
              ))}
            </div>
          </div>

          {/* Withdraw Button */}
          <button
            onClick={onConfirm}
            disabled={!isPinComplete}
            className={`w-full py-3 text-white font-semibold rounded-lg transition-colors ${
              isPinComplete 
                ? 'opacity-100' 
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ backgroundColor: '#032D71' }}
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  )
}
