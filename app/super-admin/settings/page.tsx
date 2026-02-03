'use client'

import React, { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'General' | 'Security' | 'Notifications'>('General')

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Settings</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-xl border-b border-gray-200 px-6 pt-2">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('General')}
              className={`pb-4 text-base font-medium transition-colors relative ${
                activeTab === 'General'
                  ? 'text-[#0B2E6F] border-b-2 border-[#0B2E6F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              General
            </button>
            <button
              onClick={() => setActiveTab('Security')}
              className={`pb-4 text-base font-medium transition-colors relative ${
                activeTab === 'Security'
                  ? 'text-[#0B2E6F] border-b-2 border-[#0B2E6F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab('Notifications')}
              className={`pb-4 text-base font-medium transition-colors relative ${
                activeTab === 'Notifications'
                  ? 'text-[#0B2E6F] border-b-2 border-[#0B2E6F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Notifications
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-b-xl shadow-sm p-8 min-h-[400px]">
          {activeTab === 'General' && <GeneralSettings />}
          {activeTab === 'Security' && <SecuritySettings />}
          {activeTab === 'Notifications' && <NotificationSettings />}
        </div>
      </div>
    </div>
  )
}

function GeneralSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [allowRegistrations, setAllowRegistrations] = useState(true)

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="space-y-2">
        <label className="text-base font-medium text-gray-900 block">Contact email</label>
        <input
          type="email"
          defaultValue="admin@example.com"
          className="w-full max-w-md h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900">Maintenance Mode</h3>
          <p className="text-sm text-gray-500">Enable to prevent user access</p>
        </div>
        <Toggle checked={maintenanceMode} onChange={setMaintenanceMode} />
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900">Allow new registrations</h3>
          <p className="text-sm text-gray-500">Enable user sign-ups</p>
        </div>
        <Toggle checked={allowRegistrations} onChange={setAllowRegistrations} />
      </div>

      <div className="pt-8 flex gap-4 justify-center">
        <button className="px-12 py-3 border border-[#0B2E6F] text-[#0B2E6F] font-medium rounded-lg hover:bg-blue-50 transition-colors">
          Cancel
        </button>
        <button className="px-12 py-3 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}

function SecuritySettings() {
  const [sessionTimeout, setSessionTimeout] = useState(true)
  const [ipWhitelist, setIpWhitelist] = useState(false)

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between py-2">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900">Sessions Time-out</h3>
          <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
        </div>
        <Toggle checked={sessionTimeout} onChange={setSessionTimeout} />
      </div>

      <div className="space-y-2">
        <label className="text-base font-medium text-gray-900 block">Time-out Duration (Minutes)</label>
        <div className="relative max-w-md">
          <input
            type="number"
            defaultValue="30"
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
          />
        </div>
      </div>

      <div className="flex items-center justify-between py-2 mt-8">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900">IP Whitelist</h3>
          <p className="text-sm text-gray-500">Restrict access by IP</p>
        </div>
        <Toggle checked={ipWhitelist} onChange={setIpWhitelist} />
      </div>

      <div className="space-y-2">
        <label className="text-base font-medium text-gray-900 block">Max Login Attempts</label>
        <div className="relative max-w-md">
          <input
            type="number"
            defaultValue="5"
            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B2E6F]/20 focus:border-[#0B2E6F]"
          />
        </div>
      </div>

      <div className="pt-8 flex gap-4 justify-center">
        <button className="px-12 py-3 border border-[#0B2E6F] text-[#0B2E6F] font-medium rounded-lg hover:bg-blue-50 transition-colors">
          Cancel
        </button>
        <button className="px-12 py-3 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}

function NotificationSettings() {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [newRegistrations, setNewRegistrations] = useState(true)
  const [transactionAlerts, setTransactionAlerts] = useState(true)
  const [disputes, setDisputes] = useState(true)
  const [systemErrors, setSystemErrors] = useState(true)

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between py-2">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900">Email Notifications</h3>
          <p className="text-sm text-gray-500">Send email alerts to admins</p>
        </div>
        <Toggle checked={emailAlerts} onChange={setEmailAlerts} />
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900">New User Registrations</h3>
          <p className="text-sm text-gray-500">Notify on new sign-ups</p>
        </div>
        <Toggle checked={newRegistrations} onChange={setNewRegistrations} />
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900">Transaction Alerts</h3>
          <p className="text-sm text-gray-500">Notify on large transactions</p>
        </div>
        <Toggle checked={transactionAlerts} onChange={setTransactionAlerts} />
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900">Disputes Notifications</h3>
          <p className="text-sm text-gray-500">Notify on new disputes</p>
        </div>
        <Toggle checked={disputes} onChange={setDisputes} />
      </div>

      <div className="flex items-center justify-between py-2">
        <div className="space-y-1">
          <h3 className="text-base font-medium text-gray-900">System Error Alerts</h3>
          <p className="text-sm text-gray-500">Notify on critical errors</p>
        </div>
        <Toggle checked={systemErrors} onChange={setSystemErrors} />
      </div>

      <div className="pt-8 flex gap-4 justify-center">
        <button className="px-12 py-3 border border-[#0B2E6F] text-[#0B2E6F] font-medium rounded-lg hover:bg-blue-50 transition-colors">
          Cancel
        </button>
        <button className="px-12 py-3 bg-[#0B2E6F] text-white font-medium rounded-lg hover:bg-[#09255a] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#0B2E6F]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
