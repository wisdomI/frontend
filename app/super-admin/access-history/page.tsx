'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { adminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function AccessHistoryPage() {
  const [accessHistory, setAccessHistory] = useState<any[]>([])
  const [activityLogs, setActivityLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [historyRes, logsRes] = await Promise.all([
          adminAPI.getAccessHistory().catch(() => ({ data: { data: [] } })),
          adminAPI.getActivityLogs().catch(() => ({ data: { data: [] } }))
        ])

        if (historyRes.data?.data) {
           setAccessHistory(Array.isArray(historyRes.data.data) ? historyRes.data.data : [])
        }
        if (logsRes.data?.data) {
           setActivityLogs(Array.isArray(logsRes.data.data) ? logsRes.data.data : [])
        }
      } catch (error) {
        console.error('Failed to fetch access history:', error)
        toast.error('Failed to load access history')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = {
      total: accessHistory.length,
      active: accessHistory.filter(a => a.status === 'active' || a.isActive).length,
      inactive: accessHistory.filter(a => a.status !== 'active' && !a.isActive).length
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/super-admin" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 font-raleway">Admin Access History</h1>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex justify-between items-center text-center divide-x divide-gray-100">
          <div className="flex-1 px-4">
            <p className="text-sm text-gray-500 mb-1">Total</p>
            {isLoading ? (
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded mx-auto"></div>
            ) : (
                <p className="text-2xl font-bold text-[#0B2E6F]">{stats.total}</p>
            )}
          </div>
          <div className="flex-1 px-4">
            <p className="text-sm text-gray-500 mb-1">Active</p>
            {isLoading ? (
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded mx-auto"></div>
            ) : (
                <p className="text-2xl font-bold text-[#0B2E6F]">{stats.active}</p>
            )}
          </div>
          <div className="flex-1 px-4">
            <p className="text-sm text-gray-500 mb-1">Inactive</p>
            {isLoading ? (
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded mx-auto"></div>
            ) : (
                <p className="text-2xl font-bold text-[#0B2E6F]">{stats.inactive}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Overview List */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Admin Overview</h2>
            {isLoading ? (
                <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-xl shadow-sm animate-pulse"></div>)}
                </div>
            ) : (
                <div className="space-y-4">
                {accessHistory.length > 0 ? accessHistory.map((admin, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-gray-900">{admin.firstName} {admin.lastName}</h3>
                        <p className="text-sm text-gray-500 mb-2">{admin.adminType?.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-400">
                            Created: {new Date(admin.createdAt).toLocaleDateString()} 
                            {admin.lastLogin && ` | Last Active: ${new Date(admin.lastLogin).toLocaleDateString()}`}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        (admin.status === 'active' || admin.isActive)
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                        {admin.status || (admin.isActive ? 'active' : 'inactive')}
                    </span>
                    </div>
                )) : (
                    <p className="text-gray-500 text-sm">No access history found.</p>
                )}
                </div>
            )}
          </div>

          {/* Activity Log */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
            {isLoading ? (
                <div className="h-64 bg-white rounded-xl shadow-sm animate-pulse"></div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                {activityLogs.length > 0 ? activityLogs.map((log, idx) => (
                    <div key={idx} className="p-4 flex gap-4">
                    <div className={`w-1 self-stretch rounded-full ${idx % 2 === 0 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                    <div className="flex-1 flex justify-between items-center">
                        <div>
                        <p className="font-medium text-gray-900">{log.performedBy || 'System'}</p>
                        <p className="text-sm text-gray-500">{log.action || log.description}</p>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                            {new Date(log.createdAt || log.timestamp).toLocaleString()}
                        </span>
                    </div>
                    </div>
                )) : (
                    <div className="p-8 text-center text-gray-500 text-sm">No activity logs found.</div>
                )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
