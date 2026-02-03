'use client'

import { useEffect, useState } from 'react'
import ClientPageHeader from '@/components/client/ClientPageHeader'
import { useSettings } from '@/hooks/useSettings'
import { toast } from 'react-hot-toast'

type TabKey = 'notification' | 'profile' | 'general'

const timezoneOptions = ['Africa/Lagos', 'Africa/Johannesburg', 'Europe/London', 'UTC']
const languageOptions = ['en', 'fr', 'es']
const currencyOptions = ['NGN', 'USD', 'GBP', 'EUR']

export default function GeneralSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('notification')
  const {
    notificationPreferences,
    settings,
    generalSettings,
    updateNotificationSettings,
    updateProfileSettings,
    updateGeneralSettings,
    loading,
  } = useSettings()

  const [notificationState, setNotificationState] = useState(notificationPreferences)
  const [profileState, setProfileState] = useState({
    profileVisibility: settings?.profileVisibility ?? 'public',
    showContactInfo: settings?.showContactInfo ?? true,
    showPortfolio: settings?.showPortfolio ?? true,
    showReviews: settings?.showReviews ?? true,
    showAvailability: settings?.showAvailability ?? true,
  })
  const [generalState, setGeneralState] = useState(generalSettings)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setNotificationState(notificationPreferences)
  }, [notificationPreferences])

  useEffect(() => {
    if (settings) {
      setProfileState({
        profileVisibility: settings.profileVisibility,
        showContactInfo: settings.showContactInfo,
        showPortfolio: settings.showPortfolio,
        showReviews: settings.showReviews,
        showAvailability: settings.showAvailability,
      })
    }
  }, [settings])

  useEffect(() => {
    setGeneralState(generalSettings)
  }, [generalSettings])

  const handleSaveNotifications = async () => {
    try {
      setSaving(true)
      await updateNotificationSettings(notificationState)
      toast.success('Notification preferences updated')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update notifications')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProfile = async () => {
    try {
      setSaving(true)
      await updateProfileSettings(profileState)
      toast.success('Profile settings updated')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile settings')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveGeneral = async () => {
    try {
      setSaving(true)
      await updateGeneralSettings(generalState)
      toast.success('General settings updated')
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update general settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-2 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-x-hidden">
      <ClientPageHeader
        breadcrumbs={[{ label: 'My Account' }, { label: 'Settings', isActive: true }]}
        title="Settings"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-visible">
        <div className="px-3 sm:px-4 lg:px-6 pt-3">
          <div className="inline-flex bg-[#0B2E6F] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('notification')}
              className={`px-4 py-2 text-sm font-semibold rounded-md ${
                activeTab === 'notification' ? 'bg-white text-[#0B2E6F]' : 'text-white'
              }`}
            >
              Notification
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 text-sm font-semibold rounded-md ${
                activeTab === 'profile' ? 'bg-white text-[#0B2E6F]' : 'text-white'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 text-sm font-semibold rounded-md ${
                activeTab === 'general' ? 'bg-white text-[#0B2E6F]' : 'text-white'
              }`}
            >
              General
            </button>
          </div>
        </div>

        {activeTab === 'notification' && (
          <div className="p-3 sm:p-4 lg:p-6 space-y-4">
            <SettingsSection title="Project & Event Updates">
              <ToggleRow
                label="Job Alerts"
                checked={notificationState.jobAlerts}
                onChange={() =>
                  setNotificationState(prev => ({ ...prev, jobAlerts: !prev.jobAlerts }))
                }
              />
              <ToggleRow
                label="New Job Matches"
                checked={notificationState.newJobMatches}
                onChange={() =>
                  setNotificationState(prev => ({
                    ...prev,
                    newJobMatches: !prev.newJobMatches,
                  }))
                }
              />
              <ToggleRow
                label="Clients Posted a Job"
                checked={notificationState.clientsPostedJob}
                onChange={() =>
                  setNotificationState(prev => ({
                    ...prev,
                    clientsPostedJob: !prev.clientsPostedJob,
                  }))
                }
              />
              <ToggleRow
                label="New Chat Messages"
                checked={notificationState.newChatMessage}
                onChange={() =>
                  setNotificationState(prev => ({
                    ...prev,
                    newChatMessage: !prev.newChatMessage,
                  }))
                }
              />
            </SettingsSection>

            <SettingsSection title="Payments & Finance">
              <ToggleRow
                label="Escrow Deposit Confirmed"
                checked={notificationState.escrowDepositConfirmed}
                onChange={() =>
                  setNotificationState(prev => ({
                    ...prev,
                    escrowDepositConfirmed: !prev.escrowDepositConfirmed,
                  }))
                }
              />
              <ToggleRow
                label="Payment Released"
                checked={notificationState.paymentReleased}
                onChange={() =>
                  setNotificationState(prev => ({
                    ...prev,
                    paymentReleased: !prev.paymentReleased,
                  }))
                }
              />
              <ToggleRow
                label="Refund / Cancellation Notices"
                checked={notificationState.refundCancellationNotice}
                onChange={() =>
                  setNotificationState(prev => ({
                    ...prev,
                    refundCancellationNotice: !prev.refundCancellationNotice,
                  }))
                }
              />
            </SettingsSection>

            <SettingsSection title="Communication Channels">
              <ToggleRow
                label="In-app"
                checked={notificationState.inAppNotifications}
                onChange={() =>
                  setNotificationState(prev => ({
                    ...prev,
                    inAppNotifications: !prev.inAppNotifications,
                  }))
                }
              />
              <ToggleRow
                label="Email"
                checked={notificationState.emailNotifications}
                onChange={() =>
                  setNotificationState(prev => ({
                    ...prev,
                    emailNotifications: !prev.emailNotifications,
                  }))
                }
              />
              <ToggleRow
                label="SMS"
                checked={notificationState.smsNotifications}
                onChange={() =>
                  setNotificationState(prev => ({
                    ...prev,
                    smsNotifications: !prev.smsNotifications,
                  }))
                }
              />
            </SettingsSection>

            <SettingsSection title="Platform Updates">
              <ToggleRow
                label="Promotions & Discounts"
                checked={notificationState.platformPromotions}
                onChange={() =>
                  setNotificationState(prev => ({
                    ...prev,
                    platformPromotions: !prev.platformPromotions,
                  }))
                }
              />
              <ToggleRow
                label="Verification Updates"
                checked={notificationState.verificationUpdates}
                onChange={() =>
                  setNotificationState(prev => ({
                    ...prev,
                    verificationUpdates: !prev.verificationUpdates,
                  }))
                }
              />
            </SettingsSection>

            <div className="pt-4">
              <button
                onClick={handleSaveNotifications}
                disabled={saving || loading}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-3 sm:p-4 lg:p-6 space-y-4">
            <SettingsSection title="Profile Visibility">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Who can view your profile?
              </label>
              <select
                value={profileState.profileVisibility}
                onChange={e =>
                  setProfileState(prev => ({
                    ...prev,
                    profileVisibility: e.target.value as typeof prev.profileVisibility,
                  }))
                }
                className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                <option value="public">Public</option>
                <option value="contacts-only">Contacts only</option>
                <option value="private">Private</option>
              </select>
            </SettingsSection>

            <SettingsSection title="Profile Details">
              <ToggleRow
                label="Show contact information"
                checked={profileState.showContactInfo}
                onChange={() =>
                  setProfileState(prev => ({
                    ...prev,
                    showContactInfo: !prev.showContactInfo,
                  }))
                }
              />
              <ToggleRow
                label="Show portfolio"
                checked={profileState.showPortfolio}
                onChange={() =>
                  setProfileState(prev => ({
                    ...prev,
                    showPortfolio: !prev.showPortfolio,
                  }))
                }
              />
              <ToggleRow
                label="Show reviews"
                checked={profileState.showReviews}
                onChange={() =>
                  setProfileState(prev => ({
                    ...prev,
                    showReviews: !prev.showReviews,
                  }))
                }
              />
              <ToggleRow
                label="Show availability"
                checked={profileState.showAvailability}
                onChange={() =>
                  setProfileState(prev => ({
                    ...prev,
                    showAvailability: !prev.showAvailability,
                  }))
                }
              />
            </SettingsSection>

            <div className="pt-4">
              <button
                onClick={handleSaveProfile}
                disabled={saving || loading}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'general' && (
          <div className="p-3 sm:p-4 lg:p-6 space-y-4">
            <SettingsSection title="General Preferences">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={generalState.timezone}
                    onChange={e =>
                      setGeneralState(prev => ({ ...prev, timezone: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    {timezoneOptions.map(tz => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={generalState.language}
                    onChange={e =>
                      setGeneralState(prev => ({ ...prev, language: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    {languageOptions.map(lang => (
                      <option key={lang} value={lang}>
                        {lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={generalState.currency}
                    onChange={e =>
                      setGeneralState(prev => ({ ...prev, currency: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  >
                    {currencyOptions.map(currency => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </SettingsSection>

            <div className="pt-4">
              <button
                onClick={handleSaveGeneral}
                disabled={saving || loading}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="bg-gray-50 rounded-xl p-4 sm:p-5 space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="space-y-3">{children}</div>
    </section>
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
      <span className="text-sm text-gray-800">{label}</span>
      <button
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
