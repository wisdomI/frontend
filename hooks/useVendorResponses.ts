'use client'

import { useState, useEffect, useCallback } from 'react'
import { vendorResponseAPI } from '@/lib/api'
import { VendorResponse, VendorResponseStats, VendorServiceRequest } from '@/types/api'

interface UseVendorResponsesOptions {
  autoFetch?: boolean
}

export function useVendorResponses(options: UseVendorResponsesOptions = {}) {
  const { autoFetch = true } = options
  const [responses, setResponses] = useState<VendorResponse[]>([])
  const [requests, setRequests] = useState<VendorServiceRequest[]>([])
  const [stats, setStats] = useState<VendorResponseStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorResponseAPI.getAll()
      setResponses(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch vendor responses')
      console.error('Error fetching vendor responses:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorResponseAPI.getRequests()
      setRequests(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch vendor response requests')
      console.error('Error fetching vendor response requests:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await vendorResponseAPI.getStats()
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching vendor response stats:', err)
    }
  }, [])

  const createResponse = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorResponseAPI.create(data)
      await fetchResponses() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to create vendor response')
      console.error('Error creating vendor response:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateResponse = async (id: string, data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorResponseAPI.update(id, data)
      await fetchResponses() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to update vendor response')
      console.error('Error updating vendor response:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const withdrawResponse = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await vendorResponseAPI.withdraw(id)
      await fetchResponses() // Refresh the list
    } catch (err) {
      setError('Failed to withdraw vendor response')
      console.error('Error withdrawing vendor response:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteResponse = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await vendorResponseAPI.delete(id)
      setResponses(responses.filter(r => r.id !== id))
    } catch (err) {
      setError('Failed to delete vendor response')
      console.error('Error deleting vendor response:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchResponses()
      fetchRequests()
      fetchStats()
    }
  }, [autoFetch, fetchResponses, fetchRequests, fetchStats])

  return {
    responses,
    requests,
    stats,
    loading,
    error,
    fetchResponses,
    fetchRequests,
    fetchStats,
    createResponse,
    updateResponse,
    withdrawResponse,
    deleteResponse,
    setError
  }
}
