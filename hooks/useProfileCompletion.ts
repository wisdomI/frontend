'use client'

import { useState, useEffect } from 'react'
import { profileAPI, withdrawalAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'

interface ProfileCompletionStatus {
  isCompleted: boolean
  completedSteps: string[]
  completionPercentage: number
}

const PROFILE_COMPLETION_KEY = 'vendor-profile-completion'
const PROFILE_COMPLETION_CACHE_KEY = 'vendor-profile-completion-cache'
const PROFILE_COMPLETION_CACHE_TTL = 1000 * 60 * 5 // 5 minutes

interface CachedProfileStatus {
  userId: string
  timestamp: number
  status: ProfileCompletionStatus
}

export const useProfileCompletion = () => {
  const { user } = useAuthContext()
  const [profileStatus, setProfileStatus] = useState<ProfileCompletionStatus>({
    isCompleted: false,
    completedSteps: [],
    completionPercentage: 0
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const persistStatusToCache = (status: ProfileCompletionStatus) => {
    if (typeof window === 'undefined' || !user?.id) return
    const payload: CachedProfileStatus = {
      userId: user.id,
      timestamp: Date.now(),
      status,
    }
    try {
      sessionStorage.setItem(PROFILE_COMPLETION_CACHE_KEY, JSON.stringify(payload))
    } catch {
      // Ignore storage errors (e.g., quota exceeded)
    }
  }

  // Load profile completion status from API
  useEffect(() => {
    const loadProfileStatus = async () => {
      if (!user?.id) {
        return
      }

       let cachedStatus: CachedProfileStatus | null = null
       if (typeof window !== 'undefined') {
         const stored = sessionStorage.getItem(PROFILE_COMPLETION_CACHE_KEY)
         if (stored) {
           try {
             const parsed = JSON.parse(stored) as CachedProfileStatus
             if (parsed.userId === user.id) {
               cachedStatus = parsed
               setProfileStatus(parsed.status)
               if (Date.now() - parsed.timestamp < PROFILE_COMPLETION_CACHE_TTL) {
                 setLoading(false)
                 setError(null)
                 return
               }
             }
           } catch (parseError) {
             sessionStorage.removeItem(PROFILE_COMPLETION_CACHE_KEY)
           }
         }
       }

      try {
        setLoading(true)
        setError(null)
        
        // Fetch profile and bank accounts in parallel
        const [profileResponse, bankAccountsResponse] = await Promise.allSettled([
          profileAPI.me(),
          withdrawalAPI.getBankAccounts()
        ])
        
        const profile = profileResponse.status === 'fulfilled' ? profileResponse.value.data.data : null
        const bankAccounts = bankAccountsResponse.status === 'fulfilled' ? bankAccountsResponse.value.data.data : []
        
        if (profile) {
          // Determine completion based on profile data
          const completedSteps = []
          if ((profile as any).businessName) completedSteps.push('business-details')
          if ((profile as any).services && (profile as any).services.length > 0) completedSteps.push('service-offering')
          if ((profile as any).isEmailVerified) completedSteps.push('verification')
          
          // Check if bank accounts exist for payment-setup completion
          if (bankAccounts && Array.isArray(bankAccounts) && bankAccounts.length > 0) {
            completedSteps.push('payment-setup')
          }
          
          const totalSteps = 4
          const percentage = Math.round((completedSteps.length / totalSteps) * 100)
          const isCompleted = completedSteps.length === totalSteps
          
          const apiStatus = {
            isCompleted,
            completedSteps,
            completionPercentage: percentage
          }
          
          setProfileStatus(apiStatus)
          persistStatusToCache(apiStatus)
        }
      } catch (err: any) {
        // Silently handle errors - backend will be fixed to allow vendor access
        if (err?.response?.status === 403) {
          // 403: Profile endpoint doesn't allow vendor access yet
          setError(null)
          // Use default status until backend is fixed
          const fallbackStatus = {
            isCompleted: false,
            completedSteps: [],
            completionPercentage: 0
          }
          setProfileStatus(fallbackStatus)
          persistStatusToCache(fallbackStatus)
        } else if (err?.response?.status === 404) {
          // 404: Profile doesn't exist yet (new user)
          setError(null)
          const fallbackStatus = {
            isCompleted: false,
            completedSteps: [],
            completionPercentage: 0
          }
          setProfileStatus(fallbackStatus)
          persistStatusToCache(fallbackStatus)
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
    persistStatusToCache({
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
    const status = {
      isCompleted: false,
      completedSteps: [],
      completionPercentage: 0
    }
    setProfileStatus(status)
    persistStatusToCache(status)
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
