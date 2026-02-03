'use client'

import { useState, useEffect, useCallback } from 'react'
import { progressTrackerAPI } from '@/lib/api'
import { ProgressTracker, Deliverable, ProgressTrackerStats } from '@/types/api'

interface UseProgressTrackingOptions {
  autoFetch?: boolean
}

export function useProgressTracking(options: UseProgressTrackingOptions = {}) {
  const { autoFetch = true } = options
  const [trackers, setTrackers] = useState<ProgressTracker[]>([])
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [stats, setStats] = useState<ProgressTrackerStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTrackers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await progressTrackerAPI.getAll()
      setTrackers(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch progress trackers')
      console.error('Error fetching progress trackers:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      const response = await progressTrackerAPI.getStats()
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching progress tracker stats:', err)
    }
  }, [])

  const createTracker = async (data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await progressTrackerAPI.create(data)
      await fetchTrackers() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to create progress tracker')
      console.error('Error creating progress tracker:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTracker = async (id: string, data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await progressTrackerAPI.update(id, data)
      await fetchTrackers() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to update progress tracker')
      console.error('Error updating progress tracker:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTrackerStatus = async (id: string, status: 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled') => {
    try {
      setLoading(true)
      setError(null)
      await progressTrackerAPI.updateStatus(id, status)
      await fetchTrackers() // Refresh the list
    } catch (err) {
      setError('Failed to update progress tracker status')
      console.error('Error updating progress tracker status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTracker = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await progressTrackerAPI.delete(id)
      setTrackers(trackers.filter(t => t.id !== id))
    } catch (err) {
      setError('Failed to delete progress tracker')
      console.error('Error deleting progress tracker:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Deliverable methods
  const createDeliverable = async (progressTrackerId: string, data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await progressTrackerAPI.createDeliverable(progressTrackerId, data)
      return response.data.data
    } catch (err) {
      setError('Failed to create deliverable')
      console.error('Error creating deliverable:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateDeliverable = async (id: string, data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await progressTrackerAPI.updateDeliverable(id, data)
      return response.data.data
    } catch (err) {
      setError('Failed to update deliverable')
      console.error('Error updating deliverable:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateDeliverableStatus = async (id: string, status: 'pending' | 'in-progress' | 'completed' | 'overdue') => {
    try {
      setLoading(true)
      setError(null)
      await progressTrackerAPI.updateDeliverableStatus(id, status)
    } catch (err) {
      setError('Failed to update deliverable status')
      console.error('Error updating deliverable status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteDeliverable = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await progressTrackerAPI.deleteDeliverable(id)
      setDeliverables(deliverables.filter(d => d.id !== id))
    } catch (err) {
      setError('Failed to delete deliverable')
      console.error('Error deleting deliverable:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchTrackers()
      fetchStats()
    }
  }, [autoFetch, fetchTrackers, fetchStats])

  return {
    trackers,
    deliverables,
    stats,
    loading,
    error,
    fetchTrackers,
    fetchStats,
    createTracker,
    updateTracker,
    updateTrackerStatus,
    deleteTracker,
    createDeliverable,
    updateDeliverable,
    updateDeliverableStatus,
    deleteDeliverable,
    setError
  }
}
