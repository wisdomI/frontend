'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import CustomDropdown from '@/components/ui/CustomDropdown'

interface EscrowDashboardProps {
  basePath?: string
}

export default function EscrowDashboard({ basePath = '/escrow-admin' }: EscrowDashboardProps) {
  const stats = [
    { label: 'Funded', value: 45, color: 'text-[#0B2E6F]', border: 'border-[#0B2E6F]' },
    { label: 'Pending', value: 23, color: 'text-[#EAB308]', border: 'border-[#EAB308]' },
    { label: 'Released', value: 156, color: 'text-[#22C55E]', border: 'border-[#22C55E]' },
    { label: 'Disputed', value: 8, color: 'text-[#EF4444]', border: 'border-[#EF4444]' },
  ]

  const allTransactions = [
    { 
      id: 'ESC-2089',
      event: 'Wedding Setup',
      client: 'John Doe',
      vendor: 'Royal Events',
      amount: '₦1,500,000',
      status: 'Funded',
      statusColor: 'bg-[#E0E7FF] text-[#0B2E6F]'
    },
    { 
      id: 'ESC-2090',
      event: 'Birthday Party',
      client: 'Sarah Mike',
      vendor: 'Sparkle Decor',
      amount: '₦500,000',
      status: 'Pending',
      statusColor: 'bg-[#FEF3C7] text-[#D97706]'
    },
    { 
      id: 'ESC-2091',
      event: 'Product Launch',
      client: 'Sunbirds Nutrition',
      vendor: 'Elite Catering',
      amount: '₦820,000',
      status: 'Funded',
      statusColor: 'bg-[#E0E7FF] text-[#0B2E6F]'
    },
    { 
      id: 'ESC-2092',
      event: 'Birthday Party',
      client: 'Sarah Mike',
      vendor: 'Sparkle Decor',
      amount: '₦500,000',
      status: 'Pending',
      statusColor: 'bg-[#FEF3C7] text-[#D97706]'
    },
    { 
      id: 'ESC-2093',
      event: 'Corporate Event',
      client: 'Tech Corp',
      vendor: 'Sound Systems',
      amount: '₦2,500,000',
      status: 'Released',
      statusColor: 'bg-[#DCFCE7] text-[#166534]'
    },
  ]

  const [statusFilter, setStatusFilter] = useState('All Status')

  const filteredTransactions = statusFilter === 'All Status' 
    ? allTransactions 
    : allTransactions.filter(tx => tx.status === statusFilter)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-asul text-gray-800 flex items-center gap-2">
          Welcome Back, Escrow & Analytics Admin <span className="text-2xl">👋🏽</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`bg-white p-6 rounded-2xl border ${stat.border} shadow-sm flex flex-col items-center justify-center text-center h-40`}>
            <span className={`text-4xl font-bold font-asul ${stat.color} mb-2`}>{stat.value}</span>
            <span className={`text-sm font-medium text-gray-600`}>{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Vendor Progress Tracker Link */}
      <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
        <div>
          <h3 className="text-gray-900 font-semibold">Vendor Progress Tracker</h3>
          <p className="text-sm text-gray-500">10 active projects</p>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </div>

      <div className="bg-transparent space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Escrow Transactions</h2>
          <div className="w-40">
             <CustomDropdown 
               options={[
                 { label: 'All Status', value: 'All Status' },
                 { label: 'Pending', value: 'Pending' },
                 { label: 'Funded', value: 'Funded' },
                 { label: 'Released', value: 'Released' },
                 { label: 'Disputed', value: 'Disputed' },
               ]}
               selected={statusFilter}
               onChange={setStatusFilter}
               buttonClassName="py-1.5 px-3 text-sm"
             />
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-800">{tx.event}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Client: {tx.client} → Vendor: {tx.vendor}
                </p>
                <p className="text-lg font-bold text-[#0B2E6F]">{tx.amount}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                 <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${tx.statusColor} w-full sm:w-auto text-center min-w-[100px]`}>
                   {tx.status}
                 </span>
                 <Link 
                   href={`${basePath}/transaction/${tx.id}`}
                   className="bg-[#0B2E6F] text-white px-6 py-2 rounded-lg hover:bg-[#09255a] transition-colors text-sm font-medium w-full sm:w-auto text-center whitespace-nowrap"
                 >
                   View Details
                 </Link>
              </div>
            </div>
          ))}
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg">
              No transactions found for this status.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

