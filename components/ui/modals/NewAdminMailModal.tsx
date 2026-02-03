'use client'

import React from 'react'
import Image from 'next/image'
import primaryLogo from '@/public/images/primary-logo 3.png'

interface NewAdminMailModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  email: string
  phoneNumber?: string
  name?: string
  password?: string
}

export default function NewAdminMailModal({ isOpen, onClose, onConfirm, email, phoneNumber, name, password }: NewAdminMailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <span className="text-gray-400">✉️</span> New Admin Mail
          </h2>
        </div>

        {/* Email Preview Content */}
        <div className="flex-1 p-8 bg-gray-50 flex justify-center">
          <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm space-y-6">
            <div className="text-center">
              <div className="inline-block relative h-10 w-32 mb-2">
                 {/* Using text fallback if image fails, but logic is same as header */}
                 <span className="text-2xl font-bold text-[#0B2E6F] font-raleway">EventHub</span>
              </div>
            </div>

            <div className="space-y-4 text-gray-600 text-sm">
              <p>Hello {name || 'Admin'},</p>
              <p>Welcome to Event Hub! You have been added as an Admin.</p>
            </div>

            <div className="bg-blue-50/50 p-6 rounded-lg space-y-3">
              <p className="font-medium text-gray-900">Your Login Credentials:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Email: {email}</li>
                <li>• Default Password: {password || process.env.NEXT_PUBLIC_DEFAULT_ADMIN_PASSWORD || 'EventHub@2024!'}</li>
                <li>• Phone number: {phoneNumber || 'Not provided'}</li>
              </ul>
            </div>

            <p className="text-sm text-gray-600">
              You will be required to change your password upon first login.
            </p>

            <div className="pt-4 pb-4">
              <button className="w-full bg-[#0B2E6F] text-white py-3 rounded-lg font-medium text-sm hover:bg-[#09255a] transition-colors">
                Login to Admin Portal
              </button>
            </div>

            <p className="text-xs text-gray-400 text-center">
              © 2025 Event Hub. All rights reserved.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-8 py-2.5 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors min-w-[140px]"
          >
            Send Mail
          </button>
          <button
            onClick={onClose}
            className="px-8 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors min-w-[140px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

