'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calendar, momentLocalizer, View, Event } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import { useMeetings } from '@/hooks/useMeetings'
import { ButtonLoader } from '@/components/ui/Loader'

const localizer = momentLocalizer(moment)

interface CalendarEvent extends Event {
  id: string
  title: string
  start: Date
  end: Date
  description?: string
  location?: string
  attendees?: string[]
}

const defaultFormData = {
  title: '',
  description: '',
  location: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  attendees: '',
  meetingLink: '',
}

export default function VendorScheduleMeetingsPage() {
  const {
    meetings,
    meetingStats,
    upcomingMeetings,
    loading,
    createMeeting,
    updateMeeting,
    deleteMeeting,
    fetchMeetingStats,
    fetchUpcomingMeetings,
  } = useMeetings()

  const [view, setView] = useState<View>('month')
  const [date, setDate] = useState(new Date())
  const [formData, setFormData] = useState(defaultFormData)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  const events: CalendarEvent[] = useMemo(() => {
    return meetings.map(meeting => ({
      id: meeting.id,
      title: meeting.title || 'Untitled Meeting',
      start: meeting.startTime ? new Date(meeting.startTime) : new Date(meeting.startDate),
      end: meeting.endTime ? new Date(meeting.endTime) : new Date(meeting.endDate),
      description: meeting.description || '',
      location: meeting.location || '',
      attendees: meeting.attendees?.map(att => att.email) || [],
    }))
  }, [meetings])

  const resetForm = () => {
    setFormData(defaultFormData)
    setSelectedEventId(null)
  }

  const buildPayload = () => {
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      throw new Error('Please select start and end date/time')
    }

    return {
      title: formData.title,
      description: formData.description,
      frequency: 'once',
      meetingDate: `${formData.startDate}T${formData.startTime}:00.000Z`,
      startTime: `${formData.startDate}T${formData.startTime}:00.000Z`,
      endTime: `${formData.endDate}T${formData.endTime}:00.000Z`,
      startDate: `${formData.startDate}T${formData.startTime}:00.000Z`,
      endDate: `${formData.endDate}T${formData.endTime}:00.000Z`,
      isRecurring: false,
      location: formData.location,
      meetingLink: formData.meetingLink || undefined,
      attendees: formData.attendees
        ? formData.attendees.split(',').map(email => ({
            email: email.trim(),
            firstName: '',
            lastName: '',
          }))
        : [],
    }
  }

  const handleCreateMeeting = async () => {
    try {
      const payload = buildPayload()
      await createMeeting(payload)
      await Promise.all([fetchMeetingStats(), fetchUpcomingMeetings()])
      toast.success('Meeting created')
      resetForm()
      setModalMode(null)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Unable to create meeting')
    }
  }

  const handleUpdateMeeting = async () => {
    if (!selectedEventId) return
    try {
      const payload = buildPayload()
      await updateMeeting(selectedEventId, payload)
      await Promise.all([fetchMeetingStats(), fetchUpcomingMeetings()])
      toast.success('Meeting updated')
      resetForm()
      setModalMode(null)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to update meeting')
    }
  }

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm('Delete this meeting?')) return
    try {
      await deleteMeeting(meetingId)
      await Promise.all([fetchMeetingStats(), fetchUpcomingMeetings()])
      toast.success('Meeting deleted')
      resetForm()
      setModalMode(null)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to delete meeting')
    }
  }

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: moment(start).format('YYYY-MM-DD'),
      startTime: moment(start).format('HH:mm'),
      endDate: moment(end).format('YYYY-MM-DD'),
      endTime: moment(end).format('HH:mm'),
      attendees: '',
      meetingLink: '',
    })
    setSelectedEventId(null)
    setModalMode('create')
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEventId(event.id)
    setFormData({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      startDate: moment(event.start).format('YYYY-MM-DD'),
      startTime: moment(event.start).format('HH:mm'),
      endDate: moment(event.end).format('YYYY-MM-DD'),
      endTime: moment(event.end).format('HH:mm'),
      attendees: event.attendees?.join(', ') || '',
      meetingLink: '',
    })
    setModalMode('edit')
  }

  useEffect(() => {
    fetchMeetingStats()
    fetchUpcomingMeetings()
  }, [fetchMeetingStats, fetchUpcomingMeetings])

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-asul">Schedule Meetings</h1>
          <p className="text-gray-600">Manage discovery calls, onsite visits, and planning sessions.</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setModalMode('create')
            const now = moment()
            setFormData(prev => ({
              ...prev,
              startDate: now.format('YYYY-MM-DD'),
              startTime: now.format('HH:mm'),
              endDate: now.format('YYYY-MM-DD'),
              endTime: now.add(1, 'hour').format('HH:mm'),
            }))
          }}
          className="inline-flex items-center gap-2 bg-[#0B2E6F] text-white px-4 py-2 rounded-lg hover:bg-[#0a285f] transition"
        >
          <FiPlus className="w-4 h-4" />
          New Meeting
        </button>
      </div>

      {meetingStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard label="Total Meetings" value={meetingStats.totalMeetings} />
          <StatsCard label="Upcoming" value={meetingStats.upcomingMeetings} />
          <StatsCard label="Completed" value={meetingStats.completedMeetings} />
        </div>
      )}

      {upcomingMeetings.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Meetings</h3>
          <div className="space-y-2">
            {upcomingMeetings.slice(0, 4).map(meeting => (
              <div key={meeting.id} className="flex items-center justify-between text-sm text-gray-700">
                <div>
                  <p className="font-medium">{meeting.title}</p>
                  <p className="text-xs text-gray-500">
                    {moment(meeting.startTime || meeting.startDate).format('ddd, MMM D • h:mma')}
                  </p>
                </div>
                <button
                  className="text-blue-600 text-xs font-medium hover:underline"
                  onClick={() =>
                    handleSelectEvent({
                      id: meeting.id,
                      title: meeting.title,
                      start: new Date(meeting.startTime || meeting.startDate),
                      end: new Date(meeting.endTime || meeting.endDate),
                      description: meeting.description,
                      location: meeting.location,
                      attendees: meeting.attendees?.map(att => att.email),
                    })
                  }
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div style={{ height: 700 }}>
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
            popup
            style={{ height: '100%' }}
          />
        </div>
      </div>

      {modalMode && (
        <MeetingModal
          mode={modalMode}
          loading={loading}
          formData={formData}
          onChange={setFormData}
          onClose={() => {
            resetForm()
            setModalMode(null)
          }}
          onSave={modalMode === 'create' ? handleCreateMeeting : handleUpdateMeeting}
          onDelete={modalMode === 'edit' && selectedEventId ? () => handleDeleteMeeting(selectedEventId) : undefined}
        />
      )}
    </div>
  )
}

function StatsCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value.toLocaleString()}</p>
    </div>
  )
}

interface MeetingModalProps {
  mode: 'create' | 'edit'
  loading: boolean
  formData: typeof defaultFormData
  onChange: (data: typeof defaultFormData) => void
  onClose: () => void
  onSave: () => Promise<void>
  onDelete?: () => Promise<void> | void
}

function MeetingModal({ mode, loading, formData, onChange, onClose, onSave, onDelete }: MeetingModalProps) {
  const setField = (field: keyof typeof defaultFormData, value: string) =>
    onChange({ ...formData, [field]: value })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'Schedule Meeting' : 'Update Meeting'}
            </h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            <Input
              label="Title *"
              value={formData.title}
              onChange={event => setField('title', event.target.value)}
              placeholder="Project planning call"
            />
            <TextArea
              label="Description"
              value={formData.description}
              onChange={event => setField('description', event.target.value)}
              rows={3}
            />
            <Input
              label="Location / Meeting Link"
              value={formData.location}
              onChange={event => setField('location', event.target.value)}
              placeholder="Zoom or venue address"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                type="date"
                value={formData.startDate}
                onChange={event => setField('startDate', event.target.value)}
              />
              <Input
                label="Start Time *"
                type="time"
                value={formData.startTime}
                onChange={event => setField('startTime', event.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="End Date *"
                type="date"
                value={formData.endDate}
                onChange={event => setField('endDate', event.target.value)}
              />
              <Input
                label="End Time *"
                type="time"
                value={formData.endTime}
                onChange={event => setField('endTime', event.target.value)}
              />
            </div>

            <TextArea
              label="Attendees (comma separated emails)"
              value={formData.attendees}
              onChange={event => setField('attendees', event.target.value)}
              rows={2}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            {mode === 'edit' && onDelete ? (
              <button
                onClick={onDelete}
                className="inline-flex items-center gap-2 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-3">
              <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                Cancel
              </button>
              <button
                onClick={onSave}
                disabled={loading}
                className="px-4 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0a285f] disabled:opacity-50"
              >
                <ButtonLoader loading={loading} loadingText="Saving...">
                  {mode === 'create' ? 'Create Meeting' : 'Save Changes'}
                </ButtonLoader>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

function Input({ label, ...props }: InputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
}

function TextArea({ label, ...props }: TextAreaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea
        {...props}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

