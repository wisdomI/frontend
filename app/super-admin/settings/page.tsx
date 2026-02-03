'use client'

import React, { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general')

  // Form States
  const [general, setGeneral] = useState({
    email: 'admin@example.com',
    maintenanceMode: false,
    allowRegistrations: true
  })

  const [security, setSecurity] = useState({
    sessionTimeout: true,
    timeoutDuration: 30,
    ipWhitelist: false,
    maxLoginAttempts: 5
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newRegistrations: true,
    transactionAlerts: true,
    disputesNotifications: true,
    systemErrorAlerts: true
  })

  const handleGeneralChange = (field: string, value: any) => {
    setGeneral(prev => ({ ...prev, [field]: value }))
  }

  const handleSecurityChange = (field: string, value: any) => {
    setSecurity(prev => ({ ...prev, [field]: value }))
  }

  const handleNotificationsChange = (field: string, value: any) => {
    setNotifications(prev => ({ ...prev, [field]: value }))
  }

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? 'bg-[#0B2E6F]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 font-raleway mb-6">Settings</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('general')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'general'
                    ? 'border-[#0B2E6F] text-[#0B2E6F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                General
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'security'
                    ? 'border-[#0B2E6F] text-[#0B2E6F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'notifications'
                    ? 'border-[#0B2E6F] text-[#0B2E6F]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Notifications
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8 min-h-[400px]">
            {activeTab === 'general' && (
              <div className="space-y-8 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Contact email</label>
                  <input
                    type="email"
                    value={general.email}
                    onChange={(e) => handleGeneralChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] text-sm"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Maintenance Mode</h3>
                    <p className="text-xs text-gray-500 mt-1">Enable to prevent user access</p>
                  </div>
                  <Toggle
                    checked={general.maintenanceMode}
                    onChange={(checked) => handleGeneralChange('maintenanceMode', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Allow new registrations</h3>
                    <p className="text-xs text-gray-500 mt-1">Enable user sign-ups</p>
                  </div>
                  <Toggle
                    checked={general.allowRegistrations}
                    onChange={(checked) => handleGeneralChange('allowRegistrations', checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8 max-w-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Sessions Time-out</h3>
                    <p className="text-xs text-gray-500 mt-1">Auto-logout after inactivity</p>
                  </div>
                  <Toggle
                    checked={security.sessionTimeout}
                    onChange={(checked) => handleSecurityChange('sessionTimeout', checked)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Time-out Duration (Minutes)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={security.timeoutDuration}
                      onChange={(e) => handleSecurityChange('timeoutDuration', parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-200">
                      <button className="h-1/2 px-3 text-gray-500 hover:bg-gray-100 rounded-tr-lg">▲</button>
                      <button className="h-1/2 px-3 text-gray-500 hover:bg-gray-100 rounded-br-lg">▼</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">IP Whitelist</h3>
                    <p className="text-xs text-gray-500 mt-1">Restrict access by IP</p>
                  </div>
                  <Toggle
                    checked={security.ipWhitelist}
                    onChange={(checked) => handleSecurityChange('ipWhitelist', checked)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Max Login Attempts</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={security.maxLoginAttempts}
                      onChange={(e) => handleSecurityChange('maxLoginAttempts', parseInt(e.target.value))}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F] text-sm"
                    />
                    <div className="absolute inset-y-0 right-0 flex flex-col border-l border-gray-200">
                      <button className="h-1/2 px-3 text-gray-500 hover:bg-gray-100 rounded-tr-lg">▲</button>
                      <button className="h-1/2 px-3 text-gray-500 hover:bg-gray-100 rounded-br-lg">▼</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8 max-w-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                    <p className="text-xs text-gray-500 mt-1">Send email alerts to admins</p>
                  </div>
                  <Toggle
                    checked={notifications.emailNotifications}
                    onChange={(checked) => handleNotificationsChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">New User Registrations</h3>
                    <p className="text-xs text-gray-500 mt-1">Notify on new sign-ups</p>
                  </div>
                  <Toggle
                    checked={notifications.newRegistrations}
                    onChange={(checked) => handleNotificationsChange('newRegistrations', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Transaction Alerts</h3>
                    <p className="text-xs text-gray-500 mt-1">Notify on large transactions</p>
                  </div>
                  <Toggle
                    checked={notifications.transactionAlerts}
                    onChange={(checked) => handleNotificationsChange('transactionAlerts', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Disputes Notifications</h3>
                    <p className="text-xs text-gray-500 mt-1">Notify on new disputes</p>
                  </div>
                  <Toggle
                    checked={notifications.disputesNotifications}
                    onChange={(checked) => handleNotificationsChange('disputesNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">System Error Alerts</h3>
                    <p className="text-xs text-gray-500 mt-1">Notify on critical errors</p>
                  </div>
                  <Toggle
                    checked={notifications.systemErrorAlerts}
                    onChange={(checked) => handleNotificationsChange('systemErrorAlerts', checked)}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 pt-12 max-w-md mx-auto">
              <button className="flex-1 px-4 py-2.5 border border-[#0B2E6F] text-[#0B2E6F] font-medium rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button className="flex-1 px-4 py-2.5 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
