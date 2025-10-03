'use client'

import { useState, useEffect, useCallback } from 'react'
import { ratingAPI } from '@/lib/api'
import { Rating, RatingStats } from '@/types/api'

interface UseRatingsOptions {
  userId?: string
  viewType?: 'all' | 'my' | 'by-reviewer' | 'by-reviewee'
  autoFetch?: boolean
}

export function useRatings(options: UseRatingsOptions = {}) {
  const { userId, viewType = 'all', autoFetch = true } = options
  const [ratings, setRatings] = useState<Rating[]>([])
  const [stats, setStats] = useState<RatingStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRatings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      let response
      switch (viewType) {
        case 'my':
          response = await ratingAPI.getMy()
          break
        case 'by-reviewer':
          if (!userId) throw new Error('User ID required for by-reviewer view')
          response = await ratingAPI.getByReviewer(userId)
          break
        case 'by-reviewee':
          if (!userId) throw new Error('User ID required for by-reviewee view')
          response = await ratingAPI.getByReviewee(userId)
          break
        default:
          response = await ratingAPI.getAll()
      }
      
      setRatings(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch ratings')
      console.error('Error fetching ratings:', err)
    } finally {
      setLoading(false)
    }
  }, [viewType, userId])

  const fetchStats = useCallback(async () => {
    if (!userId) return
    
    try {
      const response = await ratingAPI.getStats(userId)
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching rating stats:', err)
    }
  }, [userId])

  const createRating = async (formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await ratingAPI.create(formData)
      await fetchRatings() // Refresh the list
      if (userId) await fetchStats() // Refresh stats
      return response.data.data
    } catch (err) {
      setError('Failed to create rating')
      console.error('Error creating rating:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateRating = async (id: string, formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await ratingAPI.update(id, formData)
      await fetchRatings() // Refresh the list
      if (userId) await fetchStats() // Refresh stats
      return response.data.data
    } catch (err) {
      setError('Failed to update rating')
      console.error('Error updating rating:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteRating = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await ratingAPI.delete(id)
      setRatings(ratings.filter(r => r.id !== id))
      if (userId) await fetchStats() // Refresh stats
    } catch (err) {
      setError('Failed to delete rating')
      console.error('Error deleting rating:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getRatingById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await ratingAPI.getById(id)
      return response.data.data
    } catch (err) {
      setError('Failed to fetch rating')
      console.error('Error fetching rating:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchRatings()
      if (userId) fetchStats()
    }
  }, [autoFetch, fetchRatings, fetchStats, userId])

  return {
    ratings,
    stats,
    loading,
    error,
    fetchRatings,
    fetchStats,
    createRating,
    updateRating,
    deleteRating,
    getRatingById,
    setError
  }
}
