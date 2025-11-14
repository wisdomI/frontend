import { useState, useEffect } from 'react'
import { settingsAPI } from '@/lib/api'
import { UserSettings, NotificationPreferences, GeneralSettings } from '@/types/api'

const defaultNotificationPreferences: NotificationPreferences = {
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

const defaultGeneralSettings: GeneralSettings = {
  timezone: 'Africa/Lagos',
  language: 'en',
  currency: 'NGN',
}

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>(
    defaultNotificationPreferences
  )
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>(defaultGeneralSettings)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingsAPI.getAll()
      const data = response.data.data || {}

      if (data.notificationPreferences) {
        setNotificationPreferences({
          ...defaultNotificationPreferences,
          ...data.notificationPreferences,
        })
      }

      if ((data as any).generalSettings) {
        setGeneralSettings({
          ...defaultGeneralSettings,
          ...(data as any).generalSettings,
        })
      }

      setSettings({
        ...data,
        notificationPreferences:
          data.notificationPreferences ?? defaultNotificationPreferences,
      })
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch settings')
      console.error('Error fetching settings:', err)
    } finally {
      setLoading(false)
    }
  }

  const createPin = async (data: { pin: string; confirmPin: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingsAPI.createPin(data)
      setSettings(prev => (prev ? { ...prev, pinEnabled: true } : prev))
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create PIN')
      console.error('Error creating PIN:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const changePin = async (data: { oldPin: string; newPin: string; confirmNewPin: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingsAPI.changePin(data)
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to change PIN')
      console.error('Error changing PIN:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const verifyPin = async (data: { pin: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingsAPI.verifyPin(data)
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to verify PIN')
      console.error('Error verifying PIN:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resendPinVerification = async (pinType: 'create' | 'change' | 'reset') => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingsAPI.resendPinVerification({ pinType })
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend PIN verification')
      console.error('Error resending PIN verification:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateNotificationSettings = async (data: NotificationPreferences) => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingsAPI.updateNotificationSettings(data)
      const updated = response.data.data || data
      setNotificationPreferences(updated)
      setSettings(prev =>
        prev ? { ...prev, notificationPreferences: updated } : prev
      )
      return updated
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update notification settings')
      console.error('Error updating notification settings:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateProfileSettings = async (data: Partial<UserSettings>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingsAPI.updateProfileSettings(data)
      const updated = response.data.data
      setSettings(updated)
      return updated
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile settings')
      console.error('Error updating profile settings:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateGeneralSettings = async (data: Partial<GeneralSettings>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingsAPI.updateGeneralSettings(data)
      const updated = response.data.data || { ...generalSettings, ...data }
      setGeneralSettings(updated)
      return updated
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update general settings')
      console.error('Error updating general settings:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  return {
    settings,
    notificationPreferences,
    generalSettings,
    loading,
    error,
    refetch: fetchSettings,
    createPin,
    changePin,
    verifyPin,
    resendPinVerification,
    updateNotificationSettings,
    updateProfileSettings,
    updateGeneralSettings,
  }
}
