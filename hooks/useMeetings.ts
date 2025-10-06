import { useState, useEffect } from 'react'
import { meetingAPI } from '@/lib/api'
import { Meeting, CreateMeetingRequest, UpdateMeetingRequest } from '@/types/api'

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMyMeetings = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.getMy()
      setMeetings(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch meetings')
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendances = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.getAttendances()
      setMeetings(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch attendances')
    } finally {
      setLoading(false)
    }
  }

  const createMeeting = async (data: CreateMeetingRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.create(data)
      setMeetings(prev => [...prev, response.data.data])
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create meeting')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateMeeting = async (id: string, data: UpdateMeetingRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.update(id, data)
      setMeetings(prev => 
        prev.map(meeting => 
          meeting.id === id ? response.data.data : meeting
        )
      )
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update meeting')
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
      setMeetings(prev => 
        prev.map(meeting => 
          meeting.id === id ? response.data.data : meeting
        )
      )
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to toggle meeting status')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getMeetingInstances = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.getInstances(id)
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch meeting instances')
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
      setMeetings(prev => prev.filter(meeting => meeting.id !== id))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete meeting')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getMeetingById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await meetingAPI.getById(id)
      return response.data.data
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch meeting')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyMeetings()
  }, [])

  return {
    meetings,
    loading,
    error,
    fetchMyMeetings,
    fetchAttendances,
    createMeeting,
    updateMeeting,
    toggleMeetingStatus,
    getMeetingInstances,
    deleteMeeting,
    getMeetingById,
  }
}