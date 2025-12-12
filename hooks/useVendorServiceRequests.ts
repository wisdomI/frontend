'use client'

import { useState, useEffect, useCallback } from 'react'
import { vendorServiceRequestAPI } from '@/lib/api'
import { VendorServiceRequest, ServiceRequestStats } from '@/types/api'

interface UseVendorServiceRequestsOptions {
  viewType?: 'all' | 'my' | 'received' | 'pending' | 'upcoming'
  autoFetch?: boolean
}

type RequestsCacheRecord = {
  data: VendorServiceRequest[]
  timestamp: number
}

type StatsCacheRecord = {
  data: ServiceRequestStats | null
  timestamp: number
}

const VENDOR_SERVICE_REQUEST_CACHE = new Map<string, RequestsCacheRecord>()
let VENDOR_SERVICE_REQUEST_STATS_CACHE: StatsCacheRecord | null = null
const VENDOR_SERVICE_CACHE_TTL = 1000 * 60 * 2 // 2 minutes

const isCacheValid = <T extends { timestamp: number }>(record?: T | null) =>
  !!record && Date.now() - record.timestamp < VENDOR_SERVICE_CACHE_TTL

export function useVendorServiceRequests(options: UseVendorServiceRequestsOptions = {}) {
  const { viewType = 'all', autoFetch = true } = options
  const cacheKey = viewType
  const cachedRequestRecord = VENDOR_SERVICE_REQUEST_CACHE.get(cacheKey)
  const cachedStatsRecord = VENDOR_SERVICE_REQUEST_STATS_CACHE
  const hasFreshRequestCache = isCacheValid(cachedRequestRecord)
  const hasFreshStatsCache = isCacheValid(cachedStatsRecord)
  const [requests, setRequests] = useState<VendorServiceRequest[]>(cachedRequestRecord?.data ?? [])
  const [stats, setStats] = useState<ServiceRequestStats | null>(cachedStatsRecord?.data ?? null)
  const [loading, setLoading] = useState(autoFetch && !hasFreshRequestCache)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    try {
      const cached = VENDOR_SERVICE_REQUEST_CACHE.get(cacheKey)
      if (isCacheValid(cached)) {
        setRequests(cached!.data)
        setLoading(false)
        return cached!.data
      }

      setLoading(true)
      setError(null)

      let response
      switch (viewType) {
        case 'my':
          response = await vendorServiceRequestAPI.getMy()
          break
        case 'received':
          response = await vendorServiceRequestAPI.getReceived()
          break
        case 'pending':
          response = await vendorServiceRequestAPI.getPending()
          break
        case 'upcoming':
          response = await vendorServiceRequestAPI.getUpcoming()
          break
        default:
          response = await vendorServiceRequestAPI.getAll()
      }

      const data = response.data.data || []
      VENDOR_SERVICE_REQUEST_CACHE.set(cacheKey, { data, timestamp: Date.now() })
      setRequests(data)
      return data
    } catch (err) {
      setError('Failed to fetch vendor service requests')
      console.error('Error fetching vendor service requests:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [cacheKey, viewType])

  const fetchStats = useCallback(async () => {
    try {
      if (isCacheValid(VENDOR_SERVICE_REQUEST_STATS_CACHE)) {
        setStats(VENDOR_SERVICE_REQUEST_STATS_CACHE!.data)
        return VENDOR_SERVICE_REQUEST_STATS_CACHE!.data
      }

      const response = await vendorServiceRequestAPI.getStats()
      const data = response.data.data ?? null
      VENDOR_SERVICE_REQUEST_STATS_CACHE = { data, timestamp: Date.now() }
      setStats(data)
      return data
    } catch (err) {
      console.error('Error fetching vendor service request stats:', err)
      throw err
    }
  }, [])

  const createRequest = async (formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorServiceRequestAPI.create(formData)
      await fetchRequests() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to create vendor service request')
      console.error('Error creating vendor service request:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateRequest = async (id: string, formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorServiceRequestAPI.update(id, formData)
      await fetchRequests() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to update vendor service request')
      console.error('Error updating vendor service request:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteRequest = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await vendorServiceRequestAPI.delete(id)
      setRequests((prev) => {
        const next = prev.filter(r => r.id !== id)
        const existing = VENDOR_SERVICE_REQUEST_CACHE.get(cacheKey)
        if (existing) {
          VENDOR_SERVICE_REQUEST_CACHE.set(cacheKey, { data: next, timestamp: Date.now() })
        }
        return next
      })
    } catch (err) {
      setError('Failed to delete vendor service request')
      console.error('Error deleting vendor service request:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await vendorServiceRequestAPI.toggleStatus(id)
      await fetchRequests() // Refresh the list
    } catch (err) {
      setError('Failed to toggle vendor service request status')
      console.error('Error toggling vendor service request status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const respondToRequest = async (id: string, response: 'accepted' | 'declined' | 'counter_offer') => {
    try {
      setLoading(true)
      setError(null)
      await vendorServiceRequestAPI.respond(id, { response })
      await fetchRequests() // Refresh the list
    } catch (err) {
      setError('Failed to respond to vendor service request')
      console.error('Error responding to vendor service request:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const searchRequests = async (params: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorServiceRequestAPI.search(params)
      setRequests(response.data.data || [])
      return response.data.data
    } catch (err) {
      setError('Failed to search vendor service requests')
      console.error('Error searching vendor service requests:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchRequests()
      fetchStats().catch(() => undefined)
    }
  }, [autoFetch, fetchRequests, fetchStats])

  return {
    requests,
    stats,
    loading,
    error,
    fetchRequests,
    fetchStats,
    createRequest,
    updateRequest,
    deleteRequest,
    toggleStatus,
    respondToRequest,
    searchRequests,
    setError
  }
}
