import { useState, useEffect } from 'react'
import { earningsAPI } from '@/lib/api'
import { Earning, EarningsOverview } from '@/types/api'

export const useEarnings = () => {
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [earning, setEarning] = useState<Earning | null>(null)
  const [overview, setOverview] = useState<EarningsOverview | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEarnings = async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await earningsAPI.getAll(params)
      setEarnings(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchEarningById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await earningsAPI.getById(id)
      setEarning(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earning')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchOverview = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await earningsAPI.getOverview()
      setOverview(response.data.data)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings overview')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchEarningsByStatus = async (status: 'pending' | 'completed' | 'withdrawn') => {
    try {
      setLoading(true)
      setError(null)
      const response = await earningsAPI.getByStatus(status)
      setEarnings(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings by status')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchEarningsByDateRange = async (startDate: string, endDate: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await earningsAPI.getByDateRange(startDate, endDate)
      setEarnings(response.data.data || [])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch earnings by date range')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchTotalEarnings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await earningsAPI.getTotalEarnings()
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch total earnings')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEarnings()
    fetchOverview()
  }, [])

  return {
    earnings,
    earning,
    overview,
    loading,
    error,
    fetchEarnings,
    fetchEarningById,
    fetchOverview,
    fetchEarningsByStatus,
    fetchEarningsByDateRange,
    fetchTotalEarnings,
  }
}
