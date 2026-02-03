'use client'

import { useMemo, useState } from 'react'
import { Calendar, momentLocalizer, View, Event } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { FiPlus, FiX, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-hot-toast'
import ClientPageHeader from '@/components/client/ClientPageHeader'
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

const defaultForm = {
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

export default function ClientScheduleMeetingsPage() {
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
  const [formData, setFormData] = useState(defaultForm)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null)

  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      meetings.map(meeting => ({
        id: meeting.id,
        title: meeting.title || 'Untitled Meeting',
        start: meeting.startTime ? new Date(meeting.startTime) : new Date(meeting.startDate),
        end: meeting.endTime ? new Date(meeting.endTime) : new Date(meeting.endDate),
        description: meeting.description || '',
        location: meeting.location || '',
        attendees: meeting.attendees?.map(att => att.email),
      })),
    [meetings]
  )

  const resetForm = () => {
    setFormData(defaultForm)
    setSelectedMeetingId(null)
  }

  const buildPayload = () => {
    if (!formData.startDate || !formData.startTime || !formData.endDate || !formData.endTime) {
      throw new Error('Start and end date/time are required')
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

  const handleCreate = async () => {
    try {
      const payload = buildPayload()
      await createMeeting(payload)
      await Promise.all([fetchMeetingStats(), fetchUpcomingMeetings()])
      toast.success('Meeting scheduled')
      resetForm()
      setModalMode(null)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || 'Unable to create meeting')
    }
  }

  const handleUpdate = async () => {
    if (!selectedMeetingId) return
    try {
      const payload = buildPayload()
      await updateMeeting(selectedMeetingId, payload)
      await Promise.all([fetchMeetingStats(), fetchUpcomingMeetings()])
      toast.success('Meeting updated')
      resetForm()
      setModalMode(null)
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Unable to update meeting')
    }
  }

  const handleDelete = async () => {
    if (!selectedMeetingId || !confirm('Delete this meeting?')) return
    try {
      await deleteMeeting(selectedMeetingId)
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
      ...defaultForm,
      startDate: moment(start).format('YYYY-MM-DD'),
      startTime: moment(start).format('HH:mm'),
      endDate: moment(end).format('YYYY-MM-DD'),
      endTime: moment(end).format('HH:mm'),
    })
    setSelectedMeetingId(null)
    setModalMode('create')
  }

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedMeetingId(event.id)
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

  return (
    <div className="p-6 space-y-6">
      <ClientPageHeader
        title="Schedule Meetings"
        breadcrumbs={[{ label: 'Projects' }, { label: 'Schedule Meetings', isActive: true }]}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-gray-600">
          Coordinate walkthroughs, vendor calls, and planning reviews from a single dashboard.
        </p>
        <button
          onClick={() => {
            resetForm()
            const start = moment()
            const end = moment().add(1, 'hour')
            setFormData({
              ...defaultForm,
              startDate: start.format('YYYY-MM-DD'),
              startTime: start.format('HH:mm'),
              endDate: end.format('YYYY-MM-DD'),
              endTime: end.format('HH:mm'),
            })
            setModalMode('create')
          }}
          className="inline-flex items-center gap-2 bg-[#0B2E6F] text-white px-4 py-2 rounded-lg hover:bg-[#0a285f] transition"
        >
          <FiPlus className="w-4 h-4" />
          Book Meeting
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Next on your calendar</h3>
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
            events={calendarEvents}
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
          onSave={modalMode === 'create' ? handleCreate : handleUpdate}
          onDelete={modalMode === 'edit' ? handleDelete : undefined}
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
  formData: typeof defaultForm
  onChange: (data: typeof defaultForm) => void
  onClose: () => void
  onSave: () => Promise<void>
  onDelete?: () => void
}

function MeetingModal({ mode, loading, formData, onChange, onClose, onSave, onDelete }: MeetingModalProps) {
  const updateField = (field: keyof typeof defaultForm, value: string) =>
    onChange({ ...formData, [field]: value })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {mode === 'create' ? 'New Meeting' : 'Edit Meeting'}
            </h3>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition">
              <FiX className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4">
            <Input
              label="Meeting Title *"
              value={formData.title}
              onChange={event => updateField('title', event.target.value)}
              placeholder="Site visit with florist"
            />
            <TextArea
              label="Description"
              value={formData.description}
              onChange={event => updateField('description', event.target.value)}
              rows={3}
            />
            <Input
              label="Location / Link"
              value={formData.location}
              onChange={event => updateField('location', event.target.value)}
              placeholder="Zoom link or venue address"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                type="date"
                value={formData.startDate}
                onChange={event => updateField('startDate', event.target.value)}
              />
              <Input
                label="Start Time *"
                type="time"
                value={formData.startTime}
                onChange={event => updateField('startTime', event.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="End Date *"
                type="date"
                value={formData.endDate}
                onChange={event => updateField('endDate', event.target.value)}
              />
              <Input
                label="End Time *"
                type="time"
                value={formData.endTime}
                onChange={event => updateField('endTime', event.target.value)}
              />
            </div>

            <TextArea
              label="Attendees (comma separated emails)"
              value={formData.attendees}
              onChange={event => updateField('attendees', event.target.value)}
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

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
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

function TextArea({
  label,
  ...props
}: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
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

