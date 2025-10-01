'use client'

import React, { useState, useEffect } from 'react'
import { meetingAPI } from '@/lib/api'
import { useAuthContext } from '@/contexts/AuthContext'
import { Meeting } from '@/types/api'
import { FiPlus, FiEdit, FiTrash2, FiCalendar, FiClock, FiMapPin, FiVideo, FiPhone, FiUsers, FiLink } from 'react-icons/fi'

interface MeetingManagerProps {
  viewType?: 'all' | 'my' | 'attendances' | 'upcoming'
}

export default function MeetingManager({ viewType = 'all' }: MeetingManagerProps) {
  const { user } = useAuthContext()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null)
  const [stats, setStats] = useState<any>(null)

  // Fetch meetings based on view type
  const fetchMeetings = async () => {
    try {
      setLoading(true)
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

  // Fetch meeting stats
  const fetchStats = async () => {
    try {
      const response = await meetingAPI.getStats()
      setStats(response.data.data)
    } catch (err) {
      console.error('Error fetching meeting stats:', err)
    }
  }

  useEffect(() => {
    fetchMeetings()
    fetchStats()
  }, [viewType])

  // Delete meeting
  const handleDelete = async (meetingId: string) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return
    
    try {
      await meetingAPI.delete(meetingId)
      setMeetings(meetings.filter(m => m.id !== meetingId))
    } catch (err) {
      setError('Failed to delete meeting')
      console.error('Error deleting meeting:', err)
    }
  }

  // Toggle meeting status
  const handleToggleStatus = async (meetingId: string) => {
    try {
      await meetingAPI.toggleStatus(meetingId)
      await fetchMeetings() // Refresh the list
    } catch (err) {
      setError('Failed to update meeting status')
      console.error('Error updating meeting:', err)
    }
  }

  // Respond to meeting invitation
  const handleRespondToMeeting = async (meetingId: string, attendeeId: string, response: string) => {
    try {
      await meetingAPI.respond(meetingId, attendeeId, { response })
      await fetchMeetings() // Refresh the list
    } catch (err) {
      setError('Failed to respond to meeting')
      console.error('Error responding to meeting:', err)
    }
  }

  // Check for conflicts
  const checkConflicts = async (meetingData: any) => {
    try {
      const response = await meetingAPI.checkConflicts(meetingData)
      return response.data.data
    } catch (err) {
      console.error('Error checking conflicts:', err)
      return { hasConflicts: false, conflicts: [] }
    }
  }

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <FiVideo className="w-4 h-4" />
      case 'phone':
        return <FiPhone className="w-4 h-4" />
      case 'in-person':
        return <FiMapPin className="w-4 h-4" />
      default:
        return <FiCalendar className="w-4 h-4" />
    }
  }

  const formatMeetingTime = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchMeetings}
          className="mt-2 text-red-600 hover:text-red-700 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {viewType === 'my' ? 'My Meetings' :
             viewType === 'attendances' ? 'Meeting Attendances' :
             viewType === 'upcoming' ? 'Upcoming Meetings' :
             'All Meetings'}
          </h2>
          {stats && (
            <p className="text-gray-600 mt-1">
              {stats.totalMeetings} total meetings
            </p>
          )}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          <span>Schedule Meeting</span>
        </button>
      </div>

      {/* Meetings List */}
      {meetings.length === 0 ? (
        <div className="text-center py-12">
          <FiCalendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings found</h3>
          <p className="text-gray-500">
            {viewType === 'my' ? 'Schedule your first meeting to get started' :
             viewType === 'attendances' ? 'You haven\'t been invited to any meetings yet' :
             viewType === 'upcoming' ? 'No upcoming meetings scheduled' :
             'No meetings have been scheduled yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {meeting.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      meeting.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                      meeting.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      meeting.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      meeting.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {meeting.status}
                    </span>
                    {meeting.isRecurring && (
                      <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Recurring
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setEditingMeeting(meeting)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(meeting.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Meeting Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FiCalendar className="w-4 h-4 mr-2" />
                  <span>{new Date(meeting.meetingDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <FiClock className="w-4 h-4 mr-2" />
                  <span>{formatMeetingTime(meeting.startTime, meeting.endTime)}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <div className="w-4 h-4 mr-2">
                    {getMeetingTypeIcon(meeting.meetingType)}
                  </div>
                  <span className="capitalize">{meeting.meetingType}</span>
                  {meeting.meetingType === 'video' && meeting.meetingLink && (
                    <a 
                      href={meeting.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-700"
                    >
                      <FiLink className="w-3 h-3" />
                    </a>
                  )}
                  {meeting.meetingType === 'in-person' && meeting.location && (
                    <span className="ml-2">{meeting.location}</span>
                  )}
                </div>
                
                {meeting.attendees && meeting.attendees.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FiUsers className="w-4 h-4 mr-2" />
                    <span>{meeting.attendees.length} attendees</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {meeting.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {meeting.description}
                  </p>
                </div>
              )}

              {/* Attendees List */}
              {meeting.attendees && meeting.attendees.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Attendees:</h4>
                  <div className="flex flex-wrap gap-1">
                    {meeting.attendees.slice(0, 3).map((attendee, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {attendee}
                      </span>
                    ))}
                    {meeting.attendees.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{meeting.attendees.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleStatus(meeting.id)}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Toggle Status
                  </button>
                </div>
                
                {/* Meeting Response (for attendees) */}
                {meeting.attendees?.includes(user?.email || '') && meeting.status === 'scheduled' && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">Response:</span>
                    <select
                      onChange={(e) => handleRespondToMeeting(meeting.id, user?.id || '', e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="">Respond</option>
                      <option value="accepted">Accept</option>
                      <option value="declined">Decline</option>
                      <option value="tentative">Tentative</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Meeting Modal */}
      {(showCreateModal || editingMeeting) && (
        <CreateEditMeetingModal
          meeting={editingMeeting}
          onClose={() => {
            setShowCreateModal(false)
            setEditingMeeting(null)
          }}
          onSuccess={() => {
            setShowCreateModal(false)
            setEditingMeeting(null)
            fetchMeetings()
          }}
          onCheckConflicts={checkConflicts}
        />
      )}
    </div>
  )
}

// Create/Edit Meeting Modal Component
interface CreateEditMeetingModalProps {
  meeting?: Meeting | null
  onClose: () => void
  onSuccess: () => void
  onCheckConflicts: (data: any) => Promise<any>
}

function CreateEditMeetingModal({ meeting, onClose, onSuccess, onCheckConflicts }: CreateEditMeetingModalProps) {
  const [formData, setFormData] = useState({
    title: meeting?.title || '',
    description: meeting?.description || '',
    meetingDate: meeting?.meetingDate || '',
    startTime: meeting?.startTime || '',
    endTime: meeting?.endTime || '',
    attendees: meeting?.attendees?.join(', ') || '',
    meetingType: meeting?.meetingType || 'video',
    location: meeting?.location || '',
    meetingLink: meeting?.meetingLink || '',
    isRecurring: meeting?.isRecurring?.toString() || 'false',
    recurrencePattern: meeting?.recurrencePattern || 'weekly',
    recurrenceEndDate: meeting?.recurrenceEndDate || ''
  })
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conflicts, setConflicts] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Check for conflicts first
      const conflictData = {
        meetingDate: formData.meetingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        attendees: formData.attendees.split(',').map(email => email.trim()).filter(Boolean)
      }
      
      const conflictResult = await onCheckConflicts(conflictData)
      if (conflictResult.hasConflicts) {
        setConflicts(conflictResult)
        setLoading(false)
        return
      }

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('meetingDate', formData.meetingDate)
      formDataToSend.append('startTime', formData.startTime)
      formDataToSend.append('endTime', formData.endTime)
      formDataToSend.append('attendees', formData.attendees)
      formDataToSend.append('meetingType', formData.meetingType)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('meetingLink', formData.meetingLink)
      formDataToSend.append('isRecurring', formData.isRecurring)
      formDataToSend.append('recurrencePattern', formData.recurrencePattern)
      formDataToSend.append('recurrenceEndDate', formData.recurrenceEndDate)

      // Add attachment file
      if (attachmentFile) {
        formDataToSend.append('attachment', attachmentFile)
      }

      if (meeting) {
        await meetingAPI.update(meeting.id, formDataToSend)
      } else {
        await meetingAPI.create(formDataToSend)
      }

      onSuccess()
    } catch (err) {
      setError('Failed to save meeting')
      console.error('Error saving meeting:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB')
      return
    }
    setAttachmentFile(file || null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {meeting ? 'Edit Meeting' : 'Schedule Meeting'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.meetingDate}
                  onChange={(e) => setFormData({...formData, meetingDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Meeting Type and Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Type *
              </label>
              <select
                value={formData.meetingType}
                onChange={(e) => setFormData({...formData, meetingType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="video">Video Call</option>
                <option value="phone">Phone Call</option>
                <option value="in-person">In-Person</option>
              </select>
            </div>

            {/* Location or Meeting Link */}
            {formData.meetingType === 'in-person' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            ) : formData.meetingType === 'video' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                  placeholder="https://meet.google.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ) : null}

            {/* Attendees */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attendees *
              </label>
              <input
                type="text"
                value={formData.attendees}
                onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                placeholder="Enter email addresses separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Recurring Options */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring === 'true'}
                  onChange={(e) => setFormData({...formData, isRecurring: e.target.checked.toString()})}
                  className="mr-2"
                />
                <label htmlFor="isRecurring" className="text-sm text-gray-700">
                  Recurring Meeting
                </label>
              </div>
              
              {formData.isRecurring === 'true' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recurrence Pattern
                    </label>
                    <select
                      value={formData.recurrencePattern}
                      onChange={(e) => setFormData({...formData, recurrencePattern: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.recurrenceEndDate}
                      onChange={(e) => setFormData({...formData, recurrenceEndDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Attachment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachment (Optional)
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB</p>
            </div>

            {/* Conflicts Warning */}
            {conflicts && conflicts.hasConflicts && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="text-sm font-medium text-yellow-800 mb-2">Schedule Conflicts Detected</h4>
                <p className="text-sm text-yellow-700 mb-2">
                  The following meetings conflict with this time:
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {conflicts.conflicts.map((conflict: any, index: number) => (
                    <li key={index}>• {conflict.title} on {new Date(conflict.meetingDate).toLocaleDateString()}</li>
                  ))}
                </ul>
                <div className="flex space-x-2 mt-3">
                  <button
                    type="button"
                    onClick={() => setConflicts(null)}
                    className="px-3 py-1 text-xs bg-yellow-200 text-yellow-800 rounded hover:bg-yellow-300"
                  >
                    Schedule Anyway
                  </button>
                  <button
                    type="button"
                    onClick={() => setConflicts(null)}
                    className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : (meeting ? 'Update' : 'Schedule')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
