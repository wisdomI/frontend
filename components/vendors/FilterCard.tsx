"use client"

import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

export default function FilterCard() {
  const [search, setSearch] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ search, date, location })
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-7 w-72 h-fit">
      <h2 className="font-semibold text-lg mb-4">Filter</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          />
        </div>

        {/* Date */}
        <select
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Date</option>
          <option value="today">Today</option>
          <option value="this-week">This Week</option>
          <option value="this-month">This Month</option>
        </select>

        {/* Location */}
        <select
          value={location}
          onChange={e => setLocation(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">Location</option>
          <option value="lagos">Lagos</option>
          <option value="abuja">Abuja</option>
          <option value="port-harcourt">Port Harcourt</option>
        </select>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-event-blue text-white py-3 rounded-lg transition-colors text-sm font-medium"
        >
          Show Result
        </button>
      </form>
    </div>
  )
}
