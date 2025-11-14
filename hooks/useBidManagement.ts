import { useState, useEffect } from 'react'
import { bidAPI } from '@/lib/api'
import { Bid, CreateBidRequest, UpdateBidRequest, BidStats } from '@/types/api'
import { CreateBidSchema, UpdateBidSchema } from '@/lib/validation'
import { reportNetworkFailure, logError } from '@/lib/logger'

export const useBidManagement = () => {
  const [bids, setBids] = useState<Bid[]>([])
  const [bid, setBid] = useState<Bid | null>(null)
  const [stats, setStats] = useState<BidStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: any, fallback: string, context: string) => {
    reportNetworkFailure({ operation: context, error: err })
    logError(fallback, { error: err, context })
    setError(err.response?.data?.message || fallback)
  }

  const fetchBids = async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidAPI.getAll(params)
      setBids(response.data.data || [])
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to fetch bids', 'bids.fetch')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchBidsWithDetails = async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidAPI.getWithDetails(params)
      setBids(response.data.data || [])
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to fetch bids with details', 'bids.fetchWithDetails')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchBidById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidAPI.getById(id)
      setBid(response.data.data)
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to fetch bid', 'bids.fetchById')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidAPI.getStats()
      setStats(response.data.data)
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to fetch bid stats', 'bids.fetchStats')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createBid = async (data: CreateBidRequest) => {
    try {
      setLoading(true)
      setError(null)
      const payload = CreateBidSchema.parse(data)
      const response = await bidAPI.create(payload)
      setBids(prev => [...prev, response.data.data])
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to create bid', 'bids.create')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateBid = async (id: string, data: UpdateBidRequest) => {
    try {
      setLoading(true)
      setError(null)
      const payload = UpdateBidSchema.parse(data)
      const response = await bidAPI.update(id, payload)
      setBids(prev => 
        prev.map(bid => 
          bid.id === id ? response.data.data : bid
        )
      )
      if (bid?.id === id) {
        setBid(response.data.data)
      }
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to update bid', 'bids.update')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const withdrawBid = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidAPI.withdraw(id)
      setBids(prev => 
        prev.map(bid => 
          bid.id === id ? response.data.data : bid
        )
      )
      if (bid?.id === id) {
        setBid(response.data.data)
      }
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to withdraw bid', 'bids.withdraw')
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
      setBids(prev => prev.filter(bid => bid.id !== id))
      if (bid?.id === id) {
        setBid(null)
      }
    } catch (err: any) {
      handleError(err, 'Failed to delete bid', 'bids.delete')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const acceptBid = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidAPI.accept(id)
      setBids(prev => 
        prev.map(bid => 
          bid.id === id ? response.data.data : bid
        )
      )
      if (bid?.id === id) {
        setBid(response.data.data)
      }
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to accept bid', 'bids.accept')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const rejectBid = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await bidAPI.reject(id)
      setBids(prev => 
        prev.map(bid => 
          bid.id === id ? response.data.data : bid
        )
      )
      if (bid?.id === id) {
        setBid(response.data.data)
      }
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to reject bid', 'bids.reject')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBids()
    fetchStats()
  }, [])

  return {
    bids,
    bid,
    stats,
    loading,
    error,
    fetchBids,
    fetchBidsWithDetails,
    fetchBidById,
    fetchStats,
    createBid,
    updateBid,
    withdrawBid,
    deleteBid,
    acceptBid,
    rejectBid,
  }
}
