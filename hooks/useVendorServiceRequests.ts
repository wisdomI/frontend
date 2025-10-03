'use client'

import { useState, useEffect, useCallback } from 'react'
import { vendorServiceRequestAPI } from '@/lib/api'
import { VendorServiceRequest, ServiceRequestStats } from '@/types/api'

interface UseVendorServiceRequestsOptions {
  viewType?: 'all' | 'my' | 'received' | 'pending' | 'upcoming'
  autoFetch?: boolean
}

export function useVendorServiceRequests(options: UseVendorServiceRequestsOptions = {}) {
  const { viewType = 'all', autoFetch = true } = options
  const [requests, setRequests] = useState<VendorServiceRequest[]>([])
  const [stats, setStats] = useState<ServiceRequestStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = useCallback(async () => {
    try {
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
      
      setRequests(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch vendor service requests')
      console.error('Error fetching vendor service requests:', err)
    } finally {
      setLoading(false)
    }
  }, [viewType])

  const fetchStats = useCallback(async () => {
    try {
      const response = await vendorServiceRequestAPI.getStats()
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching vendor service request stats:', err)
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
      setRequests(requests.filter(r => r.id !== id))
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
      fetchStats()
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
