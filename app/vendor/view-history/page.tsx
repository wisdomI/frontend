'use client'

import React, { useState } from 'react'
import { FiSearch, FiCalendar, FiChevronDown, FiChevronLeft, FiChevronRight, FiArrowLeft } from 'react-icons/fi'

interface HistoryRecord {
  id: number
  dateTime: string
  staffName: string
  performedBy: string
  staffEmail: string
  staffPhone: string
  role: string
  action: 'Enabled' | 'Disabled'
}

export default function ViewHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterAction, setFilterAction] = useState<'All' | 'Enabled' | 'Disabled'>('All')
  const [fromDate, setFromDate] = useState('12 Jul, 2025')
  const [toDate, setToDate] = useState('18 Jul, 2025')
  const [currentPage, setCurrentPage] = useState(1)

  const historyData: HistoryRecord[] = [
    { id: 1, dateTime: '20/07/2025; 02:25pm', staffName: 'Moses Clement', performedBy: 'Sarah Madu', staffEmail: 'mosesclement@gmail.com', staffPhone: '+234803 453 9866', role: 'Support', action: 'Enabled' },
    { id: 2, dateTime: '20/07/2025; 02:25pm', staffName: 'Favour Odunsi', performedBy: 'Femi Ola', staffEmail: 'favour@gmail.com', staffPhone: '+234803 453 9866', role: 'Supervisor', action: 'Disabled' },
    { id: 3, dateTime: '20/07/2025; 02:25pm', staffName: 'Michael Irabo', performedBy: 'Shola Ajayi', staffEmail: 'michael@gmail.com', staffPhone: '+234803 453 9866', role: 'Support', action: 'Enabled' },
    { id: 4, dateTime: '20/07/2025; 02:25pm', staffName: 'Grace Okonkwo', performedBy: 'Sarah Madu', staffEmail: 'grace@gmail.com', staffPhone: '+234803 453 9866', role: 'Supervisor', action: 'Disabled' },
    { id: 5, dateTime: '20/07/2025; 02:25pm', staffName: 'David Johnson', performedBy: 'Femi Ola', staffEmail: 'david@gmail.com', staffPhone: '+234803 453 9866', role: 'Support', action: 'Enabled' },
    { id: 6, dateTime: '20/07/2025; 02:25pm', staffName: 'Mary Williams', performedBy: 'Shola Ajayi', staffEmail: 'mary@gmail.com', staffPhone: '+234803 453 9866', role: 'Supervisor', action: 'Disabled' },
    { id: 7, dateTime: '20/07/2025; 02:25pm', staffName: 'John Brown', performedBy: 'Sarah Madu', staffEmail: 'john@gmail.com', staffPhone: '+234803 453 9866', role: 'Support', action: 'Enabled' },
    { id: 8, dateTime: '20/07/2025; 02:25pm', staffName: 'Sarah Davis', performedBy: 'Femi Ola', staffEmail: 'sarah@gmail.com', staffPhone: '+234803 453 9866', role: 'Supervisor', action: 'Disabled' },
    { id: 9, dateTime: '20/07/2025; 02:25pm', staffName: 'James Wilson', performedBy: 'Shola Ajayi', staffEmail: 'james@gmail.com', staffPhone: '+234803 453 9866', role: 'Support', action: 'Enabled' },
    { id: 10, dateTime: '20/07/2025; 02:25pm', staffName: 'Lisa Anderson', performedBy: 'Sarah Madu', staffEmail: 'lisa@gmail.com', staffPhone: '+234803 453 9866', role: 'Supervisor', action: 'Disabled' },
  ]

  const filteredHistory = historyData.filter(record => {
    const matchesSearch = record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.staffEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.staffPhone.includes(searchTerm)
    const matchesAction = filterAction === 'All' || record.action === filterAction
    return matchesSearch && matchesAction
  })

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Enabled':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Disabled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const totalPages = Math.ceil(filteredHistory.length / 10)
  const startIndex = (currentPage - 1) * 10
  const endIndex = Math.min(startIndex + 10, filteredHistory.length)
  const currentHistory = filteredHistory.slice(startIndex, endIndex)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button className="p-1">
            <FiArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">View History</h1>
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
                  placeholder="Search by Staff Name, Email, Phone number"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  style={{ '--tw-ring-color': '#032D71' } as React.CSSProperties}
                />
              </div>
            </div>

            {/* Filter by Action */}
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Filter by:</span>
              <div className="relative">
                <select
                  value={filterAction}
                  onChange={(e) => setFilterAction(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-white font-medium focus:ring-2 focus:border-transparent appearance-none pr-8"
                  style={{ backgroundColor: '#032D71', '--tw-ring-color': '#032D71' } as React.CSSProperties}
                >
                  <option value="All">Action</option>
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
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

        {/* History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed by</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.dateTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.staffName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.performedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.staffEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.staffPhone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getActionColor(record.action)}`}>
                        {record.action}
                      </span>
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
                Showing {startIndex + 1}-{endIndex} of {filteredHistory.length}
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
