'use client'

import React from 'react'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onStartDateChange: (date: string) => void
  onEndDateChange: (date: string) => void
  label?: string
}

export default function DateRangePicker({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  label = "Availability"
}: DateRangePickerProps) {
  const CalendarIcon = () => (
    <svg className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-800 mb-3">{label}</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Start Date</label>
          <div className="relative">
            <CalendarIcon />
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="w-full pl-8 pr-2 py-1 text-sm border border-event-blue rounded focus:ring-1 focus:ring-event-blue focus:border-transparent"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">End Date</label>
          <div className="relative">
            <CalendarIcon />
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="w-full pl-8 pr-2 py-1 text-sm border border-event-blue rounded focus:ring-1 focus:ring-event-blue focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
