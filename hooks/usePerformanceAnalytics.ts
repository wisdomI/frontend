import { useState, useEffect } from 'react'
import { performanceAnalyticsAPI } from '@/lib/api'
import { PerformanceDashboard, ClientGrowth, ServicePerformance } from '@/types/api'

export const usePerformanceAnalytics = () => {
  const [dashboard, setDashboard] = useState<PerformanceDashboard | null>(null)
  const [clientGrowth, setClientGrowth] = useState<ClientGrowth | null>(null)
  const [servicePerformance, setServicePerformance] = useState<ServicePerformance | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await performanceAnalyticsAPI.getDashboard()
      setDashboard(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch dashboard analytics')
      console.error('Error fetching dashboard analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchClientGrowth = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await performanceAnalyticsAPI.getClientGrowth()
      setClientGrowth(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch client growth analytics')
      console.error('Error fetching client growth analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchServicePerformance = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await performanceAnalyticsAPI.getServicePerformance()
      setServicePerformance(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch service performance analytics')
      console.error('Error fetching service performance analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await performanceAnalyticsAPI.getAnalytics()
      setAnalytics(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics')
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllAnalytics = async () => {
    await Promise.all([
      fetchDashboard(),
      fetchClientGrowth(),
      fetchServicePerformance(),
      fetchAnalytics()
    ])
  }

  useEffect(() => {
    fetchAllAnalytics()
  }, [])

  return {
    dashboard,
    clientGrowth,
    servicePerformance,
    analytics,
    loading,
    error,
    refetch: fetchAllAnalytics,
    refetchDashboard: fetchDashboard,
    refetchClientGrowth: fetchClientGrowth,
    refetchServicePerformance: fetchServicePerformance,
    refetchAnalytics: fetchAnalytics
  }
}
