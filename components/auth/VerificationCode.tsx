'use client'

import { FaTimes } from 'react-icons/fa'
import { useState } from 'react'

interface CodeVerificationModalProps {
  contact: string
  type: 'email' | 'phone'
  onVerify: (code: string) => void
  onResend: () => void
  onClose: () => void
}

export default function CodeVerificationModal({
  contact,
  type,
  onVerify,
  onResend,
  onClose,
}: CodeVerificationModalProps) {
  const [code, setCode] = useState('')

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-lg animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 bg-event-blue rounded"
        >
          <FaTimes />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-2 text-center text-blue-900">
          Verification
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Verify your {type === 'email' ? 'Email' : 'Phone Number'}
        </p>
        <p className="text-center text-gray-500 mb-6">
          Enter the 6-digit code sent to{' '}
          <span className="font-medium">{contact}</span>
        </p>

        {/* Code Input */}
        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={e => setCode(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />

        {/* Verify Button */}
        <button
          onClick={() => onVerify(code)}
          className="w-full bg-blue-900 text-white py-3 rounded-lg mt-4 hover:bg-blue-800"
        >
          Verify
        </button>

        {/* Resend Option */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <p className="text-sm text-gray-500">Didn't get code?</p>
          <button
            onClick={onResend}
            className="text-sm text-blue-700 font-medium hover:underline"
          >
            Resend
          </button>
        </div>
      </div>
    </div>
  )
}