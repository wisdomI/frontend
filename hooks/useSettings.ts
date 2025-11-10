import { useState, useEffect } from 'react'
import { settingsAPI } from '@/lib/api'
import { UserSettings, NotificationPreferences } from '@/types/api'

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingsAPI.getAll()
      setSettings(response.data.data)
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

  const updateNotificationSettings = async (data: Partial<NotificationPreferences>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await settingsAPI.updateNotificationSettings(data)
      await fetchSettings() // Refresh settings
      return response.data.data
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
      setSettings(response.data.data)
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile settings')
      console.error('Error updating profile settings:', err)
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
    loading,
    error,
    refetch: fetchSettings,
    createPin,
    changePin,
    verifyPin,
    updateNotificationSettings,
    updateProfileSettings
  }
}
