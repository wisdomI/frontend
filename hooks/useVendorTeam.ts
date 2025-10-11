'use client'

import { useState, useEffect, useCallback } from 'react'
import { vendorTeamAPI } from '@/lib/api'

interface UseVendorTeamOptions {
  autoFetch?: boolean
}

export function useVendorTeam(options: UseVendorTeamOptions = {}) {
  const { autoFetch = true } = options
  const [staff, setStaff] = useState<any[]>([])
  const [roles, setRoles] = useState<any[]>([])
  const [teamStats, setTeamStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStaff = useCallback(async (params?: { page?: number; limit?: number; role?: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorTeamAPI.getStaff(params)
      setStaff(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch staff')
      console.error('Error fetching staff:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorTeamAPI.getRoles()
      setRoles(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch roles')
      console.error('Error fetching roles:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTeamStats = useCallback(async () => {
    try {
      const response = await vendorTeamAPI.getTeamStats()
      setTeamStats(response.data.data)
    } catch (err) {
      console.error('Error fetching team stats:', err)
    }
  }, [])

  const addStaff = async (data: { name: string; email: string; phone: string; role: string }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorTeamAPI.addStaff(data)
      await fetchStaff() // Refresh staff list
      return response.data.data
    } catch (err) {
      setError('Failed to add staff member')
      console.error('Error adding staff member:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateStaff = async (id: string, data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorTeamAPI.updateStaff(id, data)
      await fetchStaff() // Refresh staff list
      return response.data.data
    } catch (err) {
      setError('Failed to update staff member')
      console.error('Error updating staff member:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removeStaff = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await vendorTeamAPI.removeStaff(id)
      await fetchStaff() // Refresh staff list
    } catch (err) {
      setError('Failed to remove staff member')
      console.error('Error removing staff member:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createRole = async (data: { name: string; permissions: string[] }) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorTeamAPI.createRole(data)
      await fetchRoles() // Refresh roles list
      return response.data.data
    } catch (err) {
      setError('Failed to create role')
      console.error('Error creating role:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (id: string, data: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await vendorTeamAPI.updateRole(id, data)
      await fetchRoles() // Refresh roles list
      return response.data.data
    } catch (err) {
      setError('Failed to update role')
      console.error('Error updating role:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteRole = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await vendorTeamAPI.deleteRole(id)
      await fetchRoles() // Refresh roles list
    } catch (err) {
      setError('Failed to delete role')
      console.error('Error deleting role:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchStaff()
      fetchRoles()
      fetchTeamStats()
    }
  }, [autoFetch, fetchStaff, fetchRoles, fetchTeamStats])

  return {
    staff,
    roles,
    teamStats,
    loading,
    error,
    fetchStaff,
    fetchRoles,
    fetchTeamStats,
    addStaff,
    updateStaff,
    removeStaff,
    createRole,
    updateRole,
    deleteRole,
    setError
  }
}
