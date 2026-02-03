'use client'

import React from 'react'
import ClientPageHeader from '@/components/client/ClientPageHeader'
import MessageManager from '@/components/messaging/MessageManager'

const ClientMessagesPage = () => {
  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <ClientPageHeader
        breadcrumbs={[{ label: 'Messages', isActive: true }]}
        title="Messages"
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <MessageManager />
      </div>
    </div>
  )
}

export default ClientMessagesPage