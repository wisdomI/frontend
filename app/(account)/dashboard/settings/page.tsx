'use client';

import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import SuccessNotification from '@/components/ui/SuccessNotification';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Notification');
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    // Project & Event Updates
    vendorPartnerAdded: true,
    vendorAcceptDecline: false,
    newChatMessage: false,

    // Payments & Finance
    escrowDepositConfirmed: true,
    refundProcessed: false,
    outstandingPaymentReminder: false,

    // Communication Channels
    inApp: true,
    email: false,
    sms: false,

    // Platform Updates
    newFeatures: true,
    newsletter: false
  });

  // Integration settings state
  const [integrationSettings, setIntegrationSettings] = useState({
    // Calendar Sync
    calendarConnected: false,

    // Sync Preferences
    vendorMeetings: true,
    siteVisits: true,
    planningDeadlines: true,
    paymentDueDates: false,
    followUpReminders: false,

    // Sync Frequency
    syncFrequency: 'Every 15 minutes',
    defaultReminderTime: '1 Hour before'
  });

  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleIntegrationToggle = (setting: string) => {
    setIntegrationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleSaveChanges = () => {
    setShowSuccessNotification(true);
  };

  const tabs = ['Notification', 'Integrations'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">General Settings</h1>

        {/* Tab Navigation */}
        <div className="bg-blue-900 rounded-lg p-1 mb-8 inline-flex w-full max-w-md">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === tab
                  ? 'bg-white text-blue-900 shadow-sm'
                  : 'text-white hover:text-blue-100'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification Tab */}
        {activeTab === 'Notification' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <p className="text-gray-600 mb-8">Please select the types of notifications you would like to receive</p>

            {/* Project & Event Updates */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project & Event Updates</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Vendor Partner Added or Updated a Task</span>
                  <button
                    onClick={() => handleNotificationToggle('vendorPartnerAdded')}
                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.vendorPartnerAdded ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.vendorPartnerAdded ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Vendor Accept/Decline Offer</span>
                  <button
                    onClick={() => handleNotificationToggle('vendorAcceptDecline')}
                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.vendorAcceptDecline ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.vendorAcceptDecline ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">New Chat Message (Vendor/Planner)</span>
                  <button
                    onClick={() => handleNotificationToggle('newChatMessage')}
                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.newChatMessage ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.newChatMessage ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Payments & Finance */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments & Finance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Escrow Deposit Confirmed</span>
                  <button
                    onClick={() => handleNotificationToggle('escrowDepositConfirmed')}
                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.escrowDepositConfirmed ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.escrowDepositConfirmed ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Refund Processed</span>
                  <button
                    onClick={() => handleNotificationToggle('refundProcessed')}
                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.refundProcessed ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.refundProcessed ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Outstanding Payment Reminder</span>
                  <button
                    onClick={() => handleNotificationToggle('outstandingPaymentReminder')}
                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.outstandingPaymentReminder ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.outstandingPaymentReminder ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Communication Channels */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Channels</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">In-app</span>
                  <button
                    onClick={() => handleNotificationToggle('inApp')}
                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.inApp ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.inApp ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email</span>
                  <button
                    onClick={() => handleNotificationToggle('email')}
                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.email ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.email ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">SMS</span>
                  <button
                    onClick={() => handleNotificationToggle('sms')}
                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.sms ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.sms ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Platform Updates */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Updates</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">New Features/Documents</span>
                  <button
                    onClick={() => handleNotificationToggle('newFeatures')}
                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.newFeatures ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.newFeatures ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Newsletter/Blogs</span>
                  <button
                    onClick={() => handleNotificationToggle('newsletter')}
                    className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.newsletter ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.newsletter ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'Integrations' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            {/* Calendar Sync Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Calendar Sync</h3>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-blue-600" size={32} />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Connect Your Calendar</h4>
                <p className="text-gray-600 mb-6">Stay organized by syncing your event planning activities with your personal calendar</p>

                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto">
                  <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
                    <span className="text-blue-600 text-xs font-bold">G</span>
                  </div>
                  Connect Google Calendar
                </button>
              </div>
            </div>

            {/* Sync Preferences */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sync Preferences</h3>
              <p className="text-gray-600 mb-6">What to sync:</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={integrationSettings.vendorMeetings}
                    onChange={() => handleIntegrationToggle('vendorMeetings')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Vendor meetings & consultations</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={integrationSettings.siteVisits}
                    onChange={() => handleIntegrationToggle('siteVisits')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Site visits & venue tours</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={integrationSettings.planningDeadlines}
                    onChange={() => handleIntegrationToggle('planningDeadlines')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Planning deadlines & milestones</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={integrationSettings.paymentDueDates}
                    onChange={() => handleIntegrationToggle('paymentDueDates')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Payment due dates</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={integrationSettings.followUpReminders}
                    onChange={() => handleIntegrationToggle('followUpReminders')}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Follow-up reminders</span>
                </div>
              </div>

              {/* Sync Frequency and Default Reminder Time */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sync Frequency
                  </label>
                  <div className="relative">
                    <select
                      value={integrationSettings.syncFrequency}
                      onChange={(e) => setIntegrationSettings(prev => ({ ...prev, syncFrequency: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option value="Every 15 minutes">Every 15 minutes</option>
                      <option value="Every 30 minutes">Every 30 minutes</option>
                      <option value="Every hour">Every hour</option>
                      <option value="Every 2 hours">Every 2 hours</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default reminder time
                  </label>
                  <div className="relative">
                    <select
                      value={integrationSettings.defaultReminderTime}
                      onChange={(e) => setIntegrationSettings(prev => ({ ...prev, defaultReminderTime: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
                    >
                      <option value="15 minutes before">15 minutes before</option>
                      <option value="30 minutes before">30 minutes before</option>
                      <option value="1 Hour before">1 Hour before</option>
                      <option value="2 Hours before">2 Hours before</option>
                      <option value="1 Day before">1 Day before</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Changes Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSaveChanges}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Success Notification */}
      <SuccessNotification
        isOpen={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
        title="Successful"
        message="Your settings have been saved successfully."
      />
    </div>
  );
}