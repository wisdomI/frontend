'use client'

import { useState, useEffect, useCallback } from 'react'
import { meetingAPI } from '@/lib/api'
import {
  Meeting,
  MeetingStats,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  MeetingResponse,
  CheckConflictsRequest,
} from '@/types/api'
import { MeetingPayloadSchema, CheckConflictsSchema } from '@/lib/validation'
import { logError, reportNetworkFailure } from '@/lib/logger'

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [meetingStats, setMeetingStats] = useState<MeetingStats | null>(null)
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = (err: any, fallbackMessage: string, context?: Record<string, unknown>) => {
    if (context) {
      reportNetworkFailure({ operation: context.operation as string, error: err })
      logError(fallbackMessage, { error: err, ...context })
    }
    const message = err?.response?.data?.message || fallbackMessage
    setError(message)
  }

  const fetchMyMeetings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.getMy()
      setMeetings(response.data.data || [])
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to fetch meetings', { operation: 'meetings.fetchAll' })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAllMeetings = useCallback(async (params?: any) => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.getAll(params)
      setMeetings(response.data.data || [])
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to fetch meetings')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAttendances = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.getAttendances()
      setMeetings(response.data.data || [])
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to fetch attendances', { operation: 'meetings.fetchAttendances' })
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createMeeting = async (data: CreateMeetingRequest) => {
    try {
      setLoading(true)
      setError(null)
      const validated = MeetingPayloadSchema.parse(data)
      const response = await meetingAPI.create(validated)
      setMeetings(prev => [...prev, response.data.data])
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to create meeting', { operation: 'meetings.create' })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMeeting = async (id: string, data: UpdateMeetingRequest) => {
    try {
      setLoading(true)
      setError(null)
      const validated = MeetingPayloadSchema.parse(data)
      const response = await meetingAPI.update(id, validated)
      setMeetings(prev => prev.map(meeting => (meeting.id === id ? response.data.data : meeting)))
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to update meeting', { operation: 'meetings.update', meetingId: id })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const toggleMeetingStatus = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.toggleStatus(id)
      setMeetings(prev => prev.map(meeting => (meeting.id === id ? response.data.data : meeting)))
      return response.data
    } catch (err: any) {
      handleError(err, 'Failed to toggle meeting status', { operation: 'meetings.toggle', meetingId: id })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getMeetingInstances = async (id: string) => {
    try {
      const response = await meetingAPI.getInstances(id)
      return response.data.data || []
    } catch (err: any) {
      handleError(err, 'Failed to fetch meeting instances')
      throw err
    }
  }

  const deleteMeeting = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      await meetingAPI.delete(id)
      setMeetings(prev => prev.filter(meeting => meeting.id !== id))
    } catch (err: any) {
      handleError(err, 'Failed to delete meeting', { operation: 'meetings.delete', meetingId: id })
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getMeetingById = async (id: string) => {
    try {
      const response = await meetingAPI.getById(id)
      return response.data.data
    } catch (err: any) {
      handleError(err, 'Failed to fetch meeting')
      throw err
    }
  }

  const getMeetingByEmail = async (email: string) => {
    try {
      const response = await meetingAPI.getByEmail(email)
      return response.data.data || []
    } catch (err: any) {
      handleError(err, 'Failed to fetch meetings by email')
      throw err
    }
  }

  const respondToMeeting = async (
    meetingId: string,
    attendeeId: string,
    payload: MeetingResponse
  ) => {
    try {
      setError(null)
      return await meetingAPI.respond(meetingId, attendeeId, payload)
    } catch (err: any) {
      handleError(err, 'Failed to respond to meeting', { operation: 'meetings.respond', meetingId, attendeeId })
      throw err
    }
  }

  const checkConflicts = async (payload: CheckConflictsRequest) => {
    try {
      const validated = CheckConflictsSchema.parse(payload)
      const response = await meetingAPI.checkConflicts(validated)
      return response.data.data
    } catch (err: any) {
      handleError(err, 'Failed to check conflicts', { operation: 'meetings.checkConflicts' })
      throw err
    }
  }

  const fetchMeetingStats = useCallback(async () => {
    try {
      const response = await meetingAPI.getStats()
      setMeetingStats(response.data.data)
    } catch (err: any) {
      handleError(err, 'Failed to load meeting stats')
    }
  }, [])

  const fetchUpcoming = useCallback(async () => {
    try {
      const response = await meetingAPI.getUpcoming()
      setUpcomingMeetings(response.data.data || [])
    } catch (err: any) {
      handleError(err, 'Failed to load upcoming meetings')
    }
  }, [])

  useEffect(() => {
    fetchMyMeetings()
    fetchMeetingStats()
    fetchUpcoming()
  }, [fetchMyMeetings, fetchMeetingStats, fetchUpcoming])

  return {
    meetings,
    meetingStats,
    upcomingMeetings,
    loading,
    error,
    fetchMyMeetings,
    fetchAllMeetings,
    fetchAttendances,
    fetchMeetingStats,
    fetchUpcomingMeetings: fetchUpcoming,
    createMeeting,
    updateMeeting,
    toggleMeetingStatus,
    getMeetingInstances,
    deleteMeeting,
    getMeetingById,
    getMeetingByEmail,
    respondToMeeting,
    checkConflicts,
  }
}

