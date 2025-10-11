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

  // Load profile completion status from API
  useEffect(() => {
    const loadProfileStatus = async () => {
      if (!user?.id) {
        return
      }

      try {
        setLoading(true)
        setError(null)
        
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
        }
      } catch (err: any) {
        // Silently handle errors - backend will be fixed to allow vendor access
        if (err?.response?.status === 403) {
          // 403: Profile endpoint doesn't allow vendor access yet
          setError(null)
          // Use default status until backend is fixed
          setProfileStatus({
            isCompleted: false,
            completedSteps: [],
            completionPercentage: 0
          })
        } else if (err?.response?.status === 404) {
          // 404: Profile doesn't exist yet (new user)
          setError(null)
          setProfileStatus({
            isCompleted: false,
            completedSteps: [],
            completionPercentage: 0
          })
        } else {
          setError('Failed to load profile status')
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfileStatus()
  }, [user?.id])

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
