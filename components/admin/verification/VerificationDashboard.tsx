'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import CustomDropdown from '@/components/ui/CustomDropdown'
import { verificationAdminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface VerificationDashboardProps {
  basePath?: string
}

export default function VerificationDashboard({ basePath = '/verification-admin' }: VerificationDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState([
    { label: 'Pending Verifications', value: '-', color: 'text-[#EAB308]', border: 'border-[#EAB308]' },
    { label: 'Approved this week', value: '-', color: 'text-[#22C55E]', border: 'border-[#22C55E]' },
    { label: 'Rejected', value: '-', color: 'text-[#EF4444]', border: 'border-[#EF4444]' },
  ])
  const [queue, setQueue] = useState<any[]>([])

  const [statusFilter, setStatusFilter] = useState('All Status')

  useEffect(() => {
    const fetchData = async () => {
        try {
            setIsLoading(true)
            const [queueRes, statsRes] = await Promise.all([
                verificationAdminAPI.getQueue().catch(() => ({ data: { data: [] } })),
                verificationAdminAPI.getStatistics().catch(() => ({ data: { data: {} } }))
            ])

            if (queueRes.data?.data) {
                setQueue(Array.isArray(queueRes.data.data) ? queueRes.data.data : [])
            }

            const statsData = statsRes.data?.data || {}
            setStats([
                { label: 'Pending Verifications', value: statsData.pendingVerifications?.toLocaleString() || '0', color: 'text-[#EAB308]', border: 'border-[#EAB308]' },
                { label: 'Approved this week', value: statsData.approvedThisWeek?.toLocaleString() || '0', color: 'text-[#22C55E]', border: 'border-[#22C55E]' },
                { label: 'Rejected', value: statsData.rejected?.toLocaleString() || '0', color: 'text-[#EF4444]', border: 'border-[#EF4444]' },
            ])
        } catch (error) {
            console.error('Error fetching verification dashboard:', error)
            toast.error('Failed to load verification data')
        } finally {
            setIsLoading(false)
        }
    }
    fetchData()
  }, [])

  const filteredQueue = statusFilter === 'All Status' 
    ? queue 
    : queue.filter(item => (item.status || 'Pending') === statusFilter)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-raleway text-gray-800 flex items-center gap-2">
          Welcome Back, Verification Admin <span className="text-2xl">👋🏽</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col items-center justify-center text-center h-40`}>
            {isLoading ? (
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded mb-2"></div>
            ) : (
                <span className={`text-4xl font-bold font-raleway ${stat.color} mb-2`}>{stat.value}</span>
            )}
            <span className={`text-sm font-medium text-gray-600`}>{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-transparent space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-700">Verification Queue</h2>
          <div className="w-40">
             <CustomDropdown 
               options={[
                 { label: 'All Status', value: 'All Status' },
                 { label: 'Pending', value: 'Pending' },
                 { label: 'Approved', value: 'Approved' },
                 { label: 'Rejected', value: 'Rejected' },
               ]}
               selected={statusFilter}
               onChange={setStatusFilter}
               buttonClassName="py-1.5 px-3 text-sm"
             />
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
              <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-lg shadow-sm animate-pulse"></div>)}
              </div>
          ) : (
            filteredQueue.length > 0 ? filteredQueue.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{item.businessName || item.name}</h3>
                <div className="text-sm text-gray-500 mt-1">
                  <p>Submitted: {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-')}</p>
                  <p>Documents: {item.documents ? (Array.isArray(item.documents) ? item.documents.join(', ') : item.documents) : 'CAC, ID Card'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${(item.status || 'Pending') === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    (item.status || 'Pending') === 'Approved' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {item.status || 'Pending'}
                </span>
                <Link 
                  href={`${basePath}/review/${item.id}`}
                  className="bg-[#0B2E6F] text-white px-6 py-2 rounded-lg hover:bg-[#09255a] transition-colors text-sm font-medium w-full md:w-auto text-center"
                >
                  Review
                </Link>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
              No verifications found for this status.
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

