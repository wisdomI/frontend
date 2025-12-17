'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users,
  MoreVertical,
  Eye,
  Download
} from 'lucide-react'
import CustomDropdown from '@/components/ui/CustomDropdown'

// Mock Data
const events = [
  { 
    id: 1, 
    title: 'Product Launch 2025', 
    organizer: 'Tech Corp', 
    type: 'Corporate', 
    date: '2025-12-15', 
    location: 'NECA House, Ikeja', 
    attendees: 1537,
    status: 'Upcoming',
    revenue: '₦2,450,000'
  },
  { 
    id: 2, 
    title: 'Sarah & Mike Wedding', 
    organizer: 'Sarah Smith', 
    type: 'Wedding', 
    date: '2025-11-20', 
    location: 'Eko Hotels, VI', 
    attendees: 500,
    status: 'Completed',
    revenue: '₦0'
  },
  { 
    id: 3, 
    title: 'Lagos Tech Fest', 
    organizer: 'Dev Community', 
    type: 'Conference', 
    date: '2025-10-05', 
    location: 'Landmark Centre', 
    attendees: 5000,
    status: 'Completed',
    revenue: '₦15,000,000'
  },
  { 
    id: 4, 
    title: 'End of Year Party', 
    organizer: 'Access Bank', 
    type: 'Party', 
    date: '2025-12-20', 
    location: 'Civic Centre', 
    attendees: 800,
    status: 'Upcoming',
    revenue: '₦0'
  },
  { 
    id: 5, 
    title: 'Art Exhibition', 
    organizer: 'Creative Hub', 
    type: 'Exhibition', 
    date: '2025-09-15', 
    location: 'Muson Centre', 
    attendees: 300,
    status: 'Cancelled',
    revenue: '₦50,000'
  },
]

export default function SuperAdminEventsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [statusFilter, setStatusFilter] = useState('All Status')

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'All Types' || event.type === typeFilter
    const matchesStatus = statusFilter === 'All Status' || event.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-asul text-gray-800">Event Management</h1>
        <p className="text-gray-600 mt-1">View and manage all events on the platform</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Events</h3>
          <p className="text-3xl font-bold text-[#0B2E6F] font-asul mt-2">5,234</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Upcoming</h3>
          <p className="text-3xl font-bold text-[#0B2E6F] font-asul mt-2">156</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Completed</h3>
          <p className="text-3xl font-bold text-green-600 font-asul mt-2">4,890</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
          <p className="text-3xl font-bold text-[#0B2E6F] font-asul mt-2">₦1.2B</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search events by title or organizer..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0B2E6F]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <div className="w-40 min-w-[160px]">
            <CustomDropdown 
              options={[
                { label: 'All Types', value: 'All Types' },
                { label: 'Corporate', value: 'Corporate' },
                { label: 'Wedding', value: 'Wedding' },
                { label: 'Party', value: 'Party' },
                { label: 'Conference', value: 'Conference' },
              ]}
              selected={typeFilter}
              onChange={setTypeFilter}
              buttonClassName="py-2"
            />
          </div>
          <div className="w-40 min-w-[160px]">
             <CustomDropdown 
              options={[
                { label: 'All Status', value: 'All Status' },
                { label: 'Upcoming', value: 'Upcoming' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Cancelled', value: 'Cancelled' },
              ]}
              selected={statusFilter}
              onChange={setStatusFilter}
              buttonClassName="py-2"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 bg-white whitespace-nowrap">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Event Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between md:justify-start gap-4 mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                    event.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {event.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    {event.attendees.toLocaleString()} Attendees
                  </div>
                  <div className="font-medium text-[#0B2E6F]">
                    Revenue: {event.revenue}
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  Organized by <span className="font-medium text-gray-700">{event.organizer}</span> • {event.type}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                <Link 
                  href={`/super-admin/events/details`} // Linking to the existing details page (static for now)
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#F3F4F6] text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium w-full md:w-auto"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Link>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 hidden md:block">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500">No events found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

