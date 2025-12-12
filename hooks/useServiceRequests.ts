'use client'

import { useState, useEffect, useCallback } from 'react'
import { serviceRequestAPI } from '@/lib/api'
import { ServiceRequest } from '@/types/api'

interface UseServiceRequestsOptions {
  viewType?: 'all' | 'my' | 'assigned' | 'open' | 'upcoming'
  autoFetch?: boolean
}

type CacheRecord = {
  data: ServiceRequest[]
  timestamp: number
}

const SERVICE_REQUEST_CACHE = new Map<string, CacheRecord>()
const SERVICE_REQUEST_CACHE_TTL = 1000 * 60 * 2 // 2 minutes

const isCacheValid = (record?: CacheRecord | null) =>
  !!record && Date.now() - record.timestamp < SERVICE_REQUEST_CACHE_TTL

export function useServiceRequests(options: UseServiceRequestsOptions = {}) {
  const { viewType = 'all', autoFetch = true } = options
  const cacheKey = viewType
  const cachedRecord = SERVICE_REQUEST_CACHE.get(cacheKey)
  const cachedDataIsFresh = isCacheValid(cachedRecord)
  const [requests, setRequests] = useState<ServiceRequest[]>(cachedRecord?.data ?? [])
  const [loading, setLoading] = useState(autoFetch && !cachedDataIsFresh)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = useCallback(
    async ({ force = false }: { force?: boolean } = {}) => {
      try {
        const cached = SERVICE_REQUEST_CACHE.get(cacheKey)
        if (!force && isCacheValid(cached)) {
          setRequests(cached!.data)
          setLoading(false)
          return cached!.data
        }

        setLoading(true)
        setError(null)

        let response
        switch (viewType) {
          case 'my':
            response = await serviceRequestAPI.getMy()
            break
          case 'assigned':
            response = await serviceRequestAPI.getAssigned()
            break
          case 'open':
            response = await serviceRequestAPI.getOpen()
            break
          case 'upcoming':
            response = await serviceRequestAPI.getUpcoming()
            break
          default:
            response = await serviceRequestAPI.getAll()
        }

        const data = response.data.data || []
        SERVICE_REQUEST_CACHE.set(cacheKey, { data, timestamp: Date.now() })
        setRequests(data)
        return data
      } catch (err) {
        setError('Failed to fetch service requests')
        console.error('Error fetching service requests:', err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [cacheKey, viewType]
  )

  const createRequest = async (data: FormData | any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.create(data)
      await fetchRequests() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to create service request')
      console.error('Error creating service request:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateRequest = async (id: string, data: FormData | any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.update(id, data)
      await fetchRequests() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to update service request')
      console.error('Error updating service request:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteRequest = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await serviceRequestAPI.delete(id)
      setRequests((prev) => {
        const next = prev.filter(r => r.id !== id)
        const existing = SERVICE_REQUEST_CACHE.get(cacheKey)
        if (existing) {
          SERVICE_REQUEST_CACHE.set(cacheKey, { data: next, timestamp: Date.now() })
        }
        return next
      })
    } catch (err) {
      setError('Failed to delete service request')
      console.error('Error deleting service request:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Vendor response operations
  const vendorAccept = async (id: string, data?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.vendorAccept(id, data)
      await fetchRequests() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to accept service request')
      console.error('Error accepting service request:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const vendorReject = async (id: string, data?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.vendorReject(id, data)
      await fetchRequests() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to reject service request')
      console.error('Error rejecting service request:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleRequestStatus = async (id: string, data?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.toggleStatus(id, data)
      await fetchRequests() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to toggle service request status')
      console.error('Error toggling service request status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Admin operations
  const assignPlanner = async (id: string, plannerId: string, notes?: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.assignPlanner(id, { plannerId, notes })
      await fetchRequests() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to assign planner')
      console.error('Error assigning planner:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (id: string, status: string, notes?: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.updateStatus(id, { status, notes })
      await fetchRequests() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to update service request status')
      console.error('Error updating service request status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Vendor response management
  const getVendorResponses = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.getVendorResponses(id)
      return response.data.data
    } catch (err) {
      setError('Failed to fetch vendor responses')
      console.error('Error fetching vendor responses:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getVendorResponseHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.getVendorResponseHistory()
      return response.data.data
    } catch (err) {
      setError('Failed to fetch vendor response history')
      console.error('Error fetching vendor response history:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Bulk operations
  const bulkVendorResponses = async (data: any[]) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.bulkVendorResponses(data)
      await fetchRequests() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to process bulk vendor responses')
      console.error('Error processing bulk vendor responses:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await serviceRequestAPI.toggleStatus(id)
      await fetchRequests() // Refresh the list
    } catch (err) {
      setError('Failed to toggle service request status')
      console.error('Error toggling service request status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }


  const searchRequests = async (params: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.search(params)
      setRequests(response.data.data || [])
      return response.data.data
    } catch (err) {
      setError('Failed to search service requests')
      console.error('Error searching service requests:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getStats = async () => {
    try {
      const response = await serviceRequestAPI.getStats()
      return response.data.data
    } catch (err) {
      setError('Failed to fetch service request stats')
      console.error('Error fetching service request stats:', err)
      throw err
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchRequests()
    }
  }, [autoFetch, fetchRequests])

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequest,
    deleteRequest,
    toggleStatus,
    searchRequests,
    getStats,
    // New vendor response operations
    vendorAccept,
    vendorReject,
    toggleRequestStatus,
    updateRequestStatus,
    assignPlanner,
    getVendorResponses,
    getVendorResponseHistory,
    bulkVendorResponses,
    setError
  }
}