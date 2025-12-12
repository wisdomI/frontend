'use client'

import { useState, useEffect, useCallback } from 'react'
import { serviceAPI, ratingAPI } from '@/lib/api'
import { meetingAPI } from '@/lib/api'
import { ServiceOffering, Meeting } from '@/types/api'

interface LandingPageData {
  popularServices: ServiceOffering[]
  recentServices: ServiceOffering[]
  upcomingEvents: Meeting[]
  loading: boolean
  error: string | null
  refetch: () => void
}

// Helper function to enrich services with rating data
async function enrichServicesWithRatings(services: ServiceOffering[]): Promise<ServiceOffering[]> {
  try {
    // Fetch ratings for all vendors in parallel
    const ratingPromises = services.map(async (service) => {
      try {
        const ratingResponse = await ratingAPI.getStats(service.userId)
        const ratingData = ratingResponse.data.data
        return {
          ...service,
          averageRating: ratingData?.averageRating || 0,
          totalReviews: ratingData?.totalRatings || 0
        }
      } catch (error) {
        // If rating fetch fails for a service, return service with default values
        console.log(`⚠️ Could not fetch ratings for service ${service.id}:`, error)
        return {
          ...service,
          averageRating: 0,
          totalReviews: 0
        }
      }
    })

    return await Promise.all(ratingPromises)
  } catch (error) {
    console.error('Error enriching services with ratings:', error)
    // Return services with default rating values
    return services.map(service => ({
      ...service,
      averageRating: 0,
      totalReviews: 0
    }))
  }
}

export function useLandingPageData(): LandingPageData {
  const [popularServices, setPopularServices] = useState<ServiceOffering[]>([])
  const [recentServices, setRecentServices] = useState<ServiceOffering[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    console.log('🔍 useLandingPageData: Starting to fetch data...')

    // Fetch popular services with proper sorting
    try {
      console.log('🔍 useLandingPageData: Fetching popular services...')
      const popularResponse = await serviceAPI.getAll({
        limit: 8,
        sortBy: 'popularity', // Sort by popularity if backend supports it
        sortOrder: 'desc'
      })
      let popularServicesData = popularResponse.data.data || []
      console.log('🔍 useLandingPageData: Popular services fetched:', popularServicesData.length)
      
      // OPTIMIZED: Show immediately without ratings, enrich in background
      setPopularServices(popularServicesData)
      
      // Fetch ratings in background without blocking UI
      if (popularServicesData.length > 0) {
        enrichServicesWithRatings(popularServicesData).then(enriched => {
          setPopularServices(enriched)
        }).catch(err => {
          console.log('Rating enrichment failed, using data without ratings:', err)
        })
      }
    } catch (err: any) {
      console.error('Error fetching popular services:', err)
      
      // Fallback: try to fetch services without sorting
      try {
        console.log('🔍 useLandingPageData: Fallback - fetching services without sorting...')
        const fallbackResponse = await serviceAPI.getAll({ limit: 8 })
        let fallbackData = fallbackResponse.data.data || []
        
        // Show fallback data immediately
        setPopularServices(fallbackData)
        
        // Enrich with ratings in background without blocking
        if (fallbackData.length > 0) {
          enrichServicesWithRatings(fallbackData).then(enriched => {
            setPopularServices(enriched)
          }).catch(err => {
            console.log('Rating enrichment failed:', err)
          })
        }
      } catch (fallbackErr: any) {
        console.error('Error in fallback service fetch:', fallbackErr)
        
        if (fallbackErr.response?.status === 401 || fallbackErr.response?.status === 403) {
          console.log('🔍 Services API requires authentication - this should be public')
          setError('Services are currently unavailable. Please try again later.')
        } else {
          setError(fallbackErr.message || 'Failed to fetch services')
        }
        
        setPopularServices([])
      }
    }

    // Fetch recently viewed services
    try {
      console.log('🔍 useLandingPageData: Fetching recently viewed services...')
      const recentResponse = await serviceAPI.getAll({ 
        limit: 4,
        sortBy: 'createdAt', // Sort by creation date for recent services
        sortOrder: 'desc'
      })
      let recentServicesData = recentResponse.data.data || []
      console.log('🔍 useLandingPageData: Recent services fetched:', recentServicesData.length)
      
      // OPTIMIZED: Show immediately without ratings
      setRecentServices(recentServicesData)
      
      // Enrich with ratings in background without blocking
      if (recentServicesData.length > 0) {
        enrichServicesWithRatings(recentServicesData).then(enriched => {
          setRecentServices(enriched)
        }).catch(err => {
          console.log('Rating enrichment failed for recent services:', err)
        })
      }
    } catch (err: any) {
      console.error('Error fetching recent services:', err)
      setRecentServices([])
    }

    // Fetch meetings independently (optional - don't fail if this doesn't work)
    try {
      console.log('🔍 useLandingPageData: Fetching meetings...')
      const eventsResponse = await meetingAPI.getAll({ limit: 3 })
      setUpcomingEvents(eventsResponse.data.data || [])
      console.log('🔍 useLandingPageData: Meetings fetched:', eventsResponse.data.data?.length || 0)
    } catch (err: any) {
      console.log('🔍 Meetings API not available (this is optional):', err.message)
      // Don't set error for meetings - this is optional for the landing page
      setUpcomingEvents([])
    }

    setLoading(false)
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    popularServices,
    recentServices,
    upcomingEvents,
    loading,
    error,
    refetch: fetchData
  }
}

// Hook specifically for service offerings with filtering
export function useServiceOfferings(filters?: {
  category?: string
  subCategory?: string
  location?: string
  limit?: number
  sortBy?: 'createdAt' | 'price' | 'rating' | 'popularity' | 'name'
  sortOrder?: 'asc' | 'desc'
}) {
  const [services, setServices] = useState<ServiceOffering[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        ...filters,
        limit: filters?.limit || 20
      }

      const response = await serviceAPI.getAll(params)
      setServices(response.data.data || [])

    } catch (err: any) {
      setError(err.message || 'Failed to fetch services')
      console.error('Error fetching services:', err)
      setServices([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  return {
    services,
    loading,
    error,
    refetch: fetchServices
  }
}

// Hook for recently viewed services with local storage tracking
export function useRecentlyViewed() {
  const [recentServices, setRecentServices] = useState<ServiceOffering[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecentlyViewed = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get recently viewed service IDs from localStorage
      const recentlyViewedIds = getRecentlyViewedServiceIds()
      
      if (recentlyViewedIds.length === 0) {
        // If no recently viewed services, fetch recently created services as fallback
        console.log('🔍 No recently viewed services found, fetching recent services...')
        const response = await serviceAPI.getAll({ 
          limit: 4,
          sortBy: 'createdAt',
          sortOrder: 'desc'
        })
        let recentServicesData = response.data.data || []
        
        // Fetch ratings for each service
        if (recentServicesData.length > 0) {
          console.log('🔍 useRecentlyViewed: Fetching ratings for recent services...')
          recentServicesData = await enrichServicesWithRatings(recentServicesData)
        }
        
        setRecentServices(recentServicesData)
      } else {
        // Fetch details for recently viewed services
        console.log('🔍 Fetching details for recently viewed services:', recentlyViewedIds)
        const servicePromises = recentlyViewedIds.map(id => 
          serviceAPI.getById(id).catch(() => null) // Don't fail if one service is not found
        )
        const serviceResponses = await Promise.all(servicePromises)
        let validServices = serviceResponses
          .filter(response => response !== null)
          .map(response => response!.data.data)
          .filter(service => service !== null)
        
        // Fetch ratings for each service
        if (validServices.length > 0) {
          console.log('🔍 useRecentlyViewed: Fetching ratings for viewed services...')
          validServices = await enrichServicesWithRatings(validServices)
        }
        
        setRecentServices(validServices)
      }

    } catch (err: any) {
      console.error('Error fetching recently viewed services:', err)
      
      // If it's a 401/403 error, it means the API requires authentication
      // Services should be publicly accessible, so this is unexpected
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('🔍 RecentlyViewed API requires authentication - this should be public')
        setError('Services are currently unavailable. Please try again later.')
      } else {
        setError(err.message || 'Failed to fetch recently viewed services')
      }
      
      setRecentServices([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecentlyViewed()
  }, [fetchRecentlyViewed])

  return {
    recentServices,
    loading,
    error,
    refetch: fetchRecentlyViewed
  }
}

// Helper functions for tracking recently viewed services
export function trackServiceView(serviceId: string) {
  try {
    const recentlyViewed = getRecentlyViewedServiceIds()
    
    // Remove if already exists (to avoid duplicates)
    const filtered = recentlyViewed.filter(id => id !== serviceId)
    
    // Add to beginning
    const updated = [serviceId, ...filtered].slice(0, 10) // Keep only last 10
    
    localStorage.setItem('recentlyViewedServices', JSON.stringify(updated))
    console.log('🔍 Tracked service view:', serviceId)
  } catch (error) {
    console.error('Error tracking service view:', error)
  }
}

export function getRecentlyViewedServiceIds(): string[] {
  try {
    const stored = localStorage.getItem('recentlyViewedServices')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error getting recently viewed services:', error)
    return []
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem('recentlyViewedServices')
    console.log('🔍 Cleared recently viewed services')
  } catch (error) {
    console.error('Error clearing recently viewed services:', error)
  }
}
