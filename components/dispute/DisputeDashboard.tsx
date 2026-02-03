"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiCalendar } from 'react-icons/fi'
import { disputeAdminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface DisputeDashboardProps {
  basePath?: string
  userRole?: string // 'dispute-admin' | 'super-admin'
}

export default function DisputeDashboard({ basePath = '/dispute-admin', userRole = 'Dispute Admin' }: DisputeDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState([
    { label: 'Active Disputes', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
    { label: 'Resolved', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#22C55E]' },
    { label: 'Escalated', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#EAB308]' },
    { label: 'Refunds Processed', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#EC4899]' },
  ])
  const [disputes, setDisputes] = useState<any[]>([])

  const [statusFilter, setStatusFilter] = useState('All Status')
  const [typeFilter, setTypeFilter] = useState('All Disputes')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => {
    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [dashboardRes, disputesRes] = await Promise.all([
                disputeAdminAPI.getDashboard().catch(() => ({ data: { data: {} } })),
                disputeAdminAPI.getDisputes().catch(() => ({ data: { data: [] } }))
            ])

            const dashboardData = dashboardRes.data?.data || {}
            setStats([
                { label: 'Active Disputes', value: dashboardData.activeDisputes?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
                { label: 'Resolved', value: dashboardData.resolvedDisputes?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#22C55E]' },
                { label: 'Escalated', value: dashboardData.escalatedDisputes?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#EAB308]' },
                { label: 'Refunds Processed', value: dashboardData.refundsProcessed?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#EC4899]' },
            ])

            if (disputesRes.data?.data) {
                setDisputes(Array.isArray(disputesRes.data.data) ? disputesRes.data.data : [])
            }

        } catch (error: any) {
            console.error('Error fetching dispute data:', error.message || 'Unknown error')
            toast.error('Failed to load dispute data')
        } finally {
            setIsLoading(false)
        }
    }
    fetchData()
  }, [])

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
    if (statusFilter !== 'All Status' && (item.status || 'Pending') !== statusFilter) return false
    if (typeFilter !== 'All Disputes' && typeFilter !== 'All Types' && (item.type || 'Others') !== typeFilter) return false
    // Add date filtering if needed
    return true
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-raleway text-gray-800 flex items-center gap-2">
          Welcome Back, {userRole} <span className="text-2xl">👋🏽</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col items-center justify-center text-center h-40`}>
            {isLoading ? (
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
            ) : (
                <span className={`text-3xl font-bold font-raleway ${stat.color} mb-2`}>{stat.value}</span>
            )}
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
              {isLoading ? (
                  <tr>
                      <td colSpan={8} className="py-8">
                          <div className="flex justify-center"><div className="h-8 w-full max-w-md bg-gray-100 animate-pulse rounded"></div></div>
                      </td>
                  </tr>
              ) : (
               filteredDisputes.length > 0 ? (
                filteredDisputes.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">Case #{item.id.substring(0, 8)}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.clientName || item.client}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.vendorName || item.vendor}</td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeStyle(item.type || 'Others')}`}>
                        {item.type || 'Others'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(item.status || 'Pending')}`}>
                        {item.status || 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.openedAt ? new Date(item.openedAt).toLocaleDateString() : '-'}</td>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          {/* Pagination controls */}
        </div>
      </div>
    </div>
  )
}
