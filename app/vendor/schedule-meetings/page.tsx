'use client'

import { useState, useEffect, useCallback } from 'react'
import { Calendar, momentLocalizer, Event, View } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCalendar } from 'react-icons/fi'
import { meetingAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { ButtonLoader } from '@/components/ui/Loader'

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

interface CalendarEvent extends Event {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  location?: string
  attendees?: string[]
  type?: string
}

export default function VendorScheduleMeetingsPage() {
  const { user } = useAuthContext()
  const { addNotification } = useApp()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    attendees: '',
    meetingLink: ''
  })

  // Fetch meetings from API
  const fetchMeetings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Vendor: Fetching meetings from API...')
      
      const response = await meetingAPI.getMy()
      const meetingsData = response.data.data || []
      
      console.log('✅ Vendor: Meetings loaded:', meetingsData)
      
      // Transform API data to calendar events
      const calendarEvents: CalendarEvent[] = meetingsData.map((meeting: any) => ({
        id: meeting.id,
        title: meeting.title || 'Untitled Meeting',
        start: new Date(meeting.startTime),
        end: new Date(meeting.endTime),
        description: meeting.description || '',
        location: meeting.location || '',
        attendees: meeting.attendees || [],
        type: meeting.type || 'general'
      }))
      
      setEvents(calendarEvents)
    } catch (err: any) {
      console.error('❌ Vendor: Error fetching meetings:', err)
      setError('Failed to load meetings')
      
      // Fallback to empty array if API fails
      setEvents([])
      
      addNotification({
        type: 'error',
        message: 'Failed to load meetings'
      })
    } finally {
      setLoading(false)
    }
  }, [addNotification])

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  // Handle creating a new meeting
  const handleCreateMeeting = async () => {
    try {
      if (!formData.title || !formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
        addNotification({
          type: 'error',
          message: 'Please fill in all required fields'
        })
        return
      }

      setLoading(true)
      
      const startDateTime = `${formData.startDate}T${formData.startTime}:00Z`
      const endDateTime = `${formData.endDate}T${formData.endTime}:00Z`
      
      const meetingData = {
        title: formData.title,
        description: formData.description,
        frequency: 'once',
        meetingDate: formData.startDate,
        startTime: startDateTime,
        endTime: endDateTime,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isRecurring: false,
        location: formData.location,
        attendees: formData.attendees ? formData.attendees.split(',').map(email => ({
          email: email.trim(),
          firstName: '',
          lastName: ''
        })) : [],
        meetingLink: formData.meetingLink || undefined
      }
      
      console.log('📤 Vendor: Creating meeting:', meetingData)
      
      const response = await meetingAPI.create(meetingData)
      console.log('✅ Vendor: Meeting created successfully:', response.data)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        attendees: '',
        meetingLink: ''
      })
      
      setShowAddModal(false)
      
      // Refresh meetings
      await fetchMeetings()
      
      addNotification({
        type: 'success',
        message: 'Meeting created successfully!'
      })
    } catch (err: any) {
      console.error('❌ Vendor: Error creating meeting:', err)
      addNotification({
        type: 'error',
        message: 'Failed to create meeting. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle updating a meeting
  const handleUpdateMeeting = async () => {
    if (!selectedEvent) return
    
    try {
      setLoading(true)
      
      const startDateTime = `${formData.startDate}T${formData.startTime}:00Z`
      const endDateTime = `${formData.endDate}T${formData.endTime}:00Z`
      
      const meetingData = {
        title: formData.title,
        description: formData.description,
        frequency: 'once',
        meetingDate: formData.startDate,
        startTime: startDateTime,
        endTime: endDateTime,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isRecurring: false,
        location: formData.location,
        attendees: formData.attendees ? formData.attendees.split(',').map(email => ({
          email: email.trim(),
          firstName: '',
          lastName: ''
        })) : [],
        meetingLink: formData.meetingLink || undefined
      }
      
      console.log('📤 Vendor: Updating meeting:', selectedEvent.id, meetingData)
      
      await meetingAPI.update(selectedEvent.id, meetingData)
      console.log('✅ Vendor: Meeting updated successfully')
      
      setShowEditModal(false)
      setSelectedEvent(null)
      
      // Refresh meetings
      await fetchMeetings()
      
      addNotification({
        type: 'success',
        message: 'Meeting updated successfully!'
      })
    } catch (err: any) {
      console.error('❌ Vendor: Error updating meeting:', err)
      addNotification({
        type: 'error',
        message: 'Failed to update meeting. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle deleting a meeting
  const handleDeleteMeeting = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return
    
    try {
      setLoading(true)
      console.log('🗑️ Vendor: Deleting meeting:', eventId)
      
      await meetingAPI.delete(eventId)
      console.log('✅ Vendor: Meeting deleted successfully')
      
      // Refresh meetings
      await fetchMeetings()
      
      setShowEditModal(false)
      setSelectedEvent(null)
      
      addNotification({
        type: 'success',
        message: 'Meeting deleted successfully!'
      })
    } catch (err: any) {
      console.error('❌ Vendor: Error deleting meeting:', err)
      addNotification({
        type: 'error',
        message: 'Failed to delete meeting. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle selecting an event
  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    
    // Populate form with event data
    const startDate = moment(event.start).format('YYYY-MM-DD')
    const startTime = moment(event.start).format('HH:mm')
    const endDate = moment(event.end).format('YYYY-MM-DD')
    const endTime = moment(event.end).format('HH:mm')
    
    setFormData({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      startDate,
      startTime,
      endDate,
      endTime,
      attendees: event.attendees?.join(', ') || '',
      meetingLink: ''
    })
    
    setShowEditModal(true)
  }

  // Handle selecting a time slot to create new event
  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    const startDate = moment(start).format('YYYY-MM-DD')
    const startTime = moment(start).format('HH:mm')
    const endDate = moment(end).format('YYYY-MM-DD')
    const endTime = moment(end).format('HH:mm')
    
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate,
      startTime,
      endDate,
      endTime,
      attendees: '',
      meetingLink: ''
    })
    
    setShowAddModal(true)
  }

  // Event style getter
  const eventStyleGetter = (event: CalendarEvent) => {
    const style = {
      backgroundColor: event.type === 'vendor' ? '#0B2E6F' : '#3b82f6',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    }
    return { style }
  }

  if (loading && events.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-asul">Schedule Meetings</h1>
            <p className="text-gray-600 mt-1">Manage your meetings and appointments</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-asul">Schedule Meetings</h1>
          <p className="text-gray-600 mt-1">Manage your meetings and appointments</p>
        </div>
        <button
          onClick={() => {
            setFormData({
              title: '',
              description: '',
              location: '',
              startDate: moment().format('YYYY-MM-DD'),
              startTime: moment().format('HH:mm'),
              endDate: moment().format('YYYY-MM-DD'),
              endTime: moment().add(1, 'hour').format('HH:mm'),
              attendees: '',
              meetingLink: ''
            })
            setShowAddModal(true)
          }}
          className="flex items-center gap-2 bg-[#0B2E6F] text-white px-4 py-2 rounded-lg hover:bg-[#0A285F] transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Meeting</span>
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div style={{ height: '700px' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            popup
            style={{ height: '100%' }}
          />
        </div>
      </div>

      {/* Add Meeting Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New Meeting</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                <input
                  type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter meeting title"
                    required
                  />
              </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter meeting description"
                  />
            </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                <input
                  type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter location or meeting link"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
              </div>
            </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
          </div>
        </div>

                {/* Attendees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attendees (comma-separated emails)
                  </label>
            <input
              type="text"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email1@example.com, email2@example.com"
            />
          </div>

                {/* Meeting Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://zoom.us/j/..."
                  />
        </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                      <button 
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                    Cancel
                      </button>
                      <button 
                    onClick={handleCreateMeeting}
                    disabled={loading}
                    className="px-4 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0A285F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                    <ButtonLoader loading={loading} loadingText="Creating...">
                      Create Meeting
                    </ButtonLoader>
                      </button>
                    </div>
              </div>
            </div>
                </div>
              </div>
      )}

      {/* Edit Meeting Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit Meeting</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedEvent(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
          </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter meeting title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter meeting description"
                  />
            </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter location or meeting link"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                                </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                                </div>
                              </div>

                {/* Attendees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attendees (comma-separated emails)
                  </label>
                  <input
                    type="text"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>

                {/* Meeting Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://zoom.us/j/..."
                  />
                      </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateMeeting}
                    disabled={loading}
                    className="px-4 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0A285F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ButtonLoader loading={loading} loadingText="Creating...">
                      Create Meeting
                    </ButtonLoader>
                  </button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Meeting Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Edit Meeting</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setSelectedEvent(null)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter meeting title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter meeting description"
                  />
        </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter location or meeting link"
                  />
          </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
          </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time *
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
        </div>
      </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time *
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Attendees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attendees (comma-separated emails)
                  </label>
                  <input
                    type="text"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email1@example.com, email2@example.com"
                  />
                </div>

                {/* Meeting Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meeting Link (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <button
                    onClick={() => handleDeleteMeeting(selectedEvent.id)}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    <span>
                      <ButtonLoader loading={loading} loadingText="Deleting...">
                        Delete Meeting
                      </ButtonLoader>
                    </span>
                  </button>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setShowEditModal(false)
                        setSelectedEvent(null)
                      }}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateMeeting}
                      disabled={loading}
                      className="px-4 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0A285F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ButtonLoader loading={loading} loadingText="Updating...">
                        Update Meeting
                      </ButtonLoader>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
