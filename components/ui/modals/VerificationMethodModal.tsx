'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'

interface VerificationMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectMethod: (method: 'email' | 'phone') => void
}

export default function VerificationMethodModal({ 
  isOpen, 
  onClose, 
  onSelectMethod 
}: VerificationMethodModalProps) {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Verification</h2>
          <button
            onClick={onClose}
            className="bg-blue-600 h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold hover:opacity-90"
          >
            ✕
          </button>
        </div>

        {/* Subtitle */}
        <div className="px-6 pt-4">
          <p className="text-gray-600 text-sm">Choose how you would like to verify your profile.</p>
        </div>

        {/* Verification Options */}
        <div className="p-6 space-y-4">
          {/* Email Option */}
          <div
            onClick={() => onSelectMethod('email')}
            className="p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Email</h3>
                <p className="text-gray-600 text-sm">We will send a verification code to your email address</p>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Phone Option */}
          <div
            onClick={() => onSelectMethod('phone')}
            className="p-4 rounded-lg border border-gray-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">Phone</h3>
                <p className="text-gray-600 text-sm">We will send SMS with a verification code to your phone</p>
              </div>
              <div className="text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
