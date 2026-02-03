'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import NotificationTab from '@/components/settings/NotificationTab'
import PINSetupTab from '@/components/settings/PINSetupTab'
import IntegrationsTab from '@/components/settings/IntegrationsTab'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'Profile Setup' | 'Notification' | 'PIN Setup' | 'Integrations'>('Profile Setup')

  const tabs = [
    { id: 'Profile Setup', label: 'Profile Setup' },
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
                  ? 'text-event-blue border-b-2 border-event-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {activeTab === 'Profile Setup' && (
            <div className="p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-event-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Your Profile Setup</h3>
                <p className="text-gray-600 mb-6">Set up your business profile to start connecting with clients and growing your business.</p>
                <Link
                  href="/vendor/profile-setup"
                  className="inline-flex items-center px-6 py-3 bg-event-blue text-white rounded-lg hover:bg-event-blue-hover transition-colors font-medium"
                >
                  Go to Profile Setup
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
          {activeTab === 'Notification' && <NotificationTab />}
          {activeTab === 'PIN Setup' && <PINSetupTab />}
          {activeTab === 'Integrations' && <IntegrationsTab />}
        </div>
      </div>
    </div>
  )
}