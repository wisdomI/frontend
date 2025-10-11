'use client'

import { useState, useEffect, useCallback } from 'react'
import { meetingAPI, serviceRequestAPI } from '@/lib/api'

interface UseVendorBookingsOptions {
  autoFetch?: boolean
}

export function useVendorBookings(options: UseVendorBookingsOptions = {}) {
  const { autoFetch = true } = options
  const [bookings, setBookings] = useState<any[]>([])
  const [meetings, setMeetings] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async (params?: { page?: number; limit?: number; status?: string }) => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch service requests assigned to vendor using service-requests API
      console.log('📥 Fetching vendor bookings from API...')
      const response = await serviceRequestAPI.getAssigned()
      const data = response.data
      
      // Transform service requests to booking format
      const transformedBookings = data.data?.map((request: any) => ({
        id: request.id,
        status: request.status === 'accepted' ? 'active' : request.status,
        clientName: `${request.client?.firstName || ''} ${request.client?.lastName || ''}`.trim() || 'Unknown Client',
        clientAvatar: request.client?.profilePicture || '/images/avatar1.jpg',
        eventTitle: request.eventTitle || 'Untitled Event',
        eventType: request.eventType || 'Event',
        eventDate: request.eventStartDate ? new Date(request.eventStartDate).toLocaleDateString() : 'TBD',
        eventLocation: request.eventLocation || 'Location TBD',
        guests: request.numberOfGuests || 0,
        servicesNeeded: Array.isArray(request.servicesNeeded) ? request.servicesNeeded.join(', ') : request.servicesNeeded || 'Various Services',
        amount: request.budgetRange || '₦0',
        additionalInfo: request.additionalInfo || '',
        hasProgressTracker: false, // This would need to be determined from progress tracker API
        serviceRequestId: request.id,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt
      })) || []
      
      setBookings(transformedBookings)
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError('Access denied - please check your authentication')
        console.error('403 Forbidden - user may not have proper permissions:', err)
      } else {
        setError('Failed to fetch bookings')
        console.error('Error fetching bookings:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use generic meetings endpoint as it should work for vendors
      const response = await meetingAPI.getMy()
      setMeetings(response.data.data || [])
    } catch (err: any) {
      if (err?.response?.status === 403) {
        setError('Access denied - please check your authentication')
        console.error('403 Forbidden - user may not have proper permissions for meetings:', err)
      } else {
        setError('Failed to fetch meetings')
        console.error('Error fetching meetings:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchStats = useCallback(async () => {
    try {
      // Try vendor-specific analytics endpoint first
      const response = await fetch('https://backend-a3nd.onrender.com/api/v1/vendor/analytics/performance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data.data)
      } else {
        // Fallback: create mock stats since vendor-specific endpoints may not be fully implemented
        console.log('Vendor analytics endpoint not available, using fallback stats')
        setStats({
          activeBookings: 0,
          completedBookings: 0,
          totalBookings: 0
        })
      }
    } catch (err: any) {
      if (err?.response?.status === 403) {
        console.error('403 Forbidden - user may not have proper permissions for stats:', err)
      } else {
        console.error('Error fetching booking stats:', err)
      }
    }
  }, [])

  const updateBookingStatus = async (bookingId: string, status: 'active' | 'completed' | 'cancelled') => {
    try {
      setLoading(true)
      setError(null)
      
      // Map booking status to service request status
      const serviceRequestStatus = status === 'active' ? 'in-progress' : status
      
      // Update the service request status
      const response = await serviceRequestAPI.updateStatus(bookingId, serviceRequestStatus)
      
      // Refresh bookings list
      await fetchBookings()
      
      return response.data.data
    } catch (err) {
      setError('Failed to update booking status')
      console.error('Error updating booking status:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createMeeting = async (bookingId: string, meetingData: any) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await meetingAPI.create({
        ...meetingData,
        serviceRequestId: bookingId
      })
      
      // Refresh meetings list
      await fetchMeetings()
      
      return response.data.data
    } catch (err) {
      setError('Failed to create meeting')
      console.error('Error creating meeting:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const respondToMeeting = async (meetingId: string, response: 'accepted' | 'declined' | 'tentative') => {
    try {
      setLoading(true)
      setError(null)
      
      // This would need the attendee ID - for now we'll use a placeholder
      const attendeeId = 'current-user-id' // This should come from auth context
      
      // Map string response to MeetingResponse object
      const meetingResponse = { response } as any
      
      await meetingAPI.respond(meetingId, attendeeId, meetingResponse)
      
      // Refresh meetings list
      await fetchMeetings()
    } catch (err) {
      setError('Failed to respond to meeting')
      console.error('Error responding to meeting:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getBookingById = async (id: string) => {
    try {
      const response = await serviceRequestAPI.getById(id)
      return response.data.data
    } catch (err) {
      console.error('Error fetching booking by ID:', err)
      throw err
    }
  }

  const getMeetingById = async (id: string) => {
    try {
      const response = await meetingAPI.getById(id)
      return response.data.data
    } catch (err) {
      console.error('Error fetching meeting by ID:', err)
      throw err
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchBookings()
      fetchMeetings()
      fetchStats()
    }
  }, [autoFetch, fetchBookings, fetchMeetings, fetchStats])

  return {
    bookings,
    meetings,
    stats,
    loading,
    error,
    fetchBookings,
    fetchMeetings,
    fetchStats,
    updateBookingStatus,
    createMeeting,
    respondToMeeting,
    getBookingById,
    getMeetingById,
    setError
  }
}
