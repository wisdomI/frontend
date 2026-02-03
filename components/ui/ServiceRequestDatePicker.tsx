'use client'

import React, { useState, useCallback } from 'react'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-custom.css'
import { FiCalendar, FiX } from 'react-icons/fi'

// Import moment dynamically to avoid type issues
const moment = require('moment')
const localizer = momentLocalizer(moment)

interface ServiceRequestDatePickerProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  label: string
  required?: boolean
}

const ServiceRequestDatePicker: React.FC<ServiceRequestDatePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label,
  required = false
}) => {
  const [showPicker, setShowPicker] = useState(false)
  const [selectedRange, setSelectedRange] = useState<{ start: Date | null; end: Date | null }>({
    start: startDate ? new Date(startDate) : null,
    end: endDate ? new Date(endDate) : null
  })
  const [currentDate, setCurrentDate] = useState(new Date())

  // Update selected range when props change
  React.useEffect(() => {
    setSelectedRange({
      start: startDate ? new Date(startDate) : null,
      end: endDate ? new Date(endDate) : null
    })
  }, [startDate, endDate])

  const handleSelectSlot = useCallback((slotInfo: { start: Date | string; end: Date | string }) => {
    const selectedDate = new Date(slotInfo.start)

    let nextStart = selectedRange.start
    let nextEnd = selectedRange.end

    if (!selectedRange.start) {
      nextStart = selectedDate
      nextEnd = selectedRange.end
      setSelectedRange(prev => ({ ...prev, start: selectedDate }))
    } else if (!selectedRange.end) {
      if (selectedDate < selectedRange.start) {
        nextStart = selectedDate
        nextEnd = selectedRange.start
        setSelectedRange({ start: selectedDate, end: selectedRange.start })
      } else {
        nextStart = selectedRange.start
        nextEnd = selectedDate
        setSelectedRange(prev => ({ ...prev, end: selectedDate }))
      }
    } else {
      // restart selection from this date
      nextStart = selectedDate
      nextEnd = null
      setSelectedRange({ start: selectedDate, end: null })
    }

    // Auto-apply when both dates are chosen
    if (nextStart && nextEnd) {
      const startFormatted = moment(nextStart).format('YYYY-MM-DDTHH:mm')
      const endFormatted = moment(nextEnd).format('YYYY-MM-DDTHH:mm')
      onStartDateChange(startFormatted)
      onEndDateChange(endFormatted)
      setShowPicker(false)
    }
  }, [selectedRange, onStartDateChange, onEndDateChange])

  const handleApply = () => {
    if (selectedRange.start && selectedRange.end) {
      // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
      const startFormatted = moment(selectedRange.start).format('YYYY-MM-DDTHH:mm')
      const endFormatted = moment(selectedRange.end).format('YYYY-MM-DDTHH:mm')
      
      onStartDateChange(startFormatted)
      onEndDateChange(endFormatted)
      setShowPicker(false)
    }
  }

  const handleCancel = () => {
    setShowPicker(false)
    // Reset to original values
    setSelectedRange({
      start: startDate ? new Date(startDate) : null,
      end: endDate ? new Date(endDate) : null
    })
  }

  const handleClear = () => {
    onStartDateChange('')
    onEndDateChange('')
    setSelectedRange({ start: null, end: null })
  }

  const formatDisplayDate = (date: string) => {
    if (!date) return ''
    return moment(date).format('MMM DD, YYYY HH:mm')
  }

  const formatDisplayRange = () => {
    if (!startDate && !endDate) return ''
    if (startDate && endDate) {
      return `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`
    }
    if (startDate) return `From: ${formatDisplayDate(startDate)}`
    if (endDate) return `To: ${formatDisplayDate(endDate)}`
    return ''
  }

  // Create highlight events for selected dates
  const highlightEvents = []
  if (selectedRange.start) {
    highlightEvents.push({
      id: 'selected-start',
      title: 'Start Date',
      start: selectedRange.start,
      end: selectedRange.start,
      allDay: false
    })
  }
  if (selectedRange.end) {
    highlightEvents.push({
      id: 'selected-end',
      title: 'End Date',
      start: selectedRange.end,
      end: selectedRange.end,
      allDay: false
    })
  }

  const eventPropGetter = (event: any) => {
    const isStart = event.id === 'selected-start'
    return {
      style: {
        backgroundColor: isStart ? '#0B2E6F' : '#059669',
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: 'none',
        fontSize: '12px',
        padding: '2px 4px',
      },
    }
  }

  const handlePreviousMonth = () => {
    setCurrentDate(prev => moment(prev).subtract(1, 'month').toDate())
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => moment(prev).add(1, 'month').toDate())
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {/* Input Field */}
      <div 
        onClick={() => setShowPicker(!showPicker)}
        className="relative cursor-pointer"
      >
        <input
          type="text"
          value={formatDisplayRange()}
          placeholder="Select event start and end dates"
          readOnly
          className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent cursor-pointer"
        />
        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        {(startDate || endDate) && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Calendar Picker Dropdown */}
      {showPicker && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[700px] max-w-[90vw]">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Select Event Dates</h4>
              <button
                onClick={handleToday}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-[#0B2E6F] rounded"></div>
                <span>Start Date</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-[#059669] rounded"></div>
                <span>End Date</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {!selectedRange.start ? 'Click on a date to select start date' : 
               !selectedRange.end ? 'Click on a date to select end date' : 
               'Click on a date to start new selection'}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Previous Month"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {moment(currentDate).format('MMMM YYYY')}
              </div>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Next Month"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            <button
              onClick={() => {
                const today = new Date()
                setSelectedRange({
                  start: today,
                  end: moment(today).add(2, 'hours').toDate()
                })
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              2 hours
            </button>
            <button
              onClick={() => {
                const today = new Date()
                setSelectedRange({
                  start: today,
                  end: moment(today).add(4, 'hours').toDate()
                })
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              4 hours
            </button>
            <button
              onClick={() => {
                const today = new Date()
                setSelectedRange({
                  start: today,
                  end: moment(today).add(1, 'day').toDate()
                })
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              All day
            </button>
            <button
              onClick={() => {
                const today = new Date()
                setSelectedRange({
                  start: today,
                  end: moment(today).add(3, 'days').toDate()
                })
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              3 days
            </button>
            <button
              onClick={() => {
                const today = new Date()
                setSelectedRange({
                  start: today,
                  end: moment(today).add(1, 'week').toDate()
                })
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              1 week
            </button>
          </div>

          <div style={{ height: 400 }}>
            <BigCalendar
              localizer={localizer}
              events={highlightEvents}
              startAccessor="start"
              endAccessor="end"
              onSelectSlot={handleSelectSlot}
              selectable
              view="month"
              views={['month']}
              date={currentDate}
              onNavigate={(date) => setCurrentDate(date)}
              toolbar={false}
              popup={false}
              eventPropGetter={eventPropGetter}
              step={30} // 30-minute intervals
              timeslots={2} // Show 2 time slots per hour
            />
          </div>

          <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setSelectedRange({ start: null, end: null })
              }}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Selection
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!selectedRange.start || !selectedRange.end}
                className="px-4 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0A285F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Dates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceRequestDatePicker
