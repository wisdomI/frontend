'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface VerificationSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'email' | 'phone'
  onLogin: () => void
}

export default function VerificationSuccessModal({ 
  isOpen, 
  onClose, 
  type, 
  onLogin 
}: VerificationSuccessModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  const title = type === 'email' ? 'Email Verification Successful' : 'Phone number Verification Successful'

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold hover:opacity-90"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {/* Decorative dots */}
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
            {title}
          </h2>

          {/* Message */}
          <p className="text-gray-600 text-center mb-6">
            Your account has been created successfully
          </p>

          {/* Login Button */}
          <button
            onClick={onLogin}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
