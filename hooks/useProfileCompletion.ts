'use client'

import { useState, useEffect } from 'react'

interface ProfileCompletionStatus {
  isCompleted: boolean
  completedSteps: string[]
  completionPercentage: number
}

const PROFILE_COMPLETION_KEY = 'vendor-profile-completion'

export const useProfileCompletion = () => {
  const [profileStatus, setProfileStatus] = useState<ProfileCompletionStatus>({
    isCompleted: false,
    completedSteps: [],
    completionPercentage: 0
  })

  // Load profile completion status from localStorage on mount
  useEffect(() => {
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
            completedSteps: [],
            completionPercentage: 0
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
  }, [])

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
    updateProfileCompletion,
    markProfileComplete,
    resetProfileCompletion
  }
}
