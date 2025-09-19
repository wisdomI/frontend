'use client'

import React from 'react'
import { FiX, FiCheck } from 'react-icons/fi'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'withdrawal' | 'bank-update' | 'account-creation' | 'profile-completion'
  withdrawalData?: {
    amount: string
    recipientName: string
    bankInfo: string
  }
  message?: string
  onLogin?: () => void
  verificationType?: string
}

export default function SuccessModal({ 
  isOpen, 
  onClose, 
  type,
  withdrawalData,
  message,
  onLogin,
  verificationType
}: SuccessModalProps) {
  if (!isOpen) return null

  const getContent = () => {
    if (type === 'withdrawal' && withdrawalData) {
      return {
        title: 'Successful',
        message: `You have successfully withdrawn ${withdrawalData.amount} to`,
        details: `${withdrawalData.recipientName} - ${withdrawalData.bankInfo}`
      }
    } else if (type === 'bank-update') {
      return {
        title: 'Successful',
        message: 'You have successfully updated your Bank details',
        details: ''
      }
    } else if (type === 'account-creation') {
      return {
        title: 'Account Created!',
        message: message || 'Your account has been successfully created!',
        details: verificationType ? `Please verify your ${verificationType.toLowerCase()}` : ''
      }
    } else if (type === 'profile-completion') {
      return {
        title: 'Profile Complete!',
        message: message || 'Your profile setup has been completed successfully!',
        details: 'Redirecting to dashboard...'
      }
    }
    return { title: '', message: '', details: '' }
  }

  const content = getContent()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl border-2 border-green-500 w-full max-w-sm mx-auto relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1"
        >
          <FiX className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="p-6 pt-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <FiCheck className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
          </div>
          
          {/* Message */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{content.message}</p>
            {content.details && (
              <p className="text-sm font-semibold text-blue-600">{content.details}</p>
            )}
          </div>
          
          {/* Login Button for Account Creation */}
          {type === 'account-creation' && onLogin && (
            <div className="mt-6">
              <button
                onClick={onLogin}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login to Your Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}