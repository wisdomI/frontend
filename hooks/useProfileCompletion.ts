'use client'

import { useState, useEffect } from 'react'
import { profileAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'

interface ProfileCompletionStatus {
  isCompleted: boolean
  completedSteps: string[]
  completionPercentage: number
}

const PROFILE_COMPLETION_KEY = 'vendor-profile-completion'

export const useProfileCompletion = () => {
  const { user } = useAuthContext()
  const [profileStatus, setProfileStatus] = useState<ProfileCompletionStatus>({
    isCompleted: false,
    completedSteps: [],
    completionPercentage: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load profile completion status from API and localStorage
  useEffect(() => {
    const loadProfileStatus = async () => {
      if (!user?.id) {
        console.log('useProfileCompletion: No user ID, skipping API call')
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        // First try to get profile from API
        console.log('useProfileCompletion: Fetching profile for user:', user.id)
        const response = await profileAPI.me()
        const profile = response.data.data
        
        if (profile) {
          // Determine completion based on profile data
          const completedSteps = []
          if ((profile as any).businessName) completedSteps.push('business-details')
          if ((profile as any).services && (profile as any).services.length > 0) completedSteps.push('service-offering')
          if ((profile as any).isEmailVerified) completedSteps.push('verification')
          if ((profile as any).bankDetails) completedSteps.push('payment-setup')
          
          const totalSteps = 4
          const percentage = Math.round((completedSteps.length / totalSteps) * 100)
          const isCompleted = completedSteps.length === totalSteps
          
          const apiStatus = {
            isCompleted,
            completedSteps,
            completionPercentage: percentage
          }
          
          setProfileStatus(apiStatus)
          // Update localStorage with API data
          if (typeof window !== 'undefined') {
            localStorage.setItem(PROFILE_COMPLETION_KEY, JSON.stringify(apiStatus))
          }
        }
      } catch (err: any) {
        console.error('Error fetching profile status:', err)
        
        // Handle 403 errors gracefully - user might not have a profile yet
        if (err?.response?.status === 403) {
          console.log('useProfileCompletion: 403 error - user may not have profile yet, using localStorage fallback')
          setError(null) // Don't show error for 403, it's expected for new users
        } else {
          setError('Failed to load profile status')
        }
        
        // Fallback to localStorage
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem(PROFILE_COMPLETION_KEY)
          if (saved) {
            try {
              const parsed = JSON.parse(saved)
              setProfileStatus(parsed)
            } catch (error) {
              console.error('Error parsing profile completion data:', error)
              // Reset to default if parsing fails
              setProfileStatus({
                isCompleted: false,
                completedSteps: ['business-details'],
                completionPercentage: 25
              })
            }
          } else {
            // Initialize with business-details as completed by default
            const defaultStatus = {
              isCompleted: false,
              completedSteps: ['business-details'],
              completionPercentage: 25
            }
            setProfileStatus(defaultStatus)
            localStorage.setItem(PROFILE_COMPLETION_KEY, JSON.stringify(defaultStatus))
          }
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfileStatus()
  }, [user?.id])

  // Save profile completion status to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(PROFILE_COMPLETION_KEY, JSON.stringify(profileStatus))
    }
  }, [profileStatus])

  const updateProfileCompletion = (steps: string[]) => {
    const totalSteps = 4 // business-details, service-offering, verification, payment-setup
    const percentage = Math.round((steps.length / totalSteps) * 100)
    const isCompleted = steps.length === totalSteps

    console.log('updateProfileCompletion called with steps:', steps)
    console.log('Total steps:', totalSteps, 'Completed steps:', steps.length)
    console.log('Is completed:', isCompleted, 'Percentage:', percentage)

    setProfileStatus({
      isCompleted,
      completedSteps: steps,
      completionPercentage: percentage
    })
  }

  const markProfileComplete = () => {
    console.log('markProfileComplete called')
    const allSteps = ['business-details', 'service-offering', 'verification', 'payment-setup']
    console.log('Setting all steps as completed:', allSteps)
    updateProfileCompletion(allSteps)
    console.log('Profile marked as complete')
  }

  const resetProfileCompletion = () => {
    setProfileStatus({
      isCompleted: false,
      completedSteps: [],
      completionPercentage: 0
    })
  }

  return {
    profileStatus,
    loading,
    error,
    updateProfileCompletion,
    markProfileComplete,
    resetProfileCompletion
  }
}
