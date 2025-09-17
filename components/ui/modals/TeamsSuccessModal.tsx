'use client'

import React from 'react'
import { FiX, FiCheck } from 'react-icons/fi'

interface TeamsSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'create-role' | 'profile-staff' | 'disable-profile'
}

export default function TeamsSuccessModal({ 
  isOpen, 
  onClose, 
  type
}: TeamsSuccessModalProps) {
  if (!isOpen) return null

  const getContent = () => {
    switch (type) {
      case 'create-role':
        return {
          title: 'Successful',
          message: 'You have created a new user role successfully.'
        }
      case 'profile-staff':
        return {
          title: 'Successful',
          message: 'You have profiled Elizabeth Odeh as a Support user successfully.'
        }
      case 'disable-profile':
        return {
          title: 'Successful',
          message: 'You have successfully disabled the profile'
        }
      default:
        return { title: '', message: '' }
    }
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
            {type === 'profile-staff' && (
              <p className="text-sm font-semibold text-blue-600">Elizabeth Odeh</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
