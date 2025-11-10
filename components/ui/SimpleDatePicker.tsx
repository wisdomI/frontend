'use client'

import React, { useState } from 'react'
import { FiCalendar, FiX, FiClock } from 'react-icons/fi'

interface SimpleDatePickerProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  label: string
  required?: boolean
}

const SimpleDatePicker: React.FC<SimpleDatePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label,
  required = false
}) => {
  const [showPicker, setShowPicker] = useState(false)

  const formatDisplayDate = (date: string) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const handleClear = () => {
    onStartDateChange('')
    onEndDateChange('')
  }

  const handleQuickSelect = (hours: number) => {
    const now = new Date()
    const start = now.toISOString().slice(0, 16) // Format for datetime-local
    const end = new Date(now.getTime() + hours * 60 * 60 * 1000).toISOString().slice(0, 16)
    
    onStartDateChange(start)
    onEndDateChange(end)
    setShowPicker(false)
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

      {/* Date Picker Dropdown */}
      {showPicker && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-6 min-w-[500px] max-w-[90vw]">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Select Event Dates</h4>
            <p className="text-xs text-gray-500">Choose your event start and end dates</p>
          </div>

          {/* Quick Select Buttons */}
          <div className="mb-6">
            <p className="text-xs text-gray-600 mb-2">Quick Select:</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleQuickSelect(2)}
                className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                2 hours
              </button>
              <button
                onClick={() => handleQuickSelect(4)}
                className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                4 hours
              </button>
              <button
                onClick={() => handleQuickSelect(8)}
                className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                8 hours
              </button>
              <button
                onClick={() => handleQuickSelect(24)}
                className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                All day
              </button>
              <button
                onClick={() => handleQuickSelect(72)}
                className="px-3 py-2 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                3 days
              </button>
            </div>
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date & Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                />
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date & Time
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-event-blue focus:border-transparent"
                />
                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center gap-2 pt-4 border-t border-gray-200">
            <button
              onClick={handleClear}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear Selection
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPicker(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPicker(false)}
                disabled={!startDate || !endDate}
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

export default SimpleDatePicker
