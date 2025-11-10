import { useState, useEffect } from 'react'
import { enhancedEarningsAPI } from '@/lib/api'
import { Earning, EarningsOverview } from '@/types/api'

export const useEnhancedEarnings = () => {
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [summary, setSummary] = useState<EarningsOverview | null>(null)
  const [statsOverview, setStatsOverview] = useState<EarningsOverview | null>(null)
  const [analytics, setAnalytics] = useState<any>(null)
  const [comparison, setComparison] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await enhancedEarningsAPI.getSummary()
      setSummary(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings summary')
      console.error('Error fetching earnings summary:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatsOverview = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await enhancedEarningsAPI.getStatsOverview()
      setStatsOverview(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings stats overview')
      console.error('Error fetching earnings stats overview:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await enhancedEarningsAPI.getAnalytics()
      setAnalytics(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings analytics')
      console.error('Error fetching earnings analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchComparison = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await enhancedEarningsAPI.getComparison()
      setComparison(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings comparison')
      console.error('Error fetching earnings comparison:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllEarnings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await enhancedEarningsAPI.getAll()
      setEarnings(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch all earnings')
      console.error('Error fetching all earnings:', err)
    } finally {
      setLoading(false)
    }
  }

  const searchEarnings = async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await enhancedEarningsAPI.search(params)
      setEarnings(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to search earnings')
      console.error('Error searching earnings:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchEarningsByStatus = async (status: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await enhancedEarningsAPI.getByStatus(status)
      setEarnings(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings by status')
      console.error('Error fetching earnings by status:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchEarningsByDateRange = async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await enhancedEarningsAPI.getByDateRange(params)
      setEarnings(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings by date range')
      console.error('Error fetching earnings by date range:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchEarningsById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await enhancedEarningsAPI.getById(id)
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings by ID')
      console.error('Error fetching earnings by ID:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchAll = async () => {
    await Promise.all([
      fetchSummary(),
      fetchStatsOverview(),
      fetchAnalytics(),
      fetchComparison(),
      fetchAllEarnings()
    ])
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return {
    earnings,
    summary,
    statsOverview,
    analytics,
    comparison,
    loading,
    error,
    refetch: fetchAll,
    refetchSummary: fetchSummary,
    refetchStatsOverview: fetchStatsOverview,
    refetchAnalytics: fetchAnalytics,
    refetchComparison: fetchComparison,
    refetchAllEarnings: fetchAllEarnings,
    searchEarnings,
    fetchEarningsByStatus,
    fetchEarningsByDateRange,
    fetchEarningsById
  }
}
