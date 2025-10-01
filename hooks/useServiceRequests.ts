'use client'

import { useState, useEffect } from 'react'
import { serviceRequestAPI } from '@/lib/api'
import { ServiceRequest } from '@/types/api'

interface UseServiceRequestsOptions {
  viewType?: 'all' | 'my' | 'assigned' | 'open' | 'upcoming'
  autoFetch?: boolean
}

export function useServiceRequests(options: UseServiceRequestsOptions = {}) {
  const { viewType = 'all', autoFetch = true } = options
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    try {
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
      
      setRequests(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch service requests')
      console.error('Error fetching service requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const createRequest = async (formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.create(formData)
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

  const updateRequest = async (id: string, formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await serviceRequestAPI.update(id, formData)
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
      setRequests(requests.filter(r => r.id !== id))
    } catch (err) {
      setError('Failed to delete service request')
      console.error('Error deleting service request:', err)
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

  const updateStatus = async (id: string, status: 'open' | 'in-progress' | 'completed' | 'cancelled') => {
    try {
      setLoading(true)
      setError(null)
      await serviceRequestAPI.updateStatus(id, status)
      await fetchRequests() // Refresh the list
    } catch (err) {
      setError('Failed to update service request status')
      console.error('Error updating service request status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const assignPlanner = async (id: string, plannerId: string) => {
    try {
      setLoading(true)
      setError(null)
      await serviceRequestAPI.assignPlanner(id, plannerId)
      await fetchRequests() // Refresh the list
    } catch (err) {
      setError('Failed to assign planner')
      console.error('Error assigning planner:', err)
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
  }, [viewType, autoFetch])

  return {
    requests,
    loading,
    error,
    fetchRequests,
    createRequest,
    updateRequest,
    deleteRequest,
    toggleStatus,
    updateStatus,
    assignPlanner,
    searchRequests,
    getStats,
    setError
  }
}