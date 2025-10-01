'use client'

import { useState, useEffect } from 'react'
import { meetingAPI } from '@/lib/api'
import { Meeting, MeetingStats } from '@/types/api'

interface UseMeetingsOptions {
  viewType?: 'all' | 'my' | 'attendances' | 'upcoming'
  autoFetch?: boolean
}

export function useMeetings(options: UseMeetingsOptions = {}) {
  const { viewType = 'all', autoFetch = true } = options
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [stats, setStats] = useState<MeetingStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMeetings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let response
      switch (viewType) {
        case 'my':
          response = await meetingAPI.getMy()
          break
        case 'attendances':
          response = await meetingAPI.getAttendances()
          break
        case 'upcoming':
          response = await meetingAPI.getUpcoming()
          break
        default:
          response = await meetingAPI.getAll()
      }
      
      setMeetings(response.data.data || [])
    } catch (err) {
      setError('Failed to fetch meetings')
      console.error('Error fetching meetings:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await meetingAPI.getStats()
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching meeting stats:', err)
    }
  }

  const createMeeting = async (formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.create(formData)
      await fetchMeetings() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to create meeting')
      console.error('Error creating meeting:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMeeting = async (id: string, formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.update(id, formData)
      await fetchMeetings() // Refresh the list
      return response.data.data
    } catch (err) {
      setError('Failed to update meeting')
      console.error('Error updating meeting:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteMeeting = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await meetingAPI.delete(id)
      setMeetings(meetings.filter(m => m.id !== id))
    } catch (err) {
      setError('Failed to delete meeting')
      console.error('Error deleting meeting:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await meetingAPI.toggleStatus(id)
      await fetchMeetings() // Refresh the list
    } catch (err) {
      setError('Failed to toggle meeting status')
      console.error('Error toggling meeting status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const respondToMeeting = async (meetingId: string, attendeeId: string, response: 'accepted' | 'declined' | 'tentative') => {
    try {
      setLoading(true)
      setError(null)
      await meetingAPI.respond(meetingId, attendeeId, { response })
      await fetchMeetings() // Refresh the list
    } catch (err) {
      setError('Failed to respond to meeting')
      console.error('Error responding to meeting:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const checkConflicts = async (data: any) => {
    try {
      setError(null)
      const response = await meetingAPI.checkConflicts(data)
      return response.data.data
    } catch (err) {
      setError('Failed to check meeting conflicts')
      console.error('Error checking conflicts:', err)
      throw err
    }
  }

  const getMeetingInstances = async (id: string) => {
    try {
      setError(null)
      const response = await meetingAPI.getInstances(id)
      return response.data.data
    } catch (err) {
      setError('Failed to fetch meeting instances')
      console.error('Error fetching meeting instances:', err)
      throw err
    }
  }

  const getMeetingsByEmail = async (email: string) => {
    try {
      setError(null)
      const response = await meetingAPI.getByEmail(email)
      return response.data.data
    } catch (err) {
      setError('Failed to fetch meetings by email')
      console.error('Error fetching meetings by email:', err)
      throw err
    }
  }

  const getMeetingById = async (id: string) => {
    try {
      setError(null)
      const response = await meetingAPI.getById(id)
      return response.data.data
    } catch (err) {
      setError('Failed to fetch meeting')
      console.error('Error fetching meeting:', err)
      throw err
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchMeetings()
      fetchStats()
    }
  }, [viewType, autoFetch])

  return {
    meetings,
    stats,
    loading,
    error,
    fetchMeetings,
    fetchStats,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    toggleStatus,
    respondToMeeting,
    checkConflicts,
    getMeetingInstances,
    getMeetingsByEmail,
    getMeetingById,
    setError
  }
}