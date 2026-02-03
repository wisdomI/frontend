'use client'

import React from 'react'
import MessageManager from '@/components/messaging/MessageManager'

const VendorMessagesPage = () => {
  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <MessageManager />
      </div>
    </div>
  )
}

export default VendorMessagesPage