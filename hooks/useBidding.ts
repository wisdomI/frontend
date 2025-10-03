'use client'

import { useState, useEffect, useCallback } from 'react'
import { bidAPI } from '@/lib/api'
import { Bid, BidStats } from '@/types/api'

interface UseBiddingOptions {
  viewType?: 'all' | 'my' | 'received'
  serviceRequestId?: string
  autoFetch?: boolean
}

export function useBidding(options: UseBiddingOptions = {}) {
  const { viewType = 'all', serviceRequestId, autoFetch = true } = options
  const [bids, setBids] = useState<Bid[]>([])
  const [stats, setStats] = useState<BidStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBids = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      let response
      if (serviceRequestId) {
        // Fetch bids for specific service request
        response = await bidAPI.getAll({ serviceRequestId } as any)
      } else {
        response = await bidAPI.getAll()
      }
      
      setBids(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch bids')
      console.error('Error fetching bids:', err)
    } finally {
      setLoading(false)
    }
  }, [serviceRequestId])

  const fetchStats = useCallback(async () => {
    try {
      const response = await bidAPI.getStats()
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching bid stats:', err)
    }
  }, [])

  const createBid = async (formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidAPI.create(formData)
      await fetchBids() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to create bid')
      console.error('Error creating bid:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBid = async (id: string, data: Partial<Bid>) => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidAPI.update(id, data)
      await fetchBids() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to update bid')
      console.error('Error updating bid:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const withdrawBid = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await bidAPI.withdraw(id)
      await fetchBids() // Refresh the list
    } catch (err) {
      setError('Failed to withdraw bid')
      console.error('Error withdrawing bid:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteBid = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await bidAPI.delete(id)
      setBids(bids.filter(b => b.id !== id))
    } catch (err) {
      setError('Failed to delete bid')
      console.error('Error deleting bid:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const acceptBid = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await bidAPI.accept(id)
      await fetchBids() // Refresh the list
    } catch (err) {
      setError('Failed to accept bid')
      console.error('Error accepting bid:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const rejectBid = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await bidAPI.reject(id)
      await fetchBids() // Refresh the list
    } catch (err) {
      setError('Failed to reject bid')
      console.error('Error rejecting bid:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getBidWithDetails = async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidAPI.getWithDetails(params)
      return response.data.data
    } catch (err) {
      setError('Failed to fetch bid details')
      console.error('Error fetching bid details:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchBids()
      fetchStats()
    }
  }, [autoFetch, fetchBids, fetchStats])

  return {
    bids,
    stats,
    loading,
    error,
    fetchBids,
    fetchStats,
    createBid,
    updateBid,
    withdrawBid,
    deleteBid,
    acceptBid,
    rejectBid,
    getBidWithDetails,
    setError
  }
}
