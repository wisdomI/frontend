'use client'

import { useState, useEffect, useCallback } from 'react'
import { vendorEarningsAPI } from '@/lib/api'

interface UseVendorEarningsOptions {
  autoFetch?: boolean
}

export function useVendorEarnings(options: UseVendorEarningsOptions = {}) {
  const { autoFetch = true } = options
  const [earnings, setEarnings] = useState<any[]>([])
  const [withdrawals, setWithdrawals] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [bankDetails, setBankDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchEarnings = useCallback(async (params?: { page?: number; limit?: number; from?: string; to?: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorEarningsAPI.getEarnings(params)
      setEarnings(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch earnings')
      console.error('Error fetching earnings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchWithdrawals = useCallback(async (params?: { page?: number; limit?: number }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorEarningsAPI.getWithdrawals(params)
      setWithdrawals(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch withdrawals')
      console.error('Error fetching withdrawals:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await vendorEarningsAPI.getEarningsStats()
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching earnings stats:', err)
    }
  }, [])

  const fetchBankDetails = useCallback(async () => {
    try {
      const response = await vendorEarningsAPI.getBankDetails()
      setBankDetails(response.data.data)
    } catch (err) {
      console.error('Error fetching bank details:', err)
    }
  }, [])

  const requestWithdrawal = async (data: { amount: number; bankDetails: any }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorEarningsAPI.requestWithdrawal(data)
      await fetchWithdrawals() // Refresh withdrawals list
      return response.data.data
    } catch (err) {
      setError('Failed to request withdrawal')
      console.error('Error requesting withdrawal:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBankDetails = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorEarningsAPI.updateBankDetails(data)
      setBankDetails(response.data.data)
      return response.data.data
    } catch (err) {
      setError('Failed to update bank details')
      console.error('Error updating bank details:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchEarnings()
      fetchWithdrawals()
      fetchStats()
      fetchBankDetails()
    }
  }, [autoFetch, fetchEarnings, fetchWithdrawals, fetchStats, fetchBankDetails])

  return {
    earnings,
    withdrawals,
    stats,
    bankDetails,
    loading,
    error,
    fetchEarnings,
    fetchWithdrawals,
    fetchStats,
    fetchBankDetails,
    requestWithdrawal,
    updateBankDetails,
    setError
  }
}
