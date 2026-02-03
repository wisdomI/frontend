import { useState, useEffect } from 'react'
import { availabilityAPI } from '@/lib/api'
import { Availability, AvailabilityStats } from '@/types/api'

export const useAvailability = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [stats, setStats] = useState<AvailabilityStats | null>(null)
  const [availableVendors, setAvailableVendors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllAvailabilities = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await availabilityAPI.getAll()
      setAvailabilities(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch availabilities')
      console.error('Error fetching availabilities:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailabilityById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await availabilityAPI.getById(id)
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch availability by ID')
      console.error('Error fetching availability by ID:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const findAvailableVendors = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await availabilityAPI.findAvailableVendors()
      setAvailableVendors(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to find available vendors')
      console.error('Error finding available vendors:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await availabilityAPI.getStats()
      setStats(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch availability stats')
      console.error('Error fetching availability stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchAll = async () => {
    await Promise.all([
      fetchAllAvailabilities(),
      fetchStats(),
      findAvailableVendors()
    ])
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return {
    availabilities,
    stats,
    availableVendors,
    loading,
    error,
    refetch: fetchAll,
    refetchAvailabilities: fetchAllAvailabilities,
    refetchStats: fetchStats,
    refetchAvailableVendors: findAvailableVendors,
    fetchAvailabilityById
  }
}
