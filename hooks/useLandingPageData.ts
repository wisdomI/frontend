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

    // Fetch popular services
    try {
      console.log('🔍 useLandingPageData: Fetching popular services...')
      // Removing sortBy as backend throws "column ServiceOffering.sortBy does not exist"
      const popularResponse = await serviceAPI.getAll({
        limit: 8
      })
      
      // Handle different possible response structures
      let popularServicesData: ServiceOffering[] = []
      if (popularResponse?.data?.data) {
        popularServicesData = Array.isArray(popularResponse.data.data) 
          ? popularResponse.data.data 
          : []
      } else if (popularResponse?.data && Array.isArray(popularResponse.data)) {
        popularServicesData = popularResponse.data
      }
      
      console.log('🔍 useLandingPageData: Popular services fetched:', popularServicesData.length)
      if (popularServicesData.length === 0) {
        console.log('🔍 useLandingPageData: Response structure:', {
          hasData: !!popularResponse?.data,
          dataType: typeof popularResponse?.data,
          isArray: Array.isArray(popularResponse?.data),
          responseKeys: popularResponse?.data ? Object.keys(popularResponse.data) : []
        })
      }
      
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
      
      // Don't set error immediately - try fallback first
      // Fallback: try to fetch services without sorting
      try {
        console.log('🔍 useLandingPageData: Fallback - fetching services without sorting...')
        const fallbackResponse = await serviceAPI.getAll({ limit: 8 })
        
        // Handle different possible response structures
        let fallbackData: ServiceOffering[] = []
        if (fallbackResponse?.data?.data) {
          fallbackData = Array.isArray(fallbackResponse.data.data) 
            ? fallbackResponse.data.data 
            : []
        } else if (fallbackResponse?.data && Array.isArray(fallbackResponse.data)) {
          fallbackData = fallbackResponse.data
        }
        
        // Show fallback data immediately
        setPopularServices(fallbackData)
        
        // Enrich with ratings in background without blocking
        if (fallbackData.length > 0) {
          enrichServicesWithRatings(fallbackData).then(enriched => {
            setPopularServices(enriched)
          }).catch(err => {
            console.log('Rating enrichment failed:', err)
            // Don't fail the whole request if ratings fail
          })
        }
      } catch (fallbackErr: any) {
        console.error('Error in fallback service fetch:', fallbackErr)
        
        // Only set error if it's a critical failure, but don't prevent rendering
        if (fallbackErr.response?.status === 401 || fallbackErr.response?.status === 403) {
          console.log('🔍 Services API requires authentication - this should be public')
          // Don't set error state - just log it and continue with empty array
          // The component will handle empty state gracefully
        } else {
          // Log error but don't block rendering
          console.error('Failed to fetch services:', fallbackErr.message)
        }
        
        // Set empty array but don't block the rest of the page
        setPopularServices([])
      }
    }

    // Fetch recently viewed services
    try {
      console.log('🔍 useLandingPageData: Fetching recently viewed services...')
        // Removing sortBy as backend doesn't support it
        const recentResponse = await serviceAPI.getAll({ 
          limit: 4
        })
        
        // Handle different possible response structures
        let recentServicesData: ServiceOffering[] = []
        if (recentResponse?.data?.data) {
          recentServicesData = Array.isArray(recentResponse.data.data) 
            ? recentResponse.data.data 
            : []
        } else if (recentResponse?.data && Array.isArray(recentResponse.data)) {
          recentServicesData = recentResponse.data
        }
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
      // Only fetch meetings if authenticated to avoid 401 errors
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      if (token) {
        console.log('🔍 useLandingPageData: Fetching meetings...')
        const eventsResponse = await meetingAPI.getAll({ limit: 3 })
        setUpcomingEvents(eventsResponse.data.data || [])
        console.log('🔍 useLandingPageData: Meetings fetched:', eventsResponse.data.data?.length || 0)
      } else {
        console.log('🔍 useLandingPageData: Skipping meetings fetch (not authenticated)')
        setUpcomingEvents([])
      }
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

      // Check if user is authenticated
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      
      // Get recently viewed service IDs from localStorage
      const recentlyViewedIds = getRecentlyViewedServiceIds()
      
      // If not authenticated OR no recently viewed services, fetch from public list endpoint
      if (!token || recentlyViewedIds.length === 0) {
        // Fetch recently created services as fallback (public endpoint)
        console.log('🔍 No recently viewed services or not authenticated, fetching recent services from public endpoint...')
        const response = await serviceAPI.getAll({ 
          limit: 4
        })
        
        // Handle different possible response structures
        let recentServicesData: ServiceOffering[] = []
        if (response?.data?.data) {
          recentServicesData = Array.isArray(response.data.data) 
            ? response.data.data 
            : []
        } else if (response?.data && Array.isArray(response.data)) {
          recentServicesData = response.data
        }
        
        // Fetch ratings for each service (only if authenticated, ratings might need auth)
        if (recentServicesData.length > 0 && token) {
          try {
            console.log('🔍 useRecentlyViewed: Fetching ratings for recent services...')
            recentServicesData = await enrichServicesWithRatings(recentServicesData)
          } catch (ratingErr) {
            console.log('🔍 Rating enrichment failed, using services without ratings:', ratingErr)
            // Continue with services without ratings
          }
        }
        
        setRecentServices(recentServicesData)
      } else {
        // User is authenticated and has recently viewed services
        // Try to fetch individual services, but fallback to list if it fails
        console.log('🔍 Fetching details for recently viewed services:', recentlyViewedIds)
        try {
          const servicePromises = recentlyViewedIds.map(id => 
            serviceAPI.getById(id).catch(() => null) // Don't fail if one service is not found
          )
          const serviceResponses = await Promise.all(servicePromises)
          let validServices = serviceResponses
            .filter(response => response !== null)
            .map(response => response!.data.data)
            .filter(service => service !== null)
          
          // If we got some services, use them
          if (validServices.length > 0) {
            // Fetch ratings for each service
            try {
              console.log('🔍 useRecentlyViewed: Fetching ratings for viewed services...')
              validServices = await enrichServicesWithRatings(validServices)
            } catch (ratingErr) {
              console.log('🔍 Rating enrichment failed, using services without ratings:', ratingErr)
            }
            
            setRecentServices(validServices)
          } else {
            // Fallback to list endpoint if individual fetches failed
            console.log('🔍 Individual service fetches failed, falling back to list endpoint...')
            const response = await serviceAPI.getAll({ limit: 4 })
            
            // Handle different possible response structures
            let recentServicesData: ServiceOffering[] = []
            if (response?.data?.data) {
              recentServicesData = Array.isArray(response.data.data) 
                ? response.data.data 
                : []
            } else if (response?.data && Array.isArray(response.data)) {
              recentServicesData = response.data
            }
            
            setRecentServices(recentServicesData)
          }
        } catch (individualErr: any) {
          // If individual fetches fail, fallback to list endpoint
          console.log('🔍 Individual service fetch failed, using list endpoint:', individualErr.message)
          const response = await serviceAPI.getAll({ limit: 4 })
          
          // Handle different possible response structures
          let recentServicesData: ServiceOffering[] = []
          if (response?.data?.data) {
            recentServicesData = Array.isArray(response.data.data) 
              ? response.data.data 
              : []
          } else if (response?.data && Array.isArray(response.data)) {
            recentServicesData = response.data
          }
          
          setRecentServices(recentServicesData)
        }
      }

    } catch (err: any) {
      console.error('Error fetching recently viewed services:', err)
      
      // Don't set error state - just log it and show empty state
      // The component will handle empty state gracefully
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
