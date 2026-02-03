'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import CustomDropdown from '@/components/ui/CustomDropdown'
import { escrowAnalyticsAdminAPI } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface EscrowDashboardProps {
  basePath?: string
}

export default function EscrowDashboard({ basePath = '/escrow-admin' }: EscrowDashboardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState([
    { label: 'Funded', value: '-', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
    { label: 'Pending', value: '-', color: 'text-[#EAB308]', border: 'border-[#EAB308]' },
    { label: 'Released', value: '-', color: 'text-[#22C55E]', border: 'border-[#22C55E]' },
    { label: 'Disputed', value: '-', color: 'text-[#EF4444]', border: 'border-[#EF4444]' },
  ])
  const [allTransactions, setAllTransactions] = useState<any[]>([])

  const [statusFilter, setStatusFilter] = useState('All Status')

  useEffect(() => {
    const fetchData = async () => {
        try {
            setIsLoading(true)
            // Fetch dashboard stats
            const dashboardRes = await escrowAnalyticsAdminAPI.getDashboard().catch(() => ({ data: { data: {} } }))
            const dashboardData = dashboardRes.data?.data || {}
            
            setStats([
                { label: 'Funded', value: dashboardData.funded?.toLocaleString() || '0', color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
                { label: 'Pending', value: dashboardData.pending?.toLocaleString() || '0', color: 'text-[#EAB308]', border: 'border-[#EAB308]' },
                { label: 'Released', value: dashboardData.released?.toLocaleString() || '0', color: 'text-[#22C55E]', border: 'border-[#22C55E]' },
                { label: 'Disputed', value: dashboardData.disputed?.toLocaleString() || '0', color: 'text-[#EF4444]', border: 'border-[#EF4444]' },
            ])

            // If dashboard returns transactions, use them. Otherwise we might need another endpoint or mock for now
            // user only provided getDisputes separately.
            if (dashboardData.recentTransactions) {
                setAllTransactions(dashboardData.recentTransactions)
            } else if (dashboardData.transactions) {
                 setAllTransactions(dashboardData.transactions)
            }

        } catch (error) {
            console.error('Error fetching escrow dashboard:', error)
            toast.error('Failed to load escrow data')
        } finally {
            setIsLoading(false)
        }
    }
    fetchData()
  }, [])

  const filteredTransactions = statusFilter === 'All Status' 
    ? allTransactions 
    : allTransactions.filter(tx => (tx.status || 'Pending') === statusFilter)

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'Funded': return 'bg-[#E0E7FF] text-[#0B2E6F]'
          case 'Pending': return 'bg-[#FEF3C7] text-[#D97706]'
          case 'Released': return 'bg-[#DCFCE7] text-[#166534]'
          case 'Disputed': return 'bg-red-100 text-red-800'
          default: return 'bg-gray-100 text-gray-800'
      }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-raleway text-gray-800 flex items-center gap-2">
          Welcome Back, Escrow & Analytics Admin <span className="text-2xl">👋🏽</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Vendor Progress Tracker Link */}
      <Link href={`${basePath}/vendor-progress`}>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
          <div>
            <h3 className="text-gray-900 font-semibold">Vendor Progress Tracker</h3>
            <p className="text-sm text-gray-500">View active projects</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </Link>

      <div className="bg-transparent space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Escrow Transactions</h2>
          <div className="w-40">
             <CustomDropdown 
               options={[
                 { label: 'All Status', value: 'All Status' },
                 { label: 'Pending only', value: 'Pending' },
                 { label: 'Funded only', value: 'Funded' },
                 { label: 'Released only', value: 'Released' },
                 { label: 'Approved only', value: 'Approved' },
                 { label: 'Refunded only', value: 'Refunded' },
                 { label: 'In Escrow only', value: 'In Escrow' },
               ]}
               selected={statusFilter}
               onChange={setStatusFilter}
               placeholder="Choose status"
               buttonClassName="py-1.5 px-3 text-sm w-full justify-between"
             />
          </div>
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
              <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white rounded-lg shadow-sm animate-pulse"></div>)}
              </div>
          ) : (
            filteredTransactions.length > 0 ? filteredTransactions.map((tx) => (
            <div key={tx.id} className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-800">{tx.event || tx.title || 'Untitled Event'}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  Client: {tx.clientName || tx.client} → Vendor: {tx.vendorName || tx.vendor}
                </p>
                <p className="text-xl font-bold text-[#0B2E6F] font-raleway">{tx.amount ? `₦${tx.amount.toLocaleString()}` : '-'}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                 <span className={`px-6 py-2 rounded-lg text-sm font-medium ${getStatusColor(tx.status || 'Pending')} w-full sm:w-auto text-center min-w-[100px]`}>
                   {tx.status || 'Pending'}
                 </span>
                 <Link 
                   href={`${basePath}/transaction/${tx.id}`}
                   className="bg-[#0B2E6F] text-white px-6 py-2 rounded-lg hover:bg-[#09255a] transition-colors text-sm font-medium w-full sm:w-auto text-center whitespace-nowrap"
                   onClick={(e) => {
                       if (!tx.id) e.preventDefault();
                   }}
                 >
                   View Details
                 </Link>
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
              No transactions found for this status.
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

