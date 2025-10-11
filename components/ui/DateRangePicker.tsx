'use client'

import React, { useState, useCallback } from 'react'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-custom.css'
import { FiCalendar, FiX } from 'react-icons/fi'

// Import moment dynamically to avoid type issues
const moment = require('moment')
const localizer = momentLocalizer(moment)

interface DateRange {
  start: Date
  end: Date
}

interface DateRangePickerProps {
  onSelect: (dateRange: DateRange) => void
  selectedRange?: DateRange | null
  placeholder?: string
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onSelect,
  selectedRange,
  placeholder = 'Select date range'
}) => {
  const [showPicker, setShowPicker] = useState(false)
  const [tempStart, setTempStart] = useState<Date | null>(null)
  const [tempEnd, setTempEnd] = useState<Date | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  const handleSelectSlot = useCallback((slotInfo: { start: Date | string; end: Date | string }) => {
    const start = new Date(slotInfo.start)
    const end = new Date(slotInfo.end)
    
    if (!tempStart) {
      setTempStart(start)
      setTempEnd(null)
    } else if (!tempEnd) {
      // If second click is before first, swap them
      if (start < tempStart) {
        setTempStart(start)
        setTempEnd(tempStart)
      } else {
        setTempEnd(start)
      }
    } else {
      // Start new selection
      setTempStart(start)
      setTempEnd(null)
    }
  }, [tempStart, tempEnd])

  const handlePreviousMonth = () => {
    setCurrentDate(prev => moment(prev).subtract(1, 'month').toDate())
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => moment(prev).add(1, 'month').toDate())
  }

  const handlePreviousYear = () => {
    setCurrentDate(prev => moment(prev).subtract(1, 'year').toDate())
  }

  const handleNextYear = () => {
    setCurrentDate(prev => moment(prev).add(1, 'year').toDate())
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const handleApply = () => {
    if (tempStart && tempEnd) {
      onSelect({ start: tempStart, end: tempEnd })
      setShowPicker(false)
      setTempStart(null)
      setTempEnd(null)
    }
  }

  const handleCancel = () => {
    setShowPicker(false)
    setTempStart(null)
    setTempEnd(null)
  }

  const formatDateRange = (range: DateRange) => {
    return `${moment(range.start).format('MMM DD, YYYY')} - ${moment(range.end).format('MMM DD, YYYY')}`
  }

  // Create highlight events for selected dates
  const highlightEvents = []
  if (tempStart && tempEnd) {
    highlightEvents.push({
      id: 'temp-range',
      title: 'Selected Range',
      start: tempStart,
      end: tempEnd,
      allDay: true
    })
  } else if (tempStart) {
    highlightEvents.push({
      id: 'temp-start',
      title: 'Start Date',
      start: tempStart,
      end: tempStart,
      allDay: true
    })
  }

  const eventPropGetter = () => {
    return {
      style: {
        backgroundColor: '#0B2E6F',
        borderRadius: '0px',
        opacity: 0.7,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    }
  }

  return (
    <div className="relative">
      {/* Input Field */}
      <div 
        onClick={() => setShowPicker(!showPicker)}
        className="relative cursor-pointer"
      >
        <input
          type="text"
          value={selectedRange ? formatDateRange(selectedRange) : ''}
          placeholder={placeholder}
          readOnly
          className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        />
        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        {selectedRange && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect({ start: new Date(), end: new Date() })
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
              <h4 className="text-sm font-medium text-gray-700">Select Date Range</h4>
              <button
                onClick={handleToday}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Today
              </button>
            </div>
            <p className="text-xs text-gray-500">
              {!tempStart && 'Click on a date to select start date'}
              {tempStart && !tempEnd && 'Click on another date to select end date'}
              {tempStart && tempEnd && `Selected: ${moment(tempStart).format('MMM DD, YYYY')} - ${moment(tempEnd).format('MMM DD, YYYY')}`}
            </p>
          </div>

          {/* Enhanced Navigation Controls */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
            {/* Year Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousYear}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Previous Year"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handlePreviousMonth}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Previous Month"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            {/* Current Month/Year Display */}
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">
                {moment(currentDate).format('MMMM YYYY')}
              </div>
            </div>

            {/* Forward Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Next Month"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                onClick={handleNextYear}
                className="p-2 hover:bg-gray-100 rounded transition-colors"
                title="Next Year"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            <button
              onClick={() => {
                const today = new Date()
                setTempStart(today)
                setTempEnd(moment(today).add(7, 'days').toDate())
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Next 7 days
            </button>
            <button
              onClick={() => {
                const today = new Date()
                setTempStart(today)
                setTempEnd(moment(today).add(1, 'month').toDate())
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Next month
            </button>
            <button
              onClick={() => {
                const today = new Date()
                setTempStart(today)
                setTempEnd(moment(today).add(3, 'months').toDate())
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Next 3 months
            </button>
            <button
              onClick={() => {
                const today = new Date()
                setTempStart(today)
                setTempEnd(moment(today).add(6, 'months').toDate())
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Next 6 months
            </button>
            <button
              onClick={() => {
                const today = new Date()
                setTempStart(today)
                setTempEnd(moment(today).add(1, 'year').toDate())
              }}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Next year
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
            />
          </div>

          <div className="flex justify-between items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setTempStart(null)
                setTempEnd(null)
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
                disabled={!tempStart || !tempEnd}
                className="px-4 py-2 bg-[#0B2E6F] text-white rounded-lg hover:bg-[#0A285F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker

