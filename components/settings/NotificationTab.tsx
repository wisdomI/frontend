'use client'

import React, { useEffect, useState } from 'react'
import { useSettings } from '@/hooks/useSettings'
import { NotificationPreferences } from '@/types/api'
import { toast } from 'react-hot-toast'

const defaultLocalState: NotificationPreferences = {
  jobAlerts: true,
  newJobMatches: true,
  clientsPostedJob: true,
  newChatMessage: true,
  escrowDepositConfirmed: true,
  paymentReleased: true,
  refundCancellationNotice: true,
  inAppNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  platformPromotions: true,
  verificationUpdates: true,
}

export default function NotificationTab() {
  const {
    notificationPreferences,
    updateNotificationSettings,
    loading,
  } = useSettings()
  const [notifications, setNotifications] =
    useState<NotificationPreferences>(defaultLocalState)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (notificationPreferences) {
      setNotifications(notificationPreferences)
    }
  }, [notificationPreferences])

  const handleToggle = (key: keyof NotificationPreferences) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      await updateNotificationSettings(notifications)
      toast.success('Notification settings updated')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update notifications')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <p className="text-gray-600">
        Please select the types of notifications you would like to receive
      </p>

      <div className="space-y-6">
        <NotificationSection title="Jobs & Project Alerts">
          <ToggleRow
            label="New Job Matches"
            checked={notifications.newJobMatches}
            onChange={() => handleToggle('newJobMatches')}
          />
          <ToggleRow
            label="Client Posted a Job in my Category"
            checked={notifications.clientsPostedJob}
            onChange={() => handleToggle('clientsPostedJob')}
          />
          <ToggleRow
            label="New Chat Message (Vendor/Planner)"
            checked={notifications.newChatMessage}
            onChange={() => handleToggle('newChatMessage')}
          />
        </NotificationSection>

        <NotificationSection title="Payments & Finance">
          <ToggleRow
            label="Escrow Deposit Confirmed"
            checked={notifications.escrowDepositConfirmed}
            onChange={() => handleToggle('escrowDepositConfirmed')}
          />
          <ToggleRow
            label="Payment Released to Wallet"
            checked={notifications.paymentReleased}
            onChange={() => handleToggle('paymentReleased')}
          />
          <ToggleRow
            label="Refund/Cancellation Notice"
            checked={notifications.refundCancellationNotice}
            onChange={() => handleToggle('refundCancellationNotice')}
          />
        </NotificationSection>

        <NotificationSection title="Communication Channels">
          <ToggleRow
            label="In-app"
            checked={notifications.inAppNotifications}
            onChange={() => handleToggle('inAppNotifications')}
          />
          <ToggleRow
            label="Email"
            checked={notifications.emailNotifications}
            onChange={() => handleToggle('emailNotifications')}
          />
          <ToggleRow
            label="SMS"
            checked={notifications.smsNotifications}
            onChange={() => handleToggle('smsNotifications')}
          />
        </NotificationSection>

        <NotificationSection title="Platform Promotion">
          <ToggleRow
            label="Discounts"
            checked={notifications.platformPromotions}
            onChange={() => handleToggle('platformPromotions')}
          />
          <ToggleRow
            label="Verification Updates"
            checked={notifications.verificationUpdates}
            onChange={() => handleToggle('verificationUpdates')}
          />
        </NotificationSection>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}

function NotificationSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 text-sm font-medium">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
