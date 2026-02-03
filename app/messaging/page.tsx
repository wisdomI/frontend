'use client'

import React from 'react'
import MessageManager from '@/components/messaging/MessageManager'

export default function MessagingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-2">Communicate with other users</p>
        </div>

        {/* Message Manager */}
        <MessageManager />
      </div>
    </div>
  )
}
