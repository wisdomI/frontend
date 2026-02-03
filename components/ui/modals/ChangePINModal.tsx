'use client'

import React, { useState } from 'react'
import { FiX, FiArrowLeft } from 'react-icons/fi'

interface ChangePINModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onSubmit: (payload: {
    oldPin: string
    newPin: string
    confirmNewPin: string
  }) => Promise<void>
}

export default function ChangePINModal({
  isOpen,
  onClose,
  onSuccess,
  onSubmit,
}: ChangePINModalProps) {
  const [oldPin, setOldPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handlePinChange = (value: string, setter: (value: string) => void) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setter(value)
    }
  }

  const handleContinue = async () => {
    if (!isFormValid || submitting) return

    try {
      setSubmitting(true)
      setError(null)
      await onSubmit({ oldPin, newPin, confirmNewPin: confirmPin })
      onSuccess()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to change PIN')
    } finally {
      setSubmitting(false)
    }
  }

  const isFormValid = oldPin.length === 4 && newPin.length === 4 && confirmPin.length === 4 && newPin === confirmPin

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">Change PIN</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Enter Old PIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Enter Old 4-digit PIN</label>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={oldPin[index] || ''}
                  onChange={(e) => {
                    const newOldPin = oldPin.split('')
                    newOldPin[index] = e.target.value
                    handlePinChange(newOldPin.join(''), setOldPin)
                  }}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ))}
            </div>
          </div>

          {/* Enter New PIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Enter New 4-digit PIN</label>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={newPin[index] || ''}
                  onChange={(e) => {
                    const newNewPin = newPin.split('')
                    newNewPin[index] = e.target.value
                    handlePinChange(newNewPin.join(''), setNewPin)
                  }}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ))}
            </div>
          </div>

          {/* Confirm PIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Confirm 4-digit PIN</label>
            <div className="flex justify-center gap-3">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={confirmPin[index] || ''}
                  onChange={(e) => {
                    const newConfirmPin = confirmPin.split('')
                    newConfirmPin[index] = e.target.value
                    handlePinChange(newConfirmPin.join(''), setConfirmPin)
                  }}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!isFormValid || submitting}
            className={`w-full py-3 font-semibold rounded-lg transition-colors ${
              isFormValid
                ? 'text-white'
                : 'text-gray-400 bg-gray-100 cursor-not-allowed'
            }`}
            style={{ backgroundColor: isFormValid ? '#032D71' : undefined }}
          >
            {submitting ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
