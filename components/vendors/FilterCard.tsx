"use client"

import { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'

interface MarketplaceFilters {
  search: string
  date: string
  location: string
  budgetRange: string
  eventType: string
}

interface FilterCardProps {
  filters?: Partial<MarketplaceFilters>
  onFiltersChange?: (filters: MarketplaceFilters) => void
}

const emptyFilters: MarketplaceFilters = {
  search: '',
  date: '',
  location: '',
  budgetRange: '',
  eventType: '',
}

export default function FilterCard({ filters = emptyFilters, onFiltersChange }: FilterCardProps) {
  const normalizedFilters = { ...emptyFilters, ...filters }

  const [search, setSearch] = useState(normalizedFilters.search)
  const [date, setDate] = useState(normalizedFilters.date)
  const [location, setLocation] = useState(normalizedFilters.location)
  const [budgetRange, setBudgetRange] = useState(normalizedFilters.budgetRange)
  const [eventType, setEventType] = useState(normalizedFilters.eventType)

  // Update parent when any filter changes
  useEffect(() => {
    onFiltersChange?.({ search, date, location, budgetRange, eventType })
  }, [search, date, location, budgetRange, eventType, onFiltersChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔍 Filter applied:', { search, date, location, budgetRange, eventType })
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 lg:p-7 w-full lg:w-72 h-fit">
      <h2 className="font-semibold text-lg mb-4 hidden lg:block">Filter</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-event-blue focus:outline-none text-sm"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <select
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-event-blue focus:outline-none"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="next-month">Next Month</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <select
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-event-blue focus:outline-none"
          >
            <option value="">All Locations</option>
            <option value="lagos">Lagos</option>
            <option value="abuja">Abuja</option>
            <option value="port-harcourt">Port Harcourt</option>
            <option value="kano">Kano</option>
            <option value="enugu">Enugu</option>
            <option value="ibadan">Ibadan</option>
          </select>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
          <select
            value={budgetRange}
            onChange={e => setBudgetRange(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-event-blue focus:outline-none"
          >
            <option value="">All Budgets</option>
            <option value="under-100k">Under ₦100,000</option>
            <option value="100k-500k">₦100,000 - ₦500,000</option>
            <option value="500k-1m">₦500,000 - ₦1,000,000</option>
            <option value="1m-2m">₦1,000,000 - ₦2,000,000</option>
            <option value="over-2m">Over ₦2,000,000</option>
          </select>
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
          <select
            value={eventType}
            onChange={e => setEventType(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-event-blue focus:outline-none"
          >
            <option value="">All Event Types</option>
            <option value="wedding">Wedding</option>
            <option value="birthday">Birthday</option>
            <option value="corporate">Corporate</option>
            <option value="naming">Naming Ceremony</option>
            <option value="anniversary">Anniversary</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            className="w-full bg-event-blue text-white py-3 rounded-lg transition-colors text-sm font-medium hover:bg-event-blue-hover"
          >
            Show Result
          </button>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setDate('')
              setLocation('')
              setBudgetRange('')
              setEventType('')
              onFiltersChange?.(emptyFilters)
            }}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg transition-colors text-sm font-medium hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </form>
    </div>
  )
}
