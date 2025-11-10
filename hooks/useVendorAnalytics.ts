'use client'

import { useState, useEffect, useCallback } from 'react'
import { vendorAnalyticsAPI } from '@/lib/api'

interface UseVendorAnalyticsOptions {
  autoFetch?: boolean
}

export function useVendorAnalytics(options: UseVendorAnalyticsOptions = {}) {
  const { autoFetch = true } = options
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null)
  const [engagementMetrics, setEngagementMetrics] = useState<any>(null)
  const [clientInsights, setClientInsights] = useState<any>(null)
  const [revenueAnalytics, setRevenueAnalytics] = useState<any>(null)
  const [servicePerformance, setServicePerformance] = useState<any[]>([])
  const [eventTypeAnalytics, setEventTypeAnalytics] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPerformanceMetrics = useCallback(async (params?: { period?: string; from?: string; to?: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorAnalyticsAPI.getPerformanceMetrics(params)
      setPerformanceMetrics(response.data.data)
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.warn('Performance metrics endpoint not implemented yet, using null')
        setPerformanceMetrics(null)
      } else {
        setError('Failed to fetch performance metrics')
        console.error('Error fetching performance metrics:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEngagementMetrics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorAnalyticsAPI.getEngagementMetrics()
      setEngagementMetrics(response.data.data)
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.warn('Engagement metrics endpoint not implemented yet, using null')
        setEngagementMetrics(null)
      } else {
        setError('Failed to fetch engagement metrics')
        console.error('Error fetching engagement metrics:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchClientInsights = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorAnalyticsAPI.getClientInsights()
      setClientInsights(response.data.data)
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.warn('Client insights endpoint not implemented yet, using null')
        setClientInsights(null)
      } else {
        setError('Failed to fetch client insights')
        console.error('Error fetching client insights:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRevenueAnalytics = useCallback(async (params?: { period?: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorAnalyticsAPI.getRevenueAnalytics(params)
      setRevenueAnalytics(response.data.data)
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.warn('Revenue analytics endpoint not implemented yet, using null')
        setRevenueAnalytics(null)
      } else {
        setError('Failed to fetch revenue analytics')
        console.error('Error fetching revenue analytics:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchServicePerformance = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorAnalyticsAPI.getServicePerformance()
      setServicePerformance(response.data.data || [])
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.warn('Service performance endpoint not implemented yet, using empty array')
        setServicePerformance([])
      } else {
        setError('Failed to fetch service performance')
        console.error('Error fetching service performance:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchEventTypeAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorAnalyticsAPI.getEventTypeAnalytics()
      setEventTypeAnalytics(response.data.data || [])
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.warn('Event type analytics endpoint not implemented yet, using empty array')
        setEventTypeAnalytics([])
      } else {
        setError('Failed to fetch event type analytics')
        console.error('Error fetching event type analytics:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchConversionMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorAnalyticsAPI.getConversionMetrics()
      return response.data.data
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.warn('Conversion metrics endpoint not implemented yet')
        return null
      } else {
        setError('Failed to fetch conversion metrics')
        console.error('Error fetching conversion metrics:', err)
        throw err
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchProfileViews = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorAnalyticsAPI.getProfileViews()
      return response.data.data
    } catch (err: any) {
      if (err.response?.status === 404) {
        console.warn('Profile views endpoint not implemented yet')
        return null
      } else {
        setError('Failed to fetch profile views')
        console.error('Error fetching profile views:', err)
        throw err
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchPerformanceMetrics()
      fetchEngagementMetrics()
      fetchClientInsights()
      fetchRevenueAnalytics()
      fetchServicePerformance()
      fetchEventTypeAnalytics()
    }
  }, [autoFetch, fetchPerformanceMetrics, fetchEngagementMetrics, fetchClientInsights, fetchRevenueAnalytics, fetchServicePerformance, fetchEventTypeAnalytics])

  return {
    performanceMetrics,
    engagementMetrics,
    clientInsights,
    revenueAnalytics,
    servicePerformance,
    eventTypeAnalytics,
    loading,
    error,
    fetchPerformanceMetrics,
    fetchEngagementMetrics,
    fetchClientInsights,
    fetchRevenueAnalytics,
    fetchServicePerformance,
    fetchEventTypeAnalytics,
    fetchConversionMetrics,
    fetchProfileViews,
    setError
  }
}
