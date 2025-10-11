'use client'

import React, { useState, useEffect } from 'react'
import { useVendorTeam } from '@/hooks/useVendorTeam'
import { FiSearch, FiCalendar, FiChevronDown, FiChevronLeft, FiChevronRight, FiPlus, FiUsers, FiClock, FiMoreVertical } from 'react-icons/fi'

interface StaffRecord {
  id: number
  dateTime: string
  profiledBy: string
  staffName: string
  staffEmail: string
  staffPhone: string
  role: string
}

export default function ManageTeamsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<'All' | 'Support' | 'Supervisor'>('All')
  const [fromDate, setFromDate] = useState('12 Jul, 2025')
  const [toDate, setToDate] = useState('18 Jul, 2025')
  const [currentPage, setCurrentPage] = useState(1)

  // API hooks
  const { 
    staff, 
    roles, 
    teamStats, 
    loading: teamLoading, 
    error: teamError,
    fetchStaff,
    addStaff,
    updateStaff,
    removeStaff,
    createRole,
    updateRole,
    deleteRole
  } = useVendorTeam()

  // Transform staff/members from API to StaffRecord format
  const staffData: StaffRecord[] = React.useMemo(() => {
    if (!staff || staff.length === 0) {
      console.log('ℹ️ No team members from API yet')
      return []
    }
    
    console.log('🔄 Transforming team members:', staff.length, 'members')
    return staff.map((member: any) => ({
      id: member.id,
      dateTime: new Date(member.createdAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      profiledBy: member.invitedBy || 'You',
      staffName: member.name || member.userName || 'Unknown',
      staffEmail: member.email,
      staffPhone: member.phoneNumber || 'N/A',
      role: member.role.charAt(0).toUpperCase() + member.role.slice(1)
    }))
  }, [staff])

  const filteredStaff = staffData.filter(staff => {
    const matchesSearch = staff.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.staffEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'All' || staff.role === filterRole
    return matchesSearch && matchesRole
  })

  const totalPages = Math.ceil(filteredStaff.length / 10)
  const startIndex = (currentPage - 1) * 10
  const endIndex = Math.min(startIndex + 10, filteredStaff.length)
  const currentStaff = filteredStaff.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Teams</h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
              <FiPlus className="w-4 h-4" />
              Create Role
            </button>
            <button className="px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
              <FiUsers className="w-4 h-4" />
              Profile Staff
            </button>
            <button className="px-4 py-2 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
              <FiClock className="w-4 h-4" />
              View History
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by Staff Name, Email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Filter by Role */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Filter by:</span>
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-white font-medium focus:ring-2 focus:border-transparent appearance-none pr-8"
                  style={{ backgroundColor: '#032D71', '--tw-ring-color': '#032D71' } as React.CSSProperties}
                >
                  <option value="All">Role</option>
                  <option value="Support">Support</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
                <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white w-4 h-4 pointer-events-none" />
              </div>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">From:</span>
                <div className="relative">
                  <input
                    type="text"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 font-medium">To:</span>
                <div className="relative">
                  <input
                    type="text"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                  />
                  <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profiled by</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentStaff.map((staff) => (
                  <tr key={staff.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.dateTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.profiledBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.staffName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.staffEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.staffPhone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{staff.role}</span>
                        <FiChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <FiMoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing {startIndex + 1}-{endIndex} of {filteredStaff.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt; Previous
                </button>
                
                {/* Page Numbers */}
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === 1 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  1
                </button>
                <button
                  onClick={() => setCurrentPage(2)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === 2 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  2
                </button>
                <button
                  onClick={() => setCurrentPage(3)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === 3 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  3
                </button>
                <span className="px-2 text-sm text-gray-500">...</span>
                <button
                  onClick={() => setCurrentPage(7)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === 7 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  7
                </button>
                <button
                  onClick={() => setCurrentPage(10)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === 10 ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  10
                </button>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
