'use client'

import { useNextCalendarApp, ScheduleXCalendar } from '@schedule-x/react'
import {
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
} from '@schedule-x/calendar'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { createDragAndDropPlugin } from '@schedule-x/drag-and-drop'
import { createResizePlugin } from '@schedule-x/resize'
import 'temporal-polyfill/global'
import '@schedule-x/theme-default/dist/index.css'
import { useState } from 'react'
import DateRange from '@/components/ui/DateRangePicker'


function CalendarApp() {
  const getEventColor = (title: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      kickoff: { bg: '#2563eb', text: '#fff' }, 
      review: { bg: '#16a34a', text: '#fff' }, 
      planning: { bg: '#ea580c', text: '#fff' }, 
      default: { bg: '#7c3aed', text: '#fff' }, 
    }

    const key = Object.keys(colorMap).find(k => title.toLowerCase().includes(k))

    return key ? colorMap[key] : colorMap.default
  }

  const eventsService = useState(() => createEventsServicePlugin())[0]

  const timeZone = Temporal.Now.timeZoneId()

  const dragAndDrop = createDragAndDropPlugin()
  const resize = createResizePlugin()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const [clickedDate, setClickedDate] = useState<string | null>(null)

  const calendar = useNextCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    events: [
      {
        id: '1',
        title: 'Kickoff Meeting',
        start:
          Temporal.PlainDateTime.from('2025-09-03T09:00').toZonedDateTime(
            timeZone
          ),
        end: Temporal.PlainDateTime.from('2025-09-03T10:00').toZonedDateTime(
          timeZone
        ),
        classNames: ['bg-event-blue', 'text-white'],
      },
    ],

    plugins: [eventsService, dragAndDrop, resize],
    callbacks: {
      onClickDate: (date: Temporal.PlainDate, e?: UIEvent) => {
        setClickedDate(date.toString())
        setDate(date.toString())
        setStartTime('09:00')
        setEndTime('10:00')
        setIsModalOpen(true)
      },
    },
  })


 const handleAddMeeting = () => {
   if (!title || !date || !startTime || !endTime)
     return alert('Fill all fields!')

   const plainStart = Temporal.PlainDateTime.from(`${date}T${startTime}`)
   const plainEnd = Temporal.PlainDateTime.from(`${date}T${endTime}`)

   const start = plainStart.toZonedDateTime(timeZone)
   const end = plainEnd.toZonedDateTime(timeZone)

   const colorMap: Record<string, string> = {
     kickoff: 'bg-event-blue text-white',
     review: 'bg-green-600 text-white',
     planning: 'bg-orange-600 text-white',
     default: 'bg-purple-600 text-white',
   }

   const key = Object.keys(colorMap).find(k => title.toLowerCase().includes(k))

   const classNames = key ? colorMap[key] : colorMap.default

   eventsService.add({
     id: String(Date.now()),
     title,
     start,
     end,
     classNames: classNames.split(' '),
   })

   setTitle('')
   setDate('')
   setStartTime('')
   setEndTime('')
   setIsModalOpen(false)
 }
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-asul font-semibold text-gray-700">
          Schedule Meetings
        </h2>
        <DateRange />
      </div>
      <div className="flex justify-between w-full pb-4 gap-3">
        <input
          type="search"
          placeholder="Search here"
          className="border rounded-2xl px-3 py-2 w-full"
        />
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-event-blue text-white px-4 py-2 rounded-lg shadow transition w-[20%]"
        >
          + New Meeting
        </button>
      </div>

      {/* Calendar */}
      <ScheduleXCalendar calendarApp={calendar} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Create New Meeting
            </h3>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Meeting Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-2">
                <input
                  type="time"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddMeeting}
                className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarApp
