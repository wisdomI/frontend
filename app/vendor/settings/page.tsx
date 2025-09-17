'use client'

import React, { useState } from 'react'
import NotificationTab from '@/components/settings/NotificationTab'
import PINSetupTab from '@/components/settings/PINSetupTab'
import IntegrationsTab from '@/components/settings/IntegrationsTab'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'Notification' | 'PIN Setup' | 'Integrations'>('Notification')

  const tabs = [
    { id: 'Notification', label: 'Notification' },
    { id: 'PIN Setup', label: 'PIN Setup' },
    { id: 'Integrations', label: 'Integrations' }
  ] as const

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'Notification' && <NotificationTab />}
          {activeTab === 'PIN Setup' && <PINSetupTab />}
          {activeTab === 'Integrations' && <IntegrationsTab />}
        </div>
      </div>
    </div>
  )
}