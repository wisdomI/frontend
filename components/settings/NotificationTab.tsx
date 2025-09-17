'use client'

import React, { useState } from 'react'

export default function NotificationTab() {
  const [notifications, setNotifications] = useState({
    // Jobs & Project Alerts
    newJobMatches: true,
    clientPostedJob: false,
    newChatMessage: false,
    
    // Payments & Finance
    escrowDepositConfirmed: true,
    paymentReleased: false,
    refundCancellation: false,
    
    // Communication Channels
    inApp: true,
    email: false,
    sms: false,
    
    // Platform Promotion
    discounts: true,
    verificationUpdates: false
  })

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  return (
    <div className="p-6">
      <p className="text-gray-600 mb-8">
        Please select the types of notifications you would like to receive
      </p>

      <div className="space-y-6">
        {/* Jobs & Project Alerts */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Jobs & Project Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium">New Job Matches</span>
              <button
                onClick={() => handleToggle('newJobMatches')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.newJobMatches ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newJobMatches ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium">Client Posted a Job in my Category</span>
              <button
                onClick={() => handleToggle('clientPostedJob')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.clientPostedJob ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.clientPostedJob ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium">New Chat Message (Vendor/Planner)</span>
              <button
                onClick={() => handleToggle('newChatMessage')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.newChatMessage ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.newChatMessage ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Payments & Finance */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payments & Finance</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium">Escrow Deposit Confirmed</span>
              <button
                onClick={() => handleToggle('escrowDepositConfirmed')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.escrowDepositConfirmed ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.escrowDepositConfirmed ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium">Payment Released to Wallet</span>
              <button
                onClick={() => handleToggle('paymentReleased')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.paymentReleased ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.paymentReleased ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium">Refund/Cancellation Notice</span>
              <button
                onClick={() => handleToggle('refundCancellation')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.refundCancellation ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.refundCancellation ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Communication Channels */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Communication Channels</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium">In-app</span>
              <button
                onClick={() => handleToggle('inApp')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.inApp ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.inApp ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium">Email</span>
              <button
                onClick={() => handleToggle('email')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium">SMS</span>
              <button
                onClick={() => handleToggle('sms')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.sms ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.sms ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Platform Promotion */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Promotion</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium">Discounts</span>
              <button
                onClick={() => handleToggle('discounts')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.discounts ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.discounts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-sm font-medium">Verification Updates</span>
              <button
                onClick={() => handleToggle('verificationUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.verificationUpdates ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.verificationUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
