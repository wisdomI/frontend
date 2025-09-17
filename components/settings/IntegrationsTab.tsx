'use client'

import React, { useState } from 'react'
import { FiCalendar, FiChevronDown } from 'react-icons/fi'
import CalendarSyncSuccessModal from '@/components/ui/modals/CalendarSyncSuccessModal'

export default function IntegrationsTab() {
  const [isConnected, setIsConnected] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [syncPreferences, setSyncPreferences] = useState({
    busyFreeStatus: true,
    eventTitles: true,
    eventDetails: false,
    syncFrequency: 'Every 15 minutes',
    timeRange: 'Next 60 days'
  })

  const handleConnectCalendar = () => {
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true)
      setIsSuccessModalOpen(true)
    }, 1000)
  }

  const handleSyncPreferenceChange = (key: string, value: boolean | string) => {
    setSyncPreferences(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSaveChanges = () => {
    // Handle save changes
    console.log('Saving sync preferences:', syncPreferences)
  }

  return (
    <div className="p-6">
      {/* Calendar Sync Section */}
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCalendar className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect Your Calendar</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm">
          Sync your Google Calendar to automatically show your availability to clients and prevent double bookings.
        </p>
        <button
          onClick={handleConnectCalendar}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
            <span className="text-blue-600 text-xs font-bold">31</span>
          </div>
          Connect Google Calendar
        </button>
      </div>

      {/* Sync Preferences Section */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Sync Preferences</h3>
        
        <div className="space-y-6">
          {/* What to sync */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">What to sync:</h4>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={syncPreferences.busyFreeStatus}
                  onChange={(e) => handleSyncPreferenceChange('busyFreeStatus', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 text-sm font-medium">Busy/Free status</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={syncPreferences.eventTitles}
                  onChange={(e) => handleSyncPreferenceChange('eventTitles', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 text-sm font-medium">Event titles</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={syncPreferences.eventDetails}
                  onChange={(e) => handleSyncPreferenceChange('eventDetails', e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-gray-700 text-sm font-medium">Event details</span>
              </label>
            </div>
          </div>

          {/* Sync Frequency */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Sync Frequency</h4>
            <div className="relative">
              <select
                value={syncPreferences.syncFrequency}
                onChange={(e) => handleSyncPreferenceChange('syncFrequency', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="Every 15 minutes">Every 15 minutes</option>
                <option value="Every 30 minutes">Every 30 minutes</option>
                <option value="Every 60 minutes">Every 60 minutes</option>
                <option value="Every 2 hours">Every 2 hours</option>
                <option value="Everyday">Everyday</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Time Range */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Time Range</h4>
            <div className="relative">
              <select
                value={syncPreferences.timeRange}
                onChange={(e) => handleSyncPreferenceChange('timeRange', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="Next 30 days">Next 30 days</option>
                <option value="Next 60 days">Next 60 days</option>
                <option value="Next 90 days">Next 90 days</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSaveChanges}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <CalendarSyncSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  )
}
