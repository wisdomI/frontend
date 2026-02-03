'use client'

import React, { useState, useCallback } from 'react'
import { Calendar as BigCalendar, momentLocalizer, View, SlotInfo } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './calendar-custom.css'

const localizer = momentLocalizer(moment)

export interface CalendarEvent {
  id: string | number
  title: string
  start: Date
  end: Date
  resource?: any
  allDay?: boolean
}

interface CalendarProps {
  events?: CalendarEvent[]
  onSelectEvent?: (event: CalendarEvent) => void
  onSelectSlot?: (slotInfo: SlotInfo) => void
  onNavigate?: (date: Date) => void
  onView?: (view: View) => void
  defaultView?: View
  selectable?: boolean
  showMultiDayTimes?: boolean
  step?: number
  timeslots?: number
  className?: string
  style?: React.CSSProperties
  min?: Date
  max?: Date
  views?: View[] | { [key: string]: boolean }
  toolbar?: boolean
  popup?: boolean
  eventPropGetter?: (event: CalendarEvent) => { className?: string; style?: React.CSSProperties }
}

const Calendar: React.FC<CalendarProps> = ({
  events = [],
  onSelectEvent,
  onSelectSlot,
  onNavigate,
  onView,
  defaultView = 'month',
  selectable = true,
  showMultiDayTimes = false,
  step = 30,
  timeslots = 2,
  className = '',
  style = {},
  min = new Date(1970, 1, 1, 8, 0, 0), // 8 AM
  max = new Date(1970, 1, 1, 20, 0, 0), // 8 PM
  views = ['month', 'week', 'day', 'agenda'],
  toolbar = true,
  popup = true,
  eventPropGetter,
}) => {
  const [view, setView] = useState<View>(defaultView)
  const [date, setDate] = useState(new Date())

  const handleNavigate = useCallback(
    (newDate: Date) => {
      setDate(newDate)
      if (onNavigate) {
        onNavigate(newDate)
      }
    },
    [onNavigate]
  )

  const handleViewChange = useCallback(
    (newView: View) => {
      setView(newView)
      if (onView) {
        onView(newView)
      }
    },
    [onView]
  )

  const handleSelectSlot = useCallback(
    (slotInfo: SlotInfo) => {
      if (onSelectSlot) {
        onSelectSlot(slotInfo)
      }
    },
    [onSelectSlot]
  )

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      if (onSelectEvent) {
        onSelectEvent(event)
      }
    },
    [onSelectEvent]
  )

  const defaultEventPropGetter = (event: CalendarEvent) => {
    return {
      className: 'custom-event',
      style: {
        backgroundColor: '#0B2E6F',
        borderRadius: '5px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block',
      },
    }
  }

  return (
    <div className={`calendar-container ${className}`} style={style}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={view}
        date={date}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable={selectable}
        showMultiDayTimes={showMultiDayTimes}
        step={step}
        timeslots={timeslots}
        min={min}
        max={max}
        views={views}
        toolbar={toolbar}
        popup={popup}
        eventPropGetter={eventPropGetter || defaultEventPropGetter}
      />
    </div>
  )
}

export default Calendar

