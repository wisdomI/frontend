'use client'

import { useState, useEffect } from 'react'
import { FiChevronLeft, FiChevronRight, FiCalendar, FiSearch, FiPlus } from 'react-icons/fi'
import AddNewMeetingModal from '@/components/ui/modals/AddNewMeetingModal'
import { useMeetings } from '@/hooks/useMeetings'

interface Meeting {
  id: number
  title: string
  organizer: string
  startTime: string
  endTime: string
  date: string
  color: 'blue' | 'yellow'
}

export default function ScheduleMeetingsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [fromDate, setFromDate] = useState('12 Jul, 2025')
  const [toDate, setToDate] = useState('18 Jul, 2025')
  const [isAddMeetingModalOpen, setIsAddMeetingModalOpen] = useState(false)
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date('2024-07-19'))

  // API hooks
  const { meetings: meetingsData, loading: meetingsLoading, error: meetingsError, createMeeting } = useMeetings()

  // Transform API data to component format
  const transformMeeting = (meeting: any): Meeting => ({
    id: meeting.id,
    title: meeting.title,
    organizer: meeting.organizer?.firstName + ' ' + meeting.organizer?.lastName || 'Unknown',
    startTime: new Date(meeting.startTime).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    endTime: new Date(meeting.endTime).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    date: new Date(meeting.startTime).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    color: meeting.type === 'client' ? 'blue' : 'yellow'
  })

  const meetings: Meeting[] = meetingsData?.map(transformMeeting) || []

  const timeSlots = [
    '9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm'
  ]

  const dates = [
    '19th July, 2024',
    '20th July, 2024', 
    '21st July, 2025',
    '22nd July, 2025',
    '23rd July, 2025'
  ]

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const getWeekDates = (startDate: Date) => {
    const dates = []
    for (let i = 0; i < 5; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const getDateVisibilityClasses = (index: number) => {
    // 0: always visible, 1-2: show from sm, 3-4: show from lg
    if (index === 0) return 'block'
    if (index === 1 || index === 2) return 'hidden sm:block'
    return 'hidden lg:block'
  }

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentWeekStart(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentWeekStart(newDate)
  }

  const handleAddMeeting = () => {
    setIsAddMeetingModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsAddMeetingModalOpen(false)
  }

  const handleSaveMeeting = async (meetingData: any) => {
    try {
      await createMeeting(meetingData)
      console.log('New meeting saved:', meetingData)
      setIsAddMeetingModalOpen(false)
    } catch (error) {
      console.error('Error creating meeting:', error)
    }
  }

  const getMeetingPosition = (meeting: Meeting) => {
    const timeToPosition: { [key: string]: number } = {
      '9:00 am': 0,
      '10:00 am': 1,
      '11:00 am': 2,
      '12:00 pm': 3,
      '1:00 pm': 4,
      '2:00 pm': 5,
      '3:00 pm': 6
    }
    
    const startPos = timeToPosition[meeting.startTime] || 0
    const endPos = timeToPosition[meeting.endTime] || startPos + 1
    
    return {
      top: `${startPos * 60 + 20}px`,
      height: `${(endPos - startPos) * 60}px`
    }
  }

  const getMeetingColor = (color: string) => {
    return color === 'blue' ? 'bg-blue-200 border-blue-300' : 'bg-yellow-200 border-yellow-300'
  }

  const filteredMeetings = meetings.filter(meeting =>
    meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    meeting.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Header with Date Range Selector */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 sm:mb-6">
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">Schedule Meetings</h1>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600 font-medium">From:</span>
              <div className="relative">
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm w-32 sm:w-auto"
                  style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                />
                <FiCalendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-600 font-medium">To:</span>
              <div className="relative">
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm w-32 sm:w-auto"
                  style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                />
                <FiCalendar className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and New Meeting */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <FiSearch className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search here"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
            />
          </div>
          <button
            onClick={handleAddMeeting}
            className="px-3 sm:px-4 py-2 text-white rounded-lg font-medium flex items-center justify-center gap-1 sm:gap-2 transition-colors whitespace-nowrap text-sm"
            style={{ backgroundColor: '#032D71' }}
          >
            <FiPlus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">New Meeting</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Calendar Grid */}
        {meetingsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading meetings...</p>
          </div>
        ) : meetingsError ? (
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load meetings</p>
          </div>
        ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 border-b border-gray-200">
            <div className="w-16 sm:w-20 lg:w-24 p-2 sm:p-3 lg:p-4 border-r border-gray-200 bg-gray-50">
              <span className="text-xs sm:text-sm font-medium text-gray-500">Time</span>
            </div>
            {getWeekDates(currentWeekStart).map((date, index) => (
              <div key={index} className={`p-2 sm:p-3 lg:p-4 border-r border-gray-200 last:border-r-0 ${getDateVisibilityClasses(index)}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">
                    <span className="hidden sm:inline">{date.getDate()}th {date.toLocaleDateString('en-US', { month: 'long' })}, {date.getFullYear()}</span>
                    <span className="sm:hidden">{date.getDate()}/{date.getMonth() + 1}</span>
                  </span>
                  {index === 0 && (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={handlePreviousWeek}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <FiChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                      <button 
                        onClick={handleNextWeek}
                        className="text-gray-400 hover:text-gray-600 p-1"
                      >
                        <FiChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="relative">
            {/* Time Slots */}
            <div className="absolute left-0 top-0 w-16 sm:w-20 lg:w-24 z-10">
              {timeSlots.map((time, index) => (
                <div key={index} className="h-12 sm:h-14 lg:h-16 p-2 sm:p-3 lg:p-4 border-b border-gray-200 bg-gray-50 flex items-center">
                  <span className="text-xs sm:text-sm text-gray-600">{time}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="ml-16 sm:ml-20 lg:ml-24">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5">
                {dates.map((date, dateIndex) => (
                  <div key={dateIndex} className={`border-r border-gray-200 last:border-r-0 ${getDateVisibilityClasses(dateIndex)}`}>
                    {timeSlots.map((time, timeIndex) => (
                      <div key={timeIndex} className="h-12 sm:h-14 lg:h-16 border-b border-gray-200 relative">
                        {/* Meeting Blocks */}
                        {filteredMeetings
                          .filter(meeting => meeting.date === date)
                          .map((meeting, meetingIndex) => {
                            const position = getMeetingPosition(meeting)
                            const isOverlapping = meetingIndex > 0
                            
                            return (
                              <div
                                key={meeting.id}
                                className={`absolute left-1 right-1 rounded border p-1 sm:p-2 text-xs ${getMeetingColor(meeting.color)} ${
                                  isOverlapping ? 'ml-2 sm:ml-4' : ''
                                }`}
                                style={{
                                  top: position.top,
                                  height: position.height,
                                  zIndex: meetingIndex + 1
                                }}
                              >
                                <div className="font-medium text-gray-900 truncate text-xs">
                                  {meeting.title}
                                </div>
                                <div className="text-gray-600 truncate text-xs hidden sm:block">
                                  {meeting.organizer}
                                </div>
                                <div className="text-gray-500 text-xs hidden lg:block">
                                  {meeting.startTime} - {meeting.endTime}
                                </div>
                              </div>
                            )
                          })}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}

        {/* Legend */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-200 border border-blue-300 rounded"></div>
            <span className="text-xs sm:text-sm text-gray-600">Client Meetings</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-200 border border-yellow-300 rounded"></div>
            <span className="text-xs sm:text-sm text-gray-600">Internal Meetings</span>
          </div>
        </div>
      </div>

      {/* Add New Meeting Modal */}
      <AddNewMeetingModal
        isOpen={isAddMeetingModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveMeeting}
      />
    </div>
  )
}


