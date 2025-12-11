"use client"

import { useState } from 'react'
import Link from 'next/link'
import { FiCalendar } from 'react-icons/fi'

interface DisputeDashboardProps {
  basePath?: string
  userRole?: string // 'dispute-admin' | 'super-admin'
}

export default function DisputeDashboard({ basePath = '/dispute-admin', userRole = 'Dispute Admin' }: DisputeDashboardProps) {
  const stats = [
    { label: 'Active Disputes', value: 23, color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
    { label: 'Resolved', value: 145, color: 'text-[#0B2E6F]', border: 'border-[#22C55E]' },
    { label: 'Escalated', value: 5, color: 'text-[#0B2E6F]', border: 'border-[#EAB308]' },
    { label: 'Refunds Processed', value: 23, color: 'text-[#0B2E6F]', border: 'border-[#EC4899]' },
  ]

  const disputes = [
    {
      id: '1234',
      client: 'John Doe',
      vendor: 'ABC Caterers',
      type: 'Services',
      status: 'Pending',
      dateCreated: '2025-10-15',
      dateOpened: '2025-10-16 09:30 AM',
    },
    {
      id: '1235',
      client: 'Mary Jane',
      vendor: 'XYZ Decor',
      type: 'Payment',
      status: 'In Review',
      dateCreated: '2025-10-15',
      dateOpened: '2025-10-16 09:30 AM',
    },
    {
      id: '1236',
      client: 'John Doe',
      vendor: 'UK Cakes',
      type: 'Others',
      status: 'Pending',
      dateCreated: '2025-10-15',
      dateOpened: '2025-10-16 09:30 AM',
    },
    {
      id: '1237',
      client: 'John Doe',
      vendor: 'DJ Lekzy',
      type: 'Services',
      status: 'Pending',
      dateCreated: '2025-10-15',
      dateOpened: '2025-10-16 09:30 AM',
    },
    {
      id: '1238',
      client: 'John Doe',
      vendor: 'Ruthie Rentals',
      type: 'Services',
      status: 'In Review',
      dateCreated: '2025-10-15',
      dateOpened: '2025-10-16 09:30 AM',
    },
    {
      id: '1239',
      client: 'John Doe',
      vendor: 'Elite Catering',
      type: 'Payment',
      status: 'Pending',
      dateCreated: '2025-10-15',
      dateOpened: '2025-10-16 09:30 AM',
    },
    {
      id: '1240',
      client: 'John Doe',
      vendor: 'Ruthie Rentals',
      type: 'Others',
      status: 'Pending',
      dateCreated: '2025-10-15',
      dateOpened: '2025-10-16 09:30 AM',
    },
    {
      id: '1241',
      client: 'John Doe',
      vendor: 'Ile Iyan Foods',
      type: 'Payment',
      status: 'In Review',
      dateCreated: '2025-10-15',
      dateOpened: '2025-10-16 09:30 AM',
    },
    {
      id: '1242',
      client: 'John Doe',
      vendor: 'Ruthie Rentals',
      type: 'Others',
      status: 'In Review',
      dateCreated: '2025-10-15',
      dateOpened: '2025-10-16 09:30 AM',
    },
  ]

  const [statusFilter, setStatusFilter] = useState('All Status')
  const [typeFilter, setTypeFilter] = useState('All Disputes')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case 'Services': return 'bg-blue-100 text-blue-700'
      case 'Payment': return 'bg-green-100 text-green-700'
      case 'Others': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-red-100 text-red-700'
      case 'In Review': return 'bg-yellow-100 text-yellow-700'
      case 'Resolved': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const filteredDisputes = disputes.filter(item => {
    if (statusFilter !== 'All Status' && item.status !== statusFilter) return false
    if (typeFilter !== 'All Disputes' && typeFilter !== 'All Types' && item.type !== typeFilter) return false
    // Add date filtering if needed
    return true
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-asul text-gray-800 flex items-center gap-2">
          Welcome Back, {userRole} <span className="text-2xl">👋🏽</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col items-center justify-center text-center h-40`}>
            <span className={`text-3xl font-bold font-asul ${stat.color} mb-2`}>{stat.value}</span>
            <span className={`text-sm font-medium text-gray-600`}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Date From</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <FiCalendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Date To</label>
            <div className="relative">
              <input
                type="text"
                placeholder="MM/DD/YYYY"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <FiCalendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>In Review</option>
              <option>Resolved</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Types</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
            >
              <option>All Disputes</option>
              <option>Services</option>
              <option>Payment</option>
              <option>Others</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">DISPUTE ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">CLIENT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">VENDOR</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">TYPE</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">DATE CREATED</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">DATE OPENED</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDisputes.length > 0 ? (
                filteredDisputes.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">Case #{item.id}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.client}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.vendor}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeStyle(item.type)}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.dateCreated}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.dateOpened}</td>
                    <td className="px-4 py-4 text-sm text-right">
                      <Link
                        href={`${basePath}/case/${item.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0B2E6F] hover:bg-[#092456] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Review case
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <span className="text-xl">!</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No active disputes yet</h3>
                      <p className="text-gray-500">Once disputes arise, they will appear here</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span>- <span className="font-medium">{filteredDisputes.length}</span> of <span className="font-medium">20</span>
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
              <span className="sr-only">Previous</span>
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="px-3 py-1 bg-[#0B2E6F] text-white rounded-md text-sm font-medium">1</button>
            <button className="px-3 py-1 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium">2</button>
            <button className="px-3 py-1 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium">3</button>
            <span className="text-gray-500">...</span>
            <button className="px-3 py-1 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium">7</button>
            <button className="px-3 py-1 text-gray-700 hover:bg-gray-50 rounded-md text-sm font-medium">10</button>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <span className="sr-only">Next</span>
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

