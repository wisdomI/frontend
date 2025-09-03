"use client"

import {useState} from "react"
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Icon } from '@iconify/react'
import calendarMultiselectOutline from '@iconify/icons-mdi/calendar-multiselect-outline'

export default function DateRange() {
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(new Date())

  return (
    <div className="flex items-center gap-4">
      <label className="font-semibold">From:</label>
      <div className="relative">
        <Icon
          icon={calendarMultiselectOutline}
          width="24"
          height="24"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-event-blue p-1 rounded-md z-10"
        />
        <DatePicker
          selected={startDate}
          onChange={date => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd MMM, yyyy"
          className="border rounded-lg p-2 w-[130px] pl-10 text-sm cursor-pointer"
        />
      </div>
      <label className="font-semibold">To:</label>
      <div className="relative">
        <Icon
          icon={calendarMultiselectOutline}
          width="24"
          height="24"
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white bg-event-blue p-1 rounded-md z-10"
        />
        <DatePicker
          selected={endDate}
          onChange={date => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd MMM, yyyy"
          className="border rounded-lg p-2 w-[130px] pl-10 text-sm cursor-pointer"
        />
      </div>
    </div>
  )
}
